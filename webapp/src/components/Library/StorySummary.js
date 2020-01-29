import React from 'react';
import styled from 'styled-components';
import grey from '@material-ui/core/colors/grey';
import { Divider } from '@material-ui/core';
import { StoryInfo } from './StoryInfo';
import { Link } from 'react-router-dom';
import { ReadButton } from './ReadButton';
import { useMedScreen } from '../shared/breakpoints';
import storyUtils from '../shared/storyUtils';

export const StorySummary = ({ story, noLink }) => {
  const currentPost = storyUtils.findCurrentPost(story);
  const medScreen = useMedScreen();
  let image = null;
  if (medScreen || noLink) {
    image = <Image src={story.avatar || '/ffn_anon.webp'} />;
  } else {
    image = (
      <ImageReadLink to={`/post/${currentPost.id}`}>
        <Image src={story.avatar || '/ffn_anon.webp'} />
      </ImageReadLink>
    );
  }

  return (
    <Summary onClick={e => e.stopPropagation()} noLink={noLink}>
      <ImageContainer>{image}</ImageContainer>

      <StoryInfo story={story} noLink={noLink} />

      {medScreen && (
        <>
          <Divider orientation="vertical" />
          <ReadButton story={story} />
        </>
      )}
    </Summary>
  );
};

const Summary = styled.div`
  width: 100%;
  @media (min-width: 700px) {
    height: 7rem;
  }
  @media (max-width: 700px) {
    height: 11rem;
    text-align: left;
    cursor: ${props => (props.noLink ? 'default' : 'pointer')};
    :hover {
      background-color: ${props => (props.noLink ? 'inherit' : grey[50])};
    }
  }
  display: flex;
  justify-content: space-between;
  background-color: white;
  cursor: default;
`;

const ImageContainer = styled.div`
  display: flex;
  min-width: 6rem;
  height: 100%;
  align-self: center;
  align-items: center;
  justify-content: center;
`;

const Image = styled.img`
  object-fit: contain;
  max-width: 6rem;
  max-height: 6rem;
`;

const ImageReadLink = styled(Link)`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
