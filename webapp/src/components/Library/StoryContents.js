import React from "react";
import styled from "styled-components";
import List from "@material-ui/core/List";
import { ChapterListItem } from "./ChapterListItem";
import { StoryDescription } from "./StoryDescription";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import { Divider, useMediaQuery } from "@material-ui/core";

export const StoryContents = ({ refetch, story }) => {
  const bigScreen = useMediaQuery("(min-width:700px)");

  return (
    <Wrapper>
      <Divider />
      <StoryDescription refetch={refetch} story={story} />
      {!bigScreen && <Header>Chapters</Header>}

      <StyledList>
        {story.chapters.map(chapter => {
          return (
            <>
              <Divider />
              <ChapterListItem key={chapter.id} chapter={chapter} />
            </>
          );
        })}
      </StyledList>
    </Wrapper>
  );
};

const StyledList = styled(List)`
  && {
    padding-top: 0;
  }
`;

const Header = styled.h1`
  font-family: cursive;
  overflow: hidden;
  text-align: center;
  margin-top: 40px;
  margin-bottom: 40px;

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

const Wrapper = styled(ExpansionPanelDetails)`
  @media (min-width: 700px) {
    /* max-height: 50vh; */
  }
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: scroll;
  ::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 7px;
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: rgba(0, 0, 0, 0.5);
    box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
  }

  && {
    padding: 0;
  }
`;
