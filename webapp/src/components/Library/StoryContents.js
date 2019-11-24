import React, { useState } from "react";
import styled from "styled-components";
import List from "@material-ui/core/List";
import { ChapterListItem } from "./ChapterListItem";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import { Divider } from "@material-ui/core";

export const StoryContents = ({ story }) => {
  return (
    <Wrapper>
      {/* <Divider /> */}
      {/* <Heading>Contents</Heading> */}
      <StyledList>
        {story.chapters.map((chapter, index) => {
          return (
            <>
              <Divider />
              <ChapterListItem
                first={index === 0}
                key={chapter.id}
                chapter={chapter}
              />
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

const Wrapper = styled(ExpansionPanelDetails)`
  max-height: 50vh;
  flex-direction: column;
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

const Heading = styled.h2`
  font-family: cursive;
`;
