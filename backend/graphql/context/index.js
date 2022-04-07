//const users = require('./resolvers/users');
const UserRepository = require('../repository/UserRepository');
const CanvasRepository = require('../repository/CanvasRepository');

module.exports = {
  resolver: {
    //users,
  },
  repository: {
    user: new UserRepository(),
    canvas: new CanvasRepository(),
  },
};