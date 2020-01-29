import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Button } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import ProgressBar from '../shared/ProgressBar';
import { OmniChip } from '../shared/OmniChip';

export const PostListItem = ({ post }) => {
  return (
    <Wrapper>
      <PostLink to={`/post/${post.id}`}>
        <TitleRow>
          <PostTitle>{post.title}</PostTitle>
          {post.new && <OmniChip label="New" color="secondary" size="small" />}
        </TitleRow>
        {post.progress > 0 && (
          <ProgressBar value={post.progress * 100} showPercent />
        )}
      </PostLink>
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

const PostTitle = styled.h3`
  margin: 0;
  font-family: 'Merriweather', serif;
`;

const PostLink = styled(Link)`
  height: 100%;
  width: 100%;
  text-decoration: none;
  color: ${grey[900]};
`;
