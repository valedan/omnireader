import { gql } from "apollo-boost";

export const GET_STORIES = gql`
  {
    stories {
      id
      title
      author
      canonicalUrl
      chapters {
        id
        title
        number
        progress
        progressUpdatedAt
        url
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
