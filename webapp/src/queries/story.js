import { gql } from 'apollo-boost';

export const GET_STORY = gql`
  query GetStory($id: ID!) {
    story(id: $id) {
      id
      title
      author
      avatar
      canonicalUrl
      tocLastChecked
      updated_at
      created_at
      details {
        description
        information
      }
      posts {
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
  }
`;

export const DELETE_STORY = gql`
  mutation DeleteStory($id: ID!) {
    deleteStory(id: $id)
  }
`;

export const TOC_CHECKED = gql`
  mutation TOCChecked($storyId: ID!) {
    tocChecked(storyId: $storyId)
  }
`;

export const GET_STORIES = gql`
  {
    stories {
      id
      title
      author
      avatar
      canonicalUrl
      tocLastChecked
      updated_at
      created_at
      details {
        description
        information
      }
      posts {
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
  }
`;
