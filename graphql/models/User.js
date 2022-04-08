module.exports = class User {
    constructor(username, password, email, firstName, lastName, city, phone) {
      const date = new Date();
      this.username = username;
      this.password = password;
      this.email = email;
      this.firstName = firstName;
      this.lastName = lastName;
      this.city = city;
      this.phone = phone;
      this.creationDate = date.toUTCString();
    }
  }