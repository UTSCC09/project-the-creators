const { buildSchema } = require('graphql');

module.exports = buildSchema(`
  type Query {
    getUser(username: String!): User
    getAllUsers: [User]
    getCanvas(id: ID!): Canvas
  }

  type Mutation {
    createUser(input: NewUserInput): User
    updateUser(input: UpdateUserInput): User
    createCanvas(input: NewCanvasInput): Canvas
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
    thumbnail: String
    isShared: Boolean!
    collaborators: [User]
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
    creator: String!
    isShared: Boolean!
  }
`);