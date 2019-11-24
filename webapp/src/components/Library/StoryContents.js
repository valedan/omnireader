import React, { useState } from "react";
import styled from "styled-components";
import List from "@material-ui/core/List";
import { ChapterListItem } from "./ChapterListItem";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";

export const StoryContents = ({ story }) => {
  return (
    <Wrapper>
      <Heading>Contents</Heading>
      <List>
        {story.chapters.map((chapter, index) => {
          return (
            <ChapterListItem
              first={index === 0}
              key={chapter.id}
              chapter={chapter}
            />
          );
        })}
      </List>
    </Wrapper>
  );
};

const Wrapper = styled(ExpansionPanelDetails)`
  max-height: 50vh;
  overflow-y: scroll;
  padding-left: 5%;
  padding-right: 5%;
`;

const Heading = styled.h2`
  font-family: cursive;
`;
