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
  const [displayProgress, setDisplayProgress] = useState(0);

  const [updateProgress] = useMutation(UPDATE_PROGRESS);

  useEffect(() => {
    setDisplayProgress(progress * 100);
  }, [progress]);

  const scroll = e => {
    const newProgress =
      ref.current.scrollTop /
      (ref.current.scrollHeight - ref.current.clientHeight);
    setProgress(Number.parseFloat(newProgress.toPrecision(6)));
  };

  useInterval(() => {
    if (progress === chapter.progress) return;
    updateProgress({
      variables: { chapterId: chapter.id, progress: progress }
    });
  }, 1000);

  useEffect(() => {
    console.log("rendering");
    ref.current.scrollTo(
      0,
      progress * (ref.current.scrollHeight - ref.current.clientHeight)
    );
    ref.current.onscroll = scroll;
  }, []);

  return (
    <Wrapper>
      <Content ref={ref} dangerouslySetInnerHTML={{ __html: content }} />
      <LinearProgress
        variant="determinate"
        value={displayProgress}
        color="secondary"
      />
    </Wrapper>
  );
};

const Content = styled.div`
  max-height: 80vh;
  overflow: auto;
  margin-bottom: 20px;
  line-height: 1.7;
  font-size: 1.05em;
  padding: 2rem 5rem;
`;

const Wrapper = styled(Paper)`
  max-width: 900px;
  box-sizing: border-box;
  align-self: center;
  margin-top: 40px;
`;
