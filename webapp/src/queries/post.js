import { gql } from 'apollo-boost';

export const GET_POST = gql`
  query GetPost($id: ID!) {
    post(id: $id) {
      id
      title
      number
      progress
      progressUpdatedAt
      url
      content
      nextId
      prevId
      updated_at
      created_at
    }
  }
`;

export const UPDATE_PROGRESS = gql`
  mutation UpdateProgress($postId: ID!, $progress: Float!) {
    updateProgress(postId: $postId, progress: $progress) {
      id
      progress
    }
  }
`;

export const GET_POSTS = gql`
  query GetPosts($storyId: ID) {
    posts(storyId: $storyId) {
      id
      title
      number
      progress
      progressUpdatedAt
      url
      updated_at
      created_at
    }
  }
`;

export const CREATE_POST = gql`
  mutation CreatePost($url: String!) {
    createPost(url: $url) {
      id
      title
      story {
        id
        author
        canonicalUrl
      }
    }
  }
`;

export const DELETE_POST = gql`
  mutation DeletePost($id: ID!) {
    deletePost(id: $id)
  }
`;
