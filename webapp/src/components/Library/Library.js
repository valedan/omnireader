import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useQuery } from "@apollo/react-hooks";
import List from "@material-ui/core/List";
import { StoryListItem } from "./StoryListItem";
import { AddStory } from "./AddStory";
import { GET_STORIES } from "../../queries/story";

export const Library = () => {
  const { loading, error, data, refetch } = useQuery(GET_STORIES);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <Wrapper>
      <AddStory onSuccess={() => refetch()} />
      <List>
        {data.stories.map(story => {
          return <StoryListItem story={story}></StoryListItem>;
        })}
      </List>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding-top: 5%;
  margin: auto;
  width: 80%;
  text-align: center;
`;
