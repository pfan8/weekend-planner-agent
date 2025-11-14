import { buildSchema } from "graphql";

/**
 * GraphQL Schema 定义
 */
export const schema = buildSchema(`
  type Message {
    role: String!
    content: String!
  }

  input MessageInput {
    role: String!
    content: String!
  }

  type ChatResponse {
    content: String!
  }

  type Query {
    _empty: String
    health: String!
  }

  type Mutation {
    chat(messages: [MessageInput!]!): ChatResponse!
  }
`);

