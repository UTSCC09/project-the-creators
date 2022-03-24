const path = require('path');
const express = require('express');
const file = require('file-system');
const fs = require('fs');
const session = require('express-session');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cookie = require('cookie');
const dbo = require('./db/conn');

const app = express();
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

let User = function (username, hashedPassword, email) {
    this.username = username;
    this.email = email;
    this.hashedPassword = hashedPassword;
    this.creationDate = new Date();
}

let Image = function (req) {
    const date = new Date();
    this.title = req.body.title; 
    this.author = req.session.username;
    this.path = req.file.path;
    this.mimetype = req.file.mimetype;
    this.date = date.toUTCString();
};

let Comment = function (req) {
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

function isLast(page, total) {
    return (total < 10 || total - page <= page || (total + page) % 10 == 0);
}

// curl -H "Content-Type: application/json" -X POST -d '{"username":"alice","password":"alice"}' -c cookie.txt localhost:3000/signup/
app.post('/signup/', function (req, res, next) {
    const dbConnect = dbo.getDb();
    const username = req.body.username;
    const password = req.body.password;
    bcrypt.hash(password, saltedRounds, function(err, hash) {
        if (err) return res.status(500).end(err);
        dbConnect.collection('users').findOne({username: username}, function (err, user) {
            if (err) return res.status(500).end(err, user);
            if (user) return res.status(409).end("username " + username + " already exists");
            const userDoc = new User(username, hash, req.body.email);
            dbConnect.collection('users').insertOne(userDoc, function (err, result) {
                if (err) return res.status(500).end(err);
                console.log(`Added a new match with id ${result.insertedId}`);
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
app.post('/signin/', function (req, res, next) {
    const dbConnect = dbo.getDb();
    req.session.username = req.body.username;
    var username = req.session.username;
    var password = req.body.password;
    // retrieve user from the database
    dbConnect.collection('users').findOne({username: username}, function (err, user) {
        console.log(user)
        if (err) return res.status(500).end(err);
        if (!user) return res.status(401).end("The username or password is incorrect.");
        bcrypt.compare(password, user.hashedPassword, function(err, result) {
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
//app.get('/signout/', function (req, res, next) {
//    res.setHeader('Set-Cookie', cookie.serialize('username', '', {
//          path : '/', 
//          maxAge: 60 * 60 * 24 * 7 // 1 week in number of seconds
//    }));
//    // delete session
//    req.session.destroy(function(err) {
//        if (err) return res.status(500).end(err);
//        res.json(null);
//    });
//});

///// Create
//app.post('/api/images', isAuthenticated, upload.single('image'), function (req, res, next) {
//    const image = new Image(req);
//    images.insert(image, function (err, item) {
//        if (err) return res.status(500).end(err);
//        return res.json(item);
//    });
//});

//app.post('/api/comments', isAuthenticated, function (req, res, next) {
//    const comment = new Comment(req);
//    comments.insert(comment, function (err, item) {
//        if (err) return res.status(500).end(err);
//        return res.json(item);
//    });
//});

///// Read
//app.get('/api/images/:id', isAuthenticated, function (req, res, next) {
//    // Return empty object if there are no images
//    images.count({author: req.params.id}, function(err, count) {
//        if (err) return res.status(500).end(err);
//        if (count == 0)
//            return res.json(null);
//        images.find({author: req.params.id}).sort({createdAt:-1}).exec(function(err, items) { 
//            if (err) return res.status(500).end(err);
//            res.json(items.reverse());
//        });
//    });
//});

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

