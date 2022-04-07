module.exports = {
    constructor(username, email, password, firstName, lastName, city, phone) {
      this.username = username;
      this.email = email;
      this.password = password;
      this.firstName = firstName;
      this.lastName = lastName;
      this.city = city;
      this.phone = phone;
      this.creationDate = new Date();
    }
  }