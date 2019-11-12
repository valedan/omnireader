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
