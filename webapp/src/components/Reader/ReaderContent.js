import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { UPDATE_PROGRESS } from "../../queries/chapter";
import { useMutation } from "@apollo/react-hooks";
import { useInterval } from "../../hooks/useInterval";
import Paper from "@material-ui/core/Paper";
import ProgressBar from "../shared/ProgressBar";
import { Divider } from "@material-ui/core";
import { ChapterNavBar } from "./ChapterNavBar";

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
    // TODO: The page should scroll with a sticky footer, instead of just the content scrolling.
    <Wrapper elevation={4}>
      <TopNav>{<ChapterNavBar chapter={chapter} />}</TopNav>
      <Divider style={{ alignSelf: "stretch" }} />
      <Content ref={ref} dangerouslySetInnerHTML={{ __html: content }} />
      <ProgressWrapper>
        {/* TODO: For some reason, can't style ProgressBar directly */}
        <ProgressBar value={progress * 100} showPercent />
      </ProgressWrapper>
    </Wrapper>
  );
};

const Wrapper = styled(Paper)`
  @media (max-width: 1200px) {
    width: 100%;
    max-height: 100vh;
  }
  @media (min-width: 1200px) {
    min-width: 900px;
    width: 100%;

    max-height: 100vh;
  }
  align-self: center;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Content = styled.div`
  @media (min-width: 900px) {
    max-width: 900px;
  }
  padding-left: 4vw;
  padding-right: 4vw;
  @media (max-width: 900px) {
    max-width: 900px;
    padding-top: 0;
  }
  overflow: auto;
  line-height: 1.7;
  font-size: 1.05em;
  margin-bottom: 10px;
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
`;

const TopNav = styled.div`
  ${TopAndBottom}
`;
