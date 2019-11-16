import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import LinearProgress from "@material-ui/core/LinearProgress";
import { UPDATE_PROGRESS } from "../../queries/chapter";
import { useMutation } from "@apollo/react-hooks";
import { useInterval } from "../../hooks/useInterval";

export const ReaderContent = ({ chapter }) => {
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
      <Content
        ref={ref}
        dangerouslySetInnerHTML={{ __html: chapter.content }}
      />
      <LinearProgress variant="determinate" value={displayProgress} />
    </Wrapper>
  );
};

const Content = styled.div`
  max-height: 80vh;
  overflow: auto;
  margin-bottom: 20px;
`;

const Wrapper = styled.div``;
