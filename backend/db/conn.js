// TODO: Credit https://www.mongodb.com/languages/express-mongodb-rest-api-tutorial
const { MongoClient } = require("mongodb");
//const connectionString = process.env.ATLAS_URI;
const connectionString = 'mongodb://localhost:27017/'
const client = new MongoClient(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let dbConnection;

module.exports = {
    connectToServer: function (callback) {
      client.connect(function (err, db) {
        if (err || !db) {
          return callback(err);
        }
  
        dbConnection = db.db("envisionit_db");
        console.log("Successfully connected to MongoDB.");
  
        return callback();
      });
    },
  
    getDb: function () {
      return dbConnection;
    },
  };