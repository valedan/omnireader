import React, { useState } from "react";
import styled from "styled-components";
import Paper from "@material-ui/core/Paper";
import { useQuery } from "@apollo/react-hooks";
import List from "@material-ui/core/List";
import { StoryListItem } from "./StoryListItem";
import { AddStory } from "./AddStory";
import { GET_STORIES } from "../../queries/story";
import { useMedScreen } from "../shared/breakpoints";
import { SectionHeader } from "../shared/SectionHeader";

export const Library = () => {
  const { loading, error, data, refetch } = useQuery(GET_STORIES);
  const [open, setOpen] = useState(null);
  const medScreen = useMedScreen();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const handleChange = index => (event, isOpen) => {
    setOpen(isOpen ? index : false);
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
                open={open === index}
                handleChange={handleChange(index)}
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
