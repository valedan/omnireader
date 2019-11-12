import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";

export const ReaderContent = ({ content }) => {
  const ref = useRef(null);
  const [progress, setProgress] = useState(0);
  const pageBack = () => {
    const scrollTarget = ref.current.scrollTop - ref.current.clientHeight;
    if (scrollTarget > 0) {
      ref.current.scrollTo(0, scrollTarget);
      setProgress((scrollTarget / ref.current.originalHeight) * 100);
    } else {
      ref.current.scrollTo(0, 0);
      setProgress(0);
    }
  };

  const pageForward = () => {
    const scrollTarget = ref.current.scrollTop + ref.current.clientHeight;
    if (scrollTarget <= ref.current.originalHeight - ref.current.clientHeight) {
      ref.current.scrollTo(0, scrollTarget);
      setProgress((scrollTarget / ref.current.originalHeight) * 100);
    } else {
      ref.current.scrollTo(0, ref.current.scrollHeight);
      setProgress(100);
    }
  };

  // TODO: send progress to backend. Just store it as-is right now, as a float.
  // TODO: on future loads, scrollTo the position that is progress% between 0 and end

  useEffect(() => {
    console.log(progress);
  }, [progress]);
  useEffect(() => {
    ref.current.originalHeight = ref.current.scrollHeight;
    const paddingSize =
      ref.current.clientHeight -
      (ref.current.scrollHeight % ref.current.clientHeight);
    const padding = document.createElement("div");
    padding.setAttribute("style", `height: ${paddingSize}px`);
    ref.current.append(padding);
  }, []);

  return (
    <Wrapper>
      <Content ref={ref} dangerouslySetInnerHTML={{ __html: content }} />
      <Nav onClick={pageBack}>{"<"}</Nav>
      <Nav onClick={pageForward}>{">"}</Nav>
    </Wrapper>
  );
};

const Nav = styled.button``;

const Content = styled.div`
  max-height: 80vh;
  overflow: hidden;
  /* overflow: hidden; */
`;

const Wrapper = styled.div``;
