const User = require('../models/User');
const dbo = require('../../db/conn');

module.exports = class UserRepository {
    async getUser(username) {
        try {
            const dbConnect = dbo.getDb();
            let result = await dbConnect.collection('users').findOne({username: username});
            console.log(result)
            return result;
        } catch (err) {
            console.log(err);
        }
    }

    async getAllUsers() {
        try {
            const dbConnect = dbo.getDb();
            let result = await dbConnect.collection('users').find({}).toArray();
            console.log(result)
            return result;
    
        } catch (err) {
            console.log(err);
        }
    }
}