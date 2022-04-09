const User = require("../models/User");
const dbo = require("../../db/conn");

module.exports = class UserRepository {
  async getUser(username) {
    try {
      const dbConnect = dbo.getDb();
      let result = await dbConnect
        .collection("users")
        .findOne({ username: username });
      if (!result) throw new Error("User does not exist with that username");
      return result;
    } catch (err) {
      throw new Error(err);
    }
  }

  async getAllUsers() {
    try {
      const dbConnect = dbo.getDb();
      let result = await dbConnect.collection("users").find({}).toArray();
      return result;
    } catch (err) {
      throw new Error(err);
    }
  }

  async createUser(
    username,
    password,
    email,
    firstName,
    lastName,
    city,
    phone
  ) {
    try {
      const dbConnect = dbo.getDb();
      let result = await dbConnect
        .collection("users")
        .findOne({ creator: creator, title: title, isShared: isShared });
      // console.log(result)
      if (!result) {
        const userDoc = new User(
          username,
          password,
          email,
          firstName,
          lastName,
          city,
          phone
        );
        result = await dbConnect.collection("users").insertOne(userDoc);
        return userDoc;
      } else {
        throw new Error("User with that name already exists");
      }
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  }

  async updateUser(currentUser, email, firstName, lastName, city, phone) {
    try {
      const dbConnect = dbo.getDb();
      let result = await dbConnect
        .collection("users")
        .findOne({ username: currentUser });
      if (result) {
        const updated = new User(
          result.username,
          result.password,
          email || result.email,
          firstName || result.firstName,
          lastName || result.lastName,
          city || result.city,
          phone || result.phone
        );
        const updateDoc = { $set: updated };
        result = await dbConnect
          .collection("users")
          .updateOne({ username: currentUser }, updateDoc);
        // console.log(result)
        return updated;
      } else {
        throw new Error("User could not be found");
      }
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  }
};
