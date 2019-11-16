import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import LinearProgress from "@material-ui/core/LinearProgress";
import { UPDATE_CHAPTER } from "../../queries/chapter";
import { useMutation } from "@apollo/react-hooks";
import _ from "lodash";

export const ReaderContent = ({ chapter }) => {
  const ref = useRef(null);
  const [progress, setProgress] = useState(chapter.progress);
  const [displayProgress, setDisplayProgress] = useState(0);

  const [updateChapter] = useMutation(UPDATE_CHAPTER);

  const updateProgress = _.debounce(() => {
    console.log("updating");
    updateChapter({ variables: { id: chapter.id, progress: progress } });
  }, 2000);

  useEffect(() => {
    setDisplayProgress(progress * 100);
    updateProgress();
  }, [progress]);

  const scroll = e =>
    setProgress(
      ref.current.scrollTop /
        (ref.current.scrollHeight - ref.current.clientHeight)
    );

  useEffect(() => {
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
