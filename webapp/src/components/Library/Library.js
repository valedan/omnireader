import React, { useState } from "react";
import styled from "styled-components";
import Paper from "@material-ui/core/Paper";
import { useQuery, useMutation } from "@apollo/react-hooks";
import List from "@material-ui/core/List";
import { StoryListItem } from "./StoryListItem";
import { AddStory } from "./AddStory";
import { GET_STORIES, TOC_CHECKED } from "../../queries/story";
import { useMedScreen } from "../shared/breakpoints";
import { SectionHeader } from "../shared/SectionHeader";

export const Library = () => {
  const { loading, error, data, refetch } = useQuery(GET_STORIES);
  const [open, setOpen] = useState(null);
  const medScreen = useMedScreen();

  const [sendTOCChecked] = useMutation(TOC_CHECKED);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  const handleChange = id => (event, isOpen) => {
    setOpen(isOpen ? id : false);
    if (isOpen) {
      sendTOCChecked({
        variables: { storyId: id }
      });
    }
  };

  return (
    <Wrapper>
      {medScreen && <AddStory onSuccess={() => refetch()} />}
      <ListWrapper>
        <SectionHeader>Your Library</SectionHeader>
        <List>
          {data.stories.map((story, index) => {
            return (
              <StoryListItem
                // TODO: passing refetch down here seems like a code smell
                refetch={refetch}
                open={open === story.id}
                handleChange={handleChange(story.id)}
                key={story.id}
                story={story}
              />
            );
          })}
        </List>
      </ListWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  @media (min-width: 700px) {
    padding: 2%;
    min-width: 700px;
    width: 80%;
  }
  @media (max-width: 700px) {
    width: 100%;
  }
  margin: auto;
  text-align: center;
`;

const ListWrapper = styled(Paper)`
  @media (max-width: 700px) {
    ul {
      padding: 0;
    }
  }
  @media (min-width: 700px) {
    margin-top: 2%;
    padding: 2%;
  }
  padding-top: 1%;
`;
