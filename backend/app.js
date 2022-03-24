const path = require('path');
const express = require('express');
const file = require('file-system');
const fs = require('fs');
const session = require('express-session');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cookie = require('cookie');
const dbo = require('./db/conn');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(session({
    secret: 'thisisasecret',
    resave: false,
    saveUninitialized: true
}));

const saltedRounds = 10;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('../frontend'));

app.use(function (req, res, next){
    req.username = (req.session.username) ? req.session.username : '';
    console.log("HTTP request", req.method, req.url, req.body);
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

let Comment = function (body) {
    const date = new Date();
    this.imageId = req.body.imageId; 
    this.author = req.body.author;
    this.content = req.body.content;
    this.date = date.toUTCString();
};

const isAuthenticated = function(req, res, next) {
    if (!req.username) return res.status(401).end("access denied");
    next();
};

// curl -H "Content-Type: application/json" -X POST -d '{"username":"alice","password":"alice"}' -c cookie.txt localhost:3000/signup/
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
                //res.status(204).send();
            })
        })
    });
});


// curl -H "Content-Type: application/json" -X POST -d '{"username":"alice","password":"alice"}' -c cookie.txt localhost:3000/signin/
app.post('/auth/signin/', function (req, res, next) {
    const dbConnect = dbo.getDb();
    req.session.username = req.body.username;
    const username = req.session.username;
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
            return res.json(username);
        });
    });
});

//// curl -b cookie.txt -c cookie.txt localhost:3000/signout/
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

//app.get('/api/images/:id/image', isAuthenticated, function (req, res, next) {
//    images.findOne({'_id': req.params.id}, function(err, image) {
//        if (err) return res.status(500).end(err);
//        if (!image) return res.status(400).end("Image " + req.params.id + " does not exist!");
//        res.setHeader('Content-Type', image.mimetype);
//        res.sendFile(image.path);
//    });
//});

//app.get('/api/users/', isAuthenticated, function (req, res, next) {
//    users.count({}, function(err, count) {
//        if (err) return res.status(500).end(err);
//        let page = parseInt(req.query.page) * 20;
//        let isLastPage = isLast(page, count);
//        users.find({}).skip(page).limit(10).exec(function(err, items) {
//            if (err) return res.status(500).end(err);
//            if (!items) return res.status(404).end("Comments under image # " + req.params.id + " do not exist.");
//            // Remove the unneeded information
//            const users = items.map(a => a._id);
//            const result = {
//                'users': users,
//                'isLast': isLastPage
//            };
//            return res.json(result);
//        });
//    });
//});

//app.get('/api/comments/:id', isAuthenticated, function (req, res, next) {
//    comments.count({'imageId': req.params.id}, function(err, count) {
//        if (err) return res.status(500).end(err);
//        let page = parseInt(req.query.page) * 10;
//        let isLastPage = isLast(page, count);
//        comments.find({'imageId': req.params.id}).sort({createdAt: -1}).skip(page).limit(10).exec(function(err, items) {
//            if (err) return res.status(500).end(err);
//            if (!items) return res.status(404).end("Comments under image # " + req.params.id + " do not exist.");
//            const result = {
//                'comments': items,
//                'isLast': isLastPage
//            };
//            return res.json(result);
//        });
//    });
//});

///// Delete
//app.delete('/api/images/:id', isAuthenticated, function (req, res, next) {
//    images.findOne({_id: req.params.id}, function(err, image) {
//        if (err) return res.status(500).end(err);
//        if (!image) return res.status(404).end("Image with id # " + req.params.id + " does not exist.");
        
//        images.remove({_id: image._id}, {multi: false}, function(err) {
//            if (err) return res.status(500).end(err);
//            // Delete all of the comments associated with the image as well
//            comments.remove({'imageId': image._id}, {multi: true}, function(err) {
//                if (err) return res.status(500).end(err);
//                // Remove from fs
//                file.unlink(image.path, function (err) {
//                    if (err) return res.status(500).end(err);
//                    res.json(image);
//                });
//            });
//        });
//    });
//});

//app.delete('/api/comments/:id', isAuthenticated, function (req, res, next) {
//    comments.findOne({_id: req.params.id}, function(err, comment) {
//        if (err) return res.status(500).end(err);
//        if (!comment) return res.status(404).end("Comment with id # " + req.params.id + " does not exist.");
//        comments.remove({_id: req.params.id}, {multi: false}, function(err) {
//            if (err) return res.status(500).end(err);
//            res.json(comment);
//        });
//    });
//});

const http = require('http');
const { fstat } = require('fs');
const { isatty } = require('tty');
const PORT = 3001;


dbo.connectToServer(function (err) {
    if (err) {
        console.error(err);
        process.exit();
    }

    // start the Express server
    http.createServer(app).listen(PORT, function (err) {
        if (err) console.log(err);
        else console.log("HTTP server on http://localhost:%s", PORT);
    });
});

