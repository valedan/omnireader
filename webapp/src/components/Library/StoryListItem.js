import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { StoryContents } from './StoryContents';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import { StorySummary } from './StorySummary';
import { useMedScreen } from '../shared/breakpoints';

export const StoryListItem = ({
  refetch,
  story,
  first,
  open,
  handleChange,
}) => {
  const medScreen = useMedScreen();
  const processedStory = processStory(story);

  if (!processedStory) return <h1> Loading </h1>;
  return (
    <Wrapper expanded={open} onChange={handleChange} elevation={2}>
      <SummaryWrapper first={first} expandIcon={medScreen && <ExpandMore />}>
        <StorySummary story={processedStory} />
      </SummaryWrapper>
      {medScreen && <StoryContents refetch={refetch} story={processedStory} />}
    </Wrapper>
  );
};

const processStory = story => {
  story.newPosts = false;
  story.posts.forEach(post => {
    if (!story.tocLastChecked || post.created_at > story.tocLastChecked) {
      post.new = true;
      story.newPosts = true;
    } else {
      post.new = false;
    }
  });
  return story;
};

const Wrapper = styled(ExpansionPanel)``;

const SummaryWrapper = styled(ExpansionPanelSummary)`
  && {
    .MuiExpansionPanelSummary-content {
      margin: 0;
      max-width: calc(100% - 5rem);
      min-width: calc(100% - 5rem);
      @media (max-width: 700px) {
        max-width: 100%;
        min-width: 100%;
      }
    }
    .MuiExpansionPanelSummary-expandIcon {
      margin: 0 16px;
    }
    padding: 0;
    flex-direction: row-reverse;
    justify-content: space-between;
  }
`;
