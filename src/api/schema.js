import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Query {
    stories: [Story]!
    story(id: ID!): Story
    post(id: ID!): Post
    posts(storyId: ID!): [Post]!
  }

  type Mutation {
    createPost(url: String): Post
    updateProgress(postId: ID!, progress: Float!): Post
    tocChecked(storyId: ID!): Boolean
    deleteStory(id: ID!): Boolean
    deletePost(id: ID!): Boolean
  }

  type Story {
    id: ID!
    canonicalUrl: String
    title: String
    author: String
    avatar: String
    details: StoryDetails
    tocLastChecked: String
    updated_at: String
    created_at: String
    posts: [Post]
  }

  type Post {
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
    updated_at: String
    created_at: String
    story: Story
  }

  type StoryDetails {
    description: String
    information: String
  }
`;

export default typeDefs;
