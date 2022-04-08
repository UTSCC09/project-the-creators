module.exports = {
    getUser: function(args, context) {
      return context.repository.user.getUser(args.username);
    },
    getAllUsers: function(args, context) {
      return context.repository.user.getAllUsers();
    },
    getCanvas: function(args, context) {
      return context.repository.canvas.getCanvas(args.creator, args.title, args.isShared);
    },
    getCanvasById: function(args, context) {
      return context.repository.canvas.getCanvasById(args._id);
    },
    getCanvases: function(args, context) {
      return context.repository.canvas.getCanvases(args.creator, args.isShared, context.user);
    },
    getAllCanvases: function(args, context) {
      return context.repository.canvas.getAllCanvases(args.isShared, context.user);
    },
    createUser: function(args, context) {
      return context.repository.user.createUser(args.input.username, args.input.password, args.input.email, args.input.firstName, args.input.lastName, args.input.city, args.input.phone);
    },
    updateUser: function(args, context) {
      return context.repository.user.updateUser(context.user, args.input.email, args.input.firstName, args.input.lastName, args.input.city, args.input.phone);
    },
    createCanvas: function(args, context) {
      return context.repository.canvas.createCanvas(context.user, args.input.title, args.input.isShared);
    },
    updateCanvas: function(args, context) {
      return context.repository.canvas.updateCanvas(context.user, args.input.title, args.input.thumbnailPath, args.input.isShared, args.input.collaborators);
    },
    updateCanvasById: function(args, context) {
      return context.repository.canvas.updateCanvasById(args.input._id, args.input.thumbnailPath);
    },
    getCollaboratorLink: function(args, context) {
      return context.repository.canvas.getCollaboratorLink(args.creator, args.title, context.user);
    },
};