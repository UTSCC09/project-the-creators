const path = require('path');
const express = require('express');
const file = require('file-system');
const fs = require('fs');
const session = require('express-session');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cookie = require('cookie');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
// TODO: Credit to https://graphql.org/graphql-js/running-an-express-graphql-server/
const { graphqlHTTP } = require('express-graphql');
const dotenv = require('dotenv');
dotenv.config();

const root = require('./graphql/root');
const context = require('./graphql/context');
const schema = require('./graphql/schema/schema');
const dbo = require('./db/conn');

var corsOptions = {
    credentials: true,
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}


const app = express();
app.use(cors(corsOptions));
app.use(session({
    secret: process.env.ENCRYPT_SECRET,
    resave: false,
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    saveUninitialized: true
}));

const saltedRounds = 10;

app.use(bodyParser.urlencoded({ limit: '25mb', extended: false }));
app.use(bodyParser.json({limit: '25mb'}));

app.use(express.static('/frontend'));

app.use(function (req, res, next){
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    let cookies = cookie.parse(req.headers.cookie || '');
    req.username = (cookies.username) ? cookies.username : '';
    context.user = req.username;
    console.log("HTTP request", req.username, req.method, req.url, req.body);
    next();
});


const multer = require('multer');
const upload = multer({dest: path.join(__dirname, 'uploads/')});

let User = function (req) {
    this.username = req.username;
    this.email = req.email;
    this.password = req.password;
    this.firstName = req.firstName;
    this.lastName = req.lastName;
    this.city = req.city;
    this.phone = req.phone;
    this.creationDate = new Date();
}

let Canvas = function (req) {
    const date = new Date();
    this.title = req.body.title; 
    this.creator = req.username;
    //this.path = req.file.path;
    this.isShared = req.body.isShared;
    this.collaborators = [req.username];
    this.date = date.toUTCString();
};

const isAuthenticated = function(req, res, next) {
    if (!req.username) return res.status(401).end("access denied");
    next();
};

const isSameUser = function(req, res, next) {
    if (req.username !== req.params.username) return res.status(401).end("access denied");
    next();
}

app.post('/auth/signup/', function (req, res, next) {
    const dbConnect = dbo.getDb();
    const username = req.body.username;
    const password = req.body.password;
    bcrypt.hash(password, saltedRounds, function(err, hash) {
        if (err) return res.status(500).end(err);
        dbConnect.collection('users').findOne({username: username}, function (err, user) {
            if (err) return res.status(500).end(err, user);
            if (user) return res.status(409).end("username " + username + " already exists");
            req.body.password = hash;
            const userDoc = new User(req.body);
            dbConnect.collection('users').insertOne(userDoc, function (err, result) {
                if (err) return res.status(500).end(err);
                console.log(`Added a new user with id ${result.insertedId}`);
                // initialize cookie
                res.setHeader('Set-Cookie', cookie.serialize('username', username, {
                        path : '/', 
                        maxAge: 60 * 60 * 24 * 7
                }));
                // create session
                req.session.username = username;
                // initialize cookie
                res.setHeader('Set-Cookie', cookie.serialize('username', username, {
                    path : '/', 
                    maxAge: 60 * 60 * 24 * 7
                }));
                return res.json(username);
            })
        })
    });
});

app.post('/auth/signin/', function (req, res, next) {
    const dbConnect = dbo.getDb();
    const username = req.body.username;
    const password = req.body.password;
    // retrieve user from the database
    dbConnect.collection('users').findOne({username: username}, function (err, user) {
        console.log(user)
        if (err) return res.status(500).end(err);
        if (!user) return res.status(401).end("The username or password is incorrect.");
        bcrypt.compare(password, user.password, function(err, result) {
            if (err) return res.status(500).end(err);
            if (!result) return res.status(401).end("The username or password is incorrect.");
            // initialize cookie
            res.setHeader('Set-Cookie', cookie.serialize('username', username, {
                path : '/', 
                maxAge: 60 * 60 * 24 * 7
            }));
            req.session.username = req.body.username;
            return res.json(username);
        });
    });
});

app.get('/auth/signout/', function (req, res, next) {
    res.setHeader('Set-Cookie', cookie.serialize('username', '', {
          path : '/', 
          maxAge: 60 * 60 * 24 * 7 // 1 week in number of seconds
    }));
    // delete session
    req.session.destroy(function(err) {
        if (err) return res.status(500).end(err);
        res.json(null);
    });
});

app.get('/auth/currentUser/', isAuthenticated, function (req, res, next) {
    res.json(req.username);
});

/// Create
app.post('/api/canvas', isAuthenticated, function (req, res, next) {
    const dbConnect = dbo.getDb();
    const canvasTitle = req.body.title;
    dbConnect.collection('canvases').findOne({username: req.username, title: canvasTitle}, function (err, canvas) {
        if (err) return res.status(500).end(err);
        if (canvas) return res.status(409).end("canvas with title " + canvasTitle + " already exists");
        const canvasDoc = new Canvas(req);
        dbConnect.collection('canvases').insertOne(canvasDoc, function (err, result) {
            if (err) return res.status(500).end(err);
            console.log(`Added a new canvas with id ${result.insertedId}`);
            return res.json(result);
        });
    });
});

/// Read
app.get('/api/users', isAuthenticated, function(req, res, next) {
    const dbConnect = dbo.getDb();
    dbConnect.collection('users').find({}).toArray(function (err, users) {
        if (err) return res.status(500).end(err);
        res.json(users);
    });
});

app.get('/api/users/:username', isAuthenticated, isSameUser, function(req, res, next) {
    const dbConnect = dbo.getDb();
    dbConnect.collection('users').findOne({username: req.params.username}, function (err, user) {
        if (err) return res.status(500).end(err);
        res.json(user);
    });
});

app.get('/api/canvas/:id/:title', isAuthenticated, function (req, res, next) {
    const dbConnect = dbo.getDb();
    dbConnect.collection('canvases').findOne({creator: req.params.id, title: req.params.title}, function (err, canvas) {
        if (err) return res.status(500).end(err);
        res.json(canvas);
    });
});

// get shared/private galleries
app.get('/api/gallery/:id/:isShared', isAuthenticated, function (req, res, next) {
    const dbConnect = dbo.getDb();
    // Prevent non-creators from seeing other's private galleries
    const reqUser = req.params.id;
    const isShared = req.params.isShared;
    if (!(isShared) && req.username != reqUser)
        return res.status(401).end("cannot view user " + reqUser + "'s private gallery");
    dbConnect.collection('canvases').find({creator: reqUser, isShared: JSON.parse(isShared.toLowerCase()), collaborators: req.username}).toArray(function (err, canvases) {
        if (err) return res.status(500).end(err);
        res.json(canvases);
    });
});

// Collaboration
app.put('/canvas/:id', isAuthenticated, function (req, res, next) {
    const dbConnect = dbo.getDb();
    const canvasId =  ObjectId(req.params.id);
    // Add the signed in username to the canvas
    dbConnect.collection('canvases').findOne({_id: canvasId}, function (err, canvas) {
        if (err) return res.status(500).end(err);
        // Update the collaborators field
        console.log(canvas)
        let collaborators = canvas.collaborators;
        console.log(collaborators)
        collaborators.push(req.username);
        const updateDoc = { $set: {
            "collaborators": collaborators
        } };
        dbConnect.collection('canvases').updateOne({_id: canvasId}, updateDoc, function (err, updateStatus) {
            if (err) return res.status(500).end(err);
            // TODO: send redirect to canvas
            res.json(updateStatus);
        });
    });
})

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
    context: context,
}));


/// Update
app.put('/api/users/:username', isAuthenticated, isSameUser, function (req, res, next) {
//app.put('/api/users/:username', isAuthenticated, function (req, res, next) {
    // Update the data for the user
    const dbConnect = dbo.getDb();
    // Get the user
    dbConnect.collection('users').findOne({username: req.params.username}, function (err, user) {

        const updateDoc = { $set: {
            "email": req.body.email || user.email, 
            "firstName" : req.body.firstName || user.firstName, 
            "lastName" : req.body.lastName || user.lastName, 
            "city" : req.body.city || user.city, 
            "phone": req.body.phone || user.phone, 
        } };
        dbConnect.collection('users').updateOne({username: req.params.username}, updateDoc, function (err, updateStatus) {
            if (err) return res.status(500).end(err);
            res.json(updateStatus);
        });
    });
})

/// Delete


const http = require('http');
const httpServer = http.createServer(app);
const io = require('socket.io')(httpServer, {
    cors: {
        origin: '*',
    }
});
const { fstat } = require('fs');
const { isatty } = require('tty');
const PORT = 3001;


dbo.connectToServer(function (err) {
    if (err) {
        console.error(err);
        process.exit();
    }

    // start the Express server
    httpServer.listen(PORT, function (err) {
        if (err) console.log(err);
        else console.log("HTTP server on http://localhost:%s", PORT);
    });

    io.on('connection', async (socket) => {

        socket.on('join-room', (data) => {
            console.log("its here");
            console.log(data);
            socket.join(data.id);
        });

        socket.on('sendStroke', (data) => {
            console.log(data.canvasStroke);
            socket.in(data.id).emit('receiveStroke', data.canvasStroke);
            // console.log("\n\n\n\n\n\n");
            // socket.to(data.id).emit('receiveStroke', data);
        });
    });
});
