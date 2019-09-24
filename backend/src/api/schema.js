import { gql } from 'apollo-server';

const typeDefs = gql`
  type Query {
    stories: [Story]!
    chapter(id: ID!): Chapter
  }

  type Mutation {
    createStory(url: String): Story
  }

  type Story {
    id: ID!
    canonicalUrl: String
    title: String
    author: String
    details: String
    chapters: [Chapter]
  }

  type Chapter {
    id: ID!
    title: String
    url: String
    number: Int
    progress: Int
    storyId: Int
    content: String
  }
`;

export default typeDefs;
