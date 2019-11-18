import { gql } from "apollo-boost";

export const GET_CHAPTER = gql`
  query GetChapter($id: ID!) {
    chapter(id: $id) {
      id
      title
      number
      progress
      progressUpdatedAt
      url
      content
    }
  }
`;

export const UPDATE_PROGRESS = gql`
  mutation UpdateProgress($chapterId: ID!, $progress: Float!) {
    updateProgress(chapterId: $chapterId, progress: $progress) {
      id
      progress
    }
  }
`;
