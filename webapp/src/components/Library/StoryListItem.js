import React, { useState, useEffect } from "react";
import styled from "styled-components";

import { StoryContents } from "./StoryContents";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import LinearProgress from "@material-ui/core/LinearProgress";
import { lighten, desaturate } from "polished";
import grey from "@material-ui/core/colors/grey";
import lightBlue from "@material-ui/core/colors/lightBlue";
import Card from "@material-ui/core/Card";
import { ListItem, Button, Divider } from "@material-ui/core";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ChevronRight from "@material-ui/icons/ChevronRight";
import _ from "lodash";
import { Link } from "react-router-dom";

export const StoryListItem = ({ story, first, open, handleChange }) => {
  const currentChapter =
    _.maxBy(story.chapters, chapter => chapter.progressUpdatedAt) ||
    story.chapters[0];

  const calculateStoryProgress = () => {
    if (story.chapters.length === 0) return 0;
    if (!currentChapter) return 0;

    const totalChapters = story.chapters.length;
    const completedChapters = currentChapter.number - 1;
    return (
      ((completedChapters + 1 * currentChapter.progress) / totalChapters) * 100
    );
  };

  const storyProgress = calculateStoryProgress();

  return (
    <Wrapper expanded={open} onChange={handleChange} elevation={2}>
      <Story first={first} expandIcon={<ExpandMore />}>
        <StoryInside onClick={e => e.stopPropagation()}>
          <StoryImage src="/ffn_logo.jpg" />
          <StorySummary>
            <StoryTitle>{story.title}</StoryTitle>
            <StoryAuthor>{story.author}</StoryAuthor>
            <StoryEssentialInfo>
              <span>{story.chapters.length} chapters</span>
              <span>Updated Today</span>
            </StoryEssentialInfo>

            <StoryProgress
              variant="determinate"
              value={storyProgress}
              color="secondary"
            />
          </StorySummary>
          <Divider orientation="vertical" />
          <ReadButton color="secondary">
            {currentChapter && (
              <StoryLink to={`/chapter/${currentChapter.id}`}>
                {storyProgress === 0 ? "Start" : "Continue"}
                <ChevronRight />
              </StoryLink>
            )}
          </ReadButton>
        </StoryInside>
      </Story>
      <StoryContents story={story} />
    </Wrapper>
  );
};

const StoryInside = styled.div`
  width: 100%;
  height: 7rem;
  display: flex;
  justify-content: space-between;
  background-color: white;
  cursor: default;
`;

const StoryLink = styled(Link)`
  height: 7rem;
  width: 100%;
  color: ${grey[900]};
  text-decoration: none;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
`;

const Story = styled(ExpansionPanelSummary)`

  /* border-top: ${props => props.first && "1px solid grey"}; */
  /* border-bottom: 1px solid grey; */
  &&{
    .MuiExpansionPanelSummary-content {
      margin: 0;
    }
    .MuiExpansionPanelSummary-expandIcon{
      margin: 0 16px;

    }
    padding: 0;
    flex-direction: row-reverse;

  }
`;

const StoryTitle = styled.h2`
  margin: 0;
  margin-top: 0.5rem;
`;
const StoryAuthor = styled.span`
  font-style: italic;
  margin-top: 4px;
  display: inline-flex;
  align-self: center;
`;
const StoryEssentialInfo = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 8px;
  margin-bottom: 12px;
  font-family: "Merriweather Sans", sans-serif;
  color: ${lighten(0.3, grey[900])};
`;
const StoryProgress = styled(LinearProgress)``;
const ReadButton = styled(Button)`
  width: 7rem;
  && {
    color: ${grey[900]};
    font-weight: bold;
    font-family: "Merriweather Sans", sans-serif;
    border-radius: 0;
    padding: 0;
    :hover {
      background: ${lightBlue[100]};
    }
  }
  cursor: pointer;
  outline: none;
`;
const Expander = styled(Button)`
  height: 100%;
  width: 10%;
  cursor: pointer;
  outline: none;
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

const Wrapper = styled(ExpansionPanel)`
  /* margin-bottom: 4px; */
`;
