import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Button } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import ProgressBar from '../shared/ProgressBar';
import { OmniChip } from '../shared/OmniChip';

export const ChapterListItem = ({ chapter }) => {
  return (
    <Wrapper>
      <ChapterLink to={`/post/${chapter.id}`}>
        <TitleRow>
          <ChapterTitle>{chapter.title}</ChapterTitle>
          {chapter.new && (
            <OmniChip label="New" color="secondary" size="small" />
          )}
        </TitleRow>
        {chapter.progress > 0 && (
          <ProgressBar value={chapter.progress * 100} showPercent />
        )}
      </ChapterLink>
    </Wrapper>
  );
};

const Wrapper = styled(Button)`
  height: 5rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding-left: 5%;
  padding-right: 5%;
  && {
    text-transform: none;
    padding-top: 0;
    padding-bottom: 0;
    text-align: left;
    align-items: stretch;
    padding-left: 2%;
    .MuiButton-label {
      a {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
      }
      height: 100%;
      :hover {
        h3 {
          text-decoration: underline;
        }
      }
    }
  }
`;

const TitleRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const ChapterTitle = styled.h3`
  margin: 0;
  font-family: 'Merriweather', serif;
`;

const ChapterLink = styled(Link)`
  height: 100%;
  width: 100%;
  text-decoration: none;
  color: ${grey[900]};
`;
