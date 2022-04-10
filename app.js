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
const { frontendUrl } = require('constants');

var corsOptions = {
    credentials: true,
    origin: frontendUrl,
    optionsSuccessStatus: 200
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

app.use(express.static(path.resolve(__dirname, "./frontend/build")));

app.use(function (req, res, next){
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    let cookies = cookie.parse(req.headers.cookie || '');
    req.username = (cookies.username) ? cookies.username : '';
    context.user = req.username;
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

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
    context: context,
}));

app.get('*', (req, res, next) => {
    res.sendFile(path.join(__dirname, 'frontend/build/index.html'));
  });

const http = require('http');
const httpServer = http.createServer(app);
const io = require('socket.io')(httpServer, {
    cors: {
        origin: '*',
    }
});
const { fstat } = require('fs');
const { isatty } = require('tty');
const { Console } = require('console');
const PORT = process.env.PORT || 3001;


dbo.connectToServer(function (err) {
    if (err) {
        console.error(err);
        process.exit();
    }

    // start the Express server
    httpServer.listen(PORT, function (err) {
        if (err) console.log(err);
        else console.log("HTTP server on https://envisionit-app.herokuapp.com/:%s", PORT);
    });

    io.on('connection', async (socket) => {

        socket.on('join-room', (data) => {
            socket.join(data.id);
        });

        socket.on('sendStroke', (data) => {
            socket.in(data.id).emit('receiveStroke', data.canvasStroke);
        });
    });
});
