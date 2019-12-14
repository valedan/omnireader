import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";

export const ReaderContent = ({ chapter, content, updateProgress }) => {
  const ref = useRef(null);
  const scrollableHeight = () =>
    ref.current.scrollHeight - ref.current.clientHeight;

  const scroll = e => {
    const newProgress = ref.current.scrollTop / scrollableHeight();
    updateProgress(Number.parseFloat(newProgress.toPrecision(6)));
  };

  useEffect(() => {
    updateProgress(chapter.progress);
    const current = ref.current;
    current.scrollTo(0, chapter.progress * scrollableHeight());
    current.onscroll = scroll;
    return () => (current.onscroll = null);
  }, [chapter.id]);

  return (
    <Wrapper ref={ref}>
      {/* TODO: Security */}
      <Content dangerouslySetInnerHTML={{ __html: content }} />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  @media (min-width: 1200px) {
    min-width: 900px;
  }
  align-self: center;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: auto;
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
  line-height: 1.7;
  font-size: 1.05em;
`;
