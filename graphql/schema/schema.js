const { buildSchema } = require('graphql');

module.exports = buildSchema(`
  type Query {
    getUser(username: String!): User
    getAllUsers: [User]
    getCanvas(creator: String!, title: String!): Canvas
    getCanvases(creator: String!, isShared: Boolean!): [Canvas]
    getCollaboratorLink(creator: String!, title: String!): String
  }

  type Mutation {
    createUser(input: NewUserInput): User
    updateUser(input: UpdateUserInput): User
    createCanvas(input: NewCanvasInput): Canvas
    updateCanvas(input: UpdateCanvasInput): Canvas
  }

  type User {
    id: ID!
    username: String!
    email: String!
    password: String!
    firstName: String!
    lastName: String!
    city: String
    phone: String
  }

  type Canvas {
    id: ID!
    title: String!
    creator: String!
    thumbnailPath: String
    isShared: Boolean!
    collaborators: [String]
  }

  input NewUserInput {
    username: String!
    email: String!
    password: String!
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
`);