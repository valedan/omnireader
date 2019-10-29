import React from "react";
import styled from "styled-components";
import TextField from "@material-ui/core/TextField";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";

const storiesQuery = gql`
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
        url
        content
      }
    }
  }
`;

export const Library = () => {
  const { loading, error, data } = useQuery(storiesQuery);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  return (
    <Wrapper>
      <TextField
        label="Add Story"
        placeholder="Enter URL..."
        fullWidth
      ></TextField>
      <List>
        {data.stories.map(story => {
          return <ListItem>{story.title}</ListItem>;
        })}
      </List>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding-top: 5%;
  margin: auto;
  width: 60%;
  text-align: center;
`;
