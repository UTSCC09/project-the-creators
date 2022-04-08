const { buildSchema } = require('graphql');

module.exports = buildSchema(`
  type Query {
    getUser(username: String!): User
    getAllUsers: [User]
    getCanvas(creator: String!, title: String!, isShared: Boolean!): Canvas
    getCanvasById(_id: ID!): Canvas
    getCanvases(creator: String!, isShared: Boolean!): [Canvas]
    getAllCanvases(isShared: Boolean!): [Canvas]
    getCollaboratorLink(creator: String!, title: String!): String
  }

  type Mutation {
    createUser(input: NewUserInput): User
    updateUser(input: UpdateUserInput): User
    createCanvas(input: NewCanvasInput): Canvas
    updateCanvas(input: UpdateCanvasInput): Canvas
    updateCanvasById(input: UpdateCanvasByIdInput): ID
  }

  type User {
    id: ID!
    username: String!
    password: String!
    email: String!
    firstName: String!
    lastName: String!
    city: String
    phone: String
  }

  type Canvas {
    _id: ID!
    title: String!
    creator: String!
    thumbnailPath: String
    isShared: Boolean!
    collaborators: [String]
  }

  input NewUserInput {
    username: String!
    password: String!
    email: String!
    firstName: String!
    lastName: String!
    city: String
    phone: String
  }

  input UpdateUserInput {
    email: String
    firstName: String
    lastName: String
    city: String
    phone: String
  }

  input NewCanvasInput {
    title: String!
    isShared: Boolean!
  }

  input UpdateCanvasInput {
    title: String!
    thumbnailPath: String
    isShared: Boolean
    collaborators: [String]
  }

  input UpdateCanvasByIdInput {
    _id: ID!
    thumbnailPath: String!
  }
`);