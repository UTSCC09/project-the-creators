const User = require('../models/User');
const dbo = require('../../db/conn');

module.exports = class UserRepository {
    async getUser(username) {
        try {
            const dbConnect = dbo.getDb();
            let result = await dbConnect.collection('users').findOne({username: username});
            if (!result)
                throw new Error("User does not exist with that username")
            return result;
        } catch (err) {
            throw new Error(err)
        }
    }

    async getAllUsers() {
        try {
            const dbConnect = dbo.getDb();
            let result = await dbConnect.collection('users').find({}).toArray();
            return result;
        } catch (err) {
            throw new Error(err)
        }
    }
}