const User = require('../models/User');
const dbo = require('../../db/conn');

module.exports = class UserRepository {
    getUser(username) {
        const dbConnect = dbo.getDb();
        dbConnect.collection('users').findOne({username: username}, function (err, user) {
            if (err) return res.status(500).end(err);
            return user;
        });
    }
}