import React, { useState } from "react";
import styled from "styled-components";
import Paper from "@material-ui/core/Paper";
import { useQuery } from "@apollo/react-hooks";
import List from "@material-ui/core/List";
import { StoryListItem } from "./StoryListItem";
import { AddStory } from "./AddStory";
import { GET_STORIES } from "../../queries/story";
import { medScreen } from "../shared/breakpoints";

export const Library = () => {
  const { loading, error, data, refetch } = useQuery(GET_STORIES);
  const [open, setOpen] = useState(null);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const handleChange = index => (event, isOpen) => {
    setOpen(isOpen ? index : false);
  };

  return (
    <Wrapper>
      {medScreen && <AddStory onSuccess={() => refetch()} />}
      <ListWrapper>
        <Header>Your Library</Header>
        <List>
          {data.stories.map((story, index) => {
            return (
              <StoryListItem
                refetch={refetch}
                open={open === index}
                handleChange={handleChange(index)}
                key={story.id}
                story={story}
              ></StoryListItem>
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
  /* This is roughly 45 em/rem. Should tho units be used instead of px? */
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

const Header = styled.h1`
  font-family: cursive;
  overflow: hidden;
  text-align: center;

  :before,
  :after {
    background-color: #000;
    content: "";
    display: inline-block;
    height: 2px;
    position: relative;
    vertical-align: middle;
    width: 30%;
  }

  :before {
    right: 0.5em;
    margin-left: -25%;
  }

  :after {
    left: 0.5em;
    margin-right: -25%;
  }
`;
