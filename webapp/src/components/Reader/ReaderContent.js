import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import LinearProgress from "@material-ui/core/LinearProgress";
import { UPDATE_PROGRESS } from "../../queries/chapter";
import { useMutation } from "@apollo/react-hooks";
import { useInterval } from "../../hooks/useInterval";
import Paper from "@material-ui/core/Paper";

export const ReaderContent = ({ chapter, content }) => {
  const ref = useRef(null);
  const [progress, setProgress] = useState(chapter.progress);
  const [updateProgress] = useMutation(UPDATE_PROGRESS);
  const scrollableHeight = () =>
    ref.current.scrollHeight - ref.current.clientHeight;

  const scroll = e => {
    const newProgress = ref.current.scrollTop / scrollableHeight();
    setProgress(Number.parseFloat(newProgress.toPrecision(6)));
  };

  useInterval(() => {
    if (progress === chapter.progress) return;
    updateProgress({
      variables: { chapterId: chapter.id, progress: progress }
    });
  }, 1000);

  useEffect(() => {
    ref.current.scrollTo(0, progress * scrollableHeight());
    ref.current.onscroll = scroll;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Wrapper>
      <Content ref={ref} dangerouslySetInnerHTML={{ __html: content }} />
      <LinearProgress
        variant="determinate"
        value={progress * 100}
        color="secondary"
      />
    </Wrapper>
  );
};

const Wrapper = styled(Paper)`
  max-width: 900px;
  box-sizing: border-box;
  align-self: center;
  margin-top: 40px;
`;

const Content = styled.div`
  max-height: 80vh;
  overflow: auto;
  margin-bottom: 20px;
  line-height: 1.7;
  font-size: 1.05em;
  padding: 2rem 5rem;
`;
