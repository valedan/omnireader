import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import { GET_POST } from '../../queries/post';
import { ReaderContent } from './ReaderContent';
import { useInterval } from '../../hooks/useInterval';
import { useMutation } from '@apollo/react-hooks';
import { UPDATE_PROGRESS } from '../../queries/post';
import ProgressBar from '../shared/ProgressBar';
import { Divider, Paper } from '@material-ui/core';
import { PostNavBar } from './PostNavBar';

export const Reader = () => {
  const { id } = useParams();
  const [progress, setProgress] = useState(null);

  const { loading, error, data } = useQuery(GET_POST, { variables: { id } });
  const [sendProgress] = useMutation(UPDATE_PROGRESS);

  const updateProgress = progress => {
    setProgress(progress);
  };

  useInterval(() => {
    if (!data || progress === data.post.progress) return;
    sendProgress({
      variables: { postId: data.post.id, progress: progress },
    });
  }, 1000);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  const post = data.post;

  const content = `<h1>${post.title}</h1>` + post.content;

  return (
    <Wrapper>
      {post && (
        <Inner>
          <TopNav>{<PostNavBar post={post} />}</TopNav>
          <Divider style={{ alignSelf: 'stretch' }} />
          <ReaderContent
            updateProgress={updateProgress}
            post={post}
            content={content}
          />
          <ProgressWrapper>
            {/* TODO: For some reason, can't style ProgressBar directly */}
            {/* TODO: progress is momentarily stale when changing chapter */}
            <ProgressBar value={progress * 100} showPercent />
          </ProgressWrapper>
        </Inner>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  margin: auto;
`;

const Inner = styled(Paper)`
  display: flex;
  width: 100%;
  max-height: 100vh;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

const TopAndBottom = `
padding-left: 4vw;
padding-right: 4vw;
  @media (min-width: 900px) {
    max-width: 900px;
  }
  @media (max-width: 900px) {
    max-width: 900px;
    padding-left: 4vw;
    padding-right: 4vw;
  }
  width: 100%;
`;
const ProgressWrapper = styled.div`
  ${TopAndBottom}
  margin-top: 12px;
`;

const TopNav = styled.div`
  ${TopAndBottom}
`;
