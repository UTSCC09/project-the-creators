const { buildSchema } = require('graphql');

module.exports = buildSchema(`
  type Query {
    getUser(id: ID!): User
    getCanvas(id: ID!): Canvas
  }

  type Mutation {
    createUser(input: NewUserInput): User
    updateUser(input: UpdateUserInput): User
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

  type Canvas {
    id: ID!
    quote: String
  }
`);