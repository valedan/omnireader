import { gql } from 'apollo-server';

const typeDefs = gql`
  type Query {
    stories: [Story]!
    chapter(id: ID!): Chapter
  }

  type Mutation {
    createStory(url: String): Story
    updateProgress(chapterId: ID!, progress: Float!): Chapter
    deleteStory(id: ID!): Boolean
  }

  type Story {
    id: ID!
    canonicalUrl: String
    title: String
    author: String
    avatar: String
    details: StoryDetails
    chapters: [Chapter]
  }

  type Chapter {
    id: ID!
    title: String
    url: String
    number: Int
    progress: Float
    progressUpdatedAt: String
    storyId: Int
    content: String
    nextId: Int
    prevId: Int
  }

  type StoryDetails {
    description: String
    information: String
  }
`;

export default typeDefs;
