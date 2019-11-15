import { gql } from "apollo-boost";

export const GET_CHAPTER = gql`
  query GetChapter($id: ID!) {
    chapter(id: $id) {
      id
      title
      number
      progress
      url
      content
    }
  }
`;

export const UPDATE_CHAPTER = gql`
  mutation UpdateChapter($id: ID!, $progress: Float!) {
    updateChapter(id: $id, progress: $progress) {
      id
    }
  }
`;
