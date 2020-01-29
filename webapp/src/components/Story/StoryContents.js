import React, { useEffect } from 'react';
import styled from 'styled-components';
import List from '@material-ui/core/List';
import { ChapterListItem } from './ChapterListItem';
import { StoryDescription } from './StoryDescription';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import { Divider } from '@material-ui/core';
import { useMedScreen } from '../shared/breakpoints';
import { SectionHeader } from '../shared/SectionHeader';

export const StoryContents = ({ refetch, story }) => {
  const medScreen = useMedScreen();
  useEffect(() => {});
  return (
    <Wrapper>
      <Divider />
      <StoryDescription refetch={refetch} story={story} />
      {!medScreen && <SectionHeader>Chapters</SectionHeader>}

      <StyledList>
        {story.posts.map(chapter => {
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

const Wrapper = styled(ExpansionPanelDetails)`
  @media (min-width: 700px) {
    max-height: 50vh;
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
