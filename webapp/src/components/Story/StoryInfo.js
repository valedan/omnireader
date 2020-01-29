import React from 'react';
import styled from 'styled-components';
import ProgressBar from '../shared/ProgressBar';
import { lighten } from 'polished';
import grey from '@material-ui/core/colors/grey';
import { Link } from 'react-router-dom';
import { useMedScreen } from '../shared/breakpoints';
import storyUtils from '../shared/storyUtils';
import { OmniChip } from '../shared/OmniChip';

export const StoryInfo = ({ story, noLink }) => {
  const medScreen = useMedScreen();
  const getValueFromInfo = (info, key) =>
    info
      .split(' - ')
      .find(item => item.includes(key))
      .split(': ')[1];

  // Use the updated info if it's there, otherwise use published. We're calling it updated in our view anyway.
  const timeKey = story.details.information.includes('Updated')
    ? 'Updated'
    : 'Published';
  const updated = getValueFromInfo(story.details.information, timeKey);

  const storyProgress = storyUtils.calculateStoryProgress(story);
  const Wrapper = medScreen || noLink ? DivWrapper : LinkWrapper;

  return (
    <Wrapper to={`/story/${story.id}`}>
      <MainInfo>
        <Title>{story.title}</Title>
        <Author>{story.author}</Author>
      </MainInfo>
      <ExtraInfo>
        <span>
          {story.posts.length} {story.posts.length === 1 ? 'post' : 'posts'}
          {story.newPosts && (
            <OmniChip label="New" color="secondary" size="small" />
          )}
        </span>
        <span>Updated {updated}</span>
      </ExtraInfo>

      {storyProgress > 0 && <ProgressBar value={storyProgress} showPercent />}
    </Wrapper>
  );
};

const WrapperStyles = `
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex-grow: 1;
  padding-right: 2%;
  padding-left: 2%;
  justify-content: space-around;
  text-decoration: none;
  color: inherit;
`;

const DivWrapper = styled.div`
  ${WrapperStyles}
`;

const LinkWrapper = styled(Link)`
  ${WrapperStyles}
`;

const Title = styled.h2`
  @media (min-width: 700px) {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 1.4em;
  }

  @media (max-width: 700px) {
    font-size: 1.3em;
  }
  margin: 0;
  width: 100%;
`;

const Author = styled.span`
  font-style: italic;
  display: inline-flex;
  align-self: left;
  @media (min-width: 700px) {
    align-self: center;
  }
`;

const MainInfo = styled.div`
  display: flex;
  flex-direction: column;
`;
const ExtraInfo = styled.div`
  display: flex;
  @media (max-width: 700px) {
    flex-direction: column;
    align-items: flex-start;
  }
  span {
    margin-top: 4px;
  }
  justify-content: space-around;
  font-family: 'Merriweather Sans', sans-serif;
  color: ${lighten(0.3, grey[900])};
`;
