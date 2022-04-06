module.exports = {
    getUser: function(args, context) {
      return context.repository.user.getUser(args.username);
    },
    getAllUsers: function(args, context) {
      return context.repository.user.getAllUsers();
    },
    createUser: function(args, context) {
      return context.repository.user.createUser(args.input.firstName, args.input.lastName);
    },
    updateUser: function(args, context) {
      return context.repository.user.updateUser(args.input.id, args.input.firstName, args.input.lastName);
    }
};