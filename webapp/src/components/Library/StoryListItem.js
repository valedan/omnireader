import React from "react";
import styled from "styled-components";

import { StoryContents } from "./StoryContents";
import ExpandMore from "@material-ui/icons/ExpandMore";
import LinearProgress from "@material-ui/core/LinearProgress";
import { lighten } from "polished";
import grey from "@material-ui/core/colors/grey";
import lightBlue from "@material-ui/core/colors/lightBlue";
import { Button, Divider } from "@material-ui/core";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ChevronRight from "@material-ui/icons/ChevronRight";
import _ from "lodash";
import { Link } from "react-router-dom";

export const StoryListItem = ({ story, first, open, handleChange }) => {
  // TODO: these functions should be put in a shared story_utils file
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
      <SummaryWrapper first={first} expandIcon={<ExpandMore />}>
        <Summary onClick={e => e.stopPropagation()}>
          <Image src="/ffn_logo.jpg" />

          <Info>
            <Title>{story.title}</Title>
            <Author>{story.author}</Author>
            <EssentialInfo>
              <span>{story.chapters.length} chapters</span>
              <span>Updated Today</span>
            </EssentialInfo>

            <Progress
              variant="determinate"
              value={storyProgress}
              color="secondary"
            />
          </Info>

          <Divider orientation="vertical" />
          
          <ReadButton color="secondary">
            {currentChapter && (
              <ReadLink to={`/chapter/${currentChapter.id}`}>
                {storyProgress === 0 ? "Start" : "Continue"}
                <ChevronRight />
              </ReadLink>
            )}
          </ReadButton>

        </Summary>
      </SummaryWrapper>
      <StoryContents story={story} />
    </Wrapper>
  );
};

const Wrapper = styled(ExpansionPanel)``;

const SummaryWrapper = styled(ExpansionPanelSummary)`
  && {
    .MuiExpansionPanelSummary-content {
      margin: 0;
    }
    .MuiExpansionPanelSummary-expandIcon {
      margin: 0 16px;
    }
    padding: 0;
    flex-direction: row-reverse;
  }
`;

const Summary = styled.div`
  width: 100%;
  height: 7rem;
  display: flex;
  justify-content: space-between;
  background-color: white;
  cursor: default;
`;

const Image = styled.img`
  padding: 0.5rem;
  max-width: 6rem;
`;

const Info = styled.div`
  display: "flex";
  flex-direction: "column";
  flex-grow: 1;
  padding-right: 4%;
  padding-left: 4%;
`;

const Title = styled.h2`
  margin: 0;
  margin-top: 0.5rem;
`;

const Author = styled.span`
  font-style: italic;
  margin-top: 4px;
  display: inline-flex;
  align-self: center;
`;

const EssentialInfo = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 8px;
  margin-bottom: 12px;
  font-family: "Merriweather Sans", sans-serif;
  color: ${lighten(0.3, grey[900])};
`;

const Progress = styled(LinearProgress)``;

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

const ReadLink = styled(Link)`
  height: 7rem;
  width: 100%;
  color: ${grey[900]};
  text-decoration: none;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
`;
