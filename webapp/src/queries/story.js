import { gql } from "apollo-boost";

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
      chapters {
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
      chapters {
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

export const CREATE_STORY = gql`
  mutation CreateStory($url: String!) {
    createStory(url: $url) {
      id
      title
      author
      canonicalUrl
      chapters {
        id
        title
        number
        url
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
