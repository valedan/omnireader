import React, { useState } from "react";
import styled from "styled-components";

import { StoryContents } from "./StoryContents";
import ChevronRight from "@material-ui/icons/ChevronRight";
import LinearProgress from "@material-ui/core/LinearProgress";

export const StoryListItem = ({ story, first }) => {
  const [open, setOpen] = useState(false);
  const storyProgress = 0;
  return (
    <Wrapper onClick={() => setOpen(!open)}>
      <Story first={first}>
        <Expander>
          <ChevronRight />
        </Expander>
        <StoryImage src="/ffn_logo.jpg" />
        <StorySummary>
          <StoryTitle>{story.title}</StoryTitle>
          <StoryAuthor>{story.author}</StoryAuthor>
          <StoryEssentialInfo>
            <span>{story.chapters.length} chapters</span>
            <span>Updated Today</span>
          </StoryEssentialInfo>

          <StoryProgress variant="determinate" value={storyProgress} />
        </StorySummary>
        <ReadButton>{storyProgress === 0 ? "Start" : "Continue"}</ReadButton>
      </Story>
      {open && <StoryContents story={story} />}
    </Wrapper>
  );
};

const Story = styled.div`
  width: 100%;
  height: 7rem;
  display: flex;
  justify-content: space-between;
  /* border-top: ${props => props.first && "1px solid grey"}; */
  /* border-bottom: 1px solid grey; */
`;

const StoryTitle = styled.h2`
  margin: 0;
  margin-top: 0.5rem;
`;
const StoryAuthor = styled.span`
  font-style: italic;
`;
const StoryEssentialInfo = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 8px;
  margin-bottom: 12px;
`;
const StoryProgress = styled(LinearProgress)``;
const ReadButton = styled.button`
  width: 10%;
  background: none;
  border: none;
`;
const Expander = styled.button`
  height: 100%;
  width: 10%;
  background: none;
  border: none;
`;

const StoryImage = styled.img`
  padding: 0.5rem;
  max-width: 6rem;
`;

const StorySummary = styled.div`
  display: "flex";
  flex-direction: "column";
  flex-grow: 1;
  padding-right: 4%;
  padding-left: 4%;
`;

const Wrapper = styled.div`
  margin: auto;
  cursor: pointer;
  width: 100%;

  text-align: center;
`;
