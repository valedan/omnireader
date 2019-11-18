import React, { useState } from "react";
import styled from "styled-components";
import ListItem from "@material-ui/core/ListItem";
import { Link } from "react-router-dom";
import LinearProgress from "@material-ui/core/LinearProgress";

export const ChapterListItem = ({ chapter, first }) => {
  const chapterProgress = 0;
  return (
    <Wrapper first={first} key={chapter.id}>
      <ChapterLink to={`/chapter/${chapter.id}`}>
        <ChapterTitle>{chapter.title}</ChapterTitle>
        <LinearProgress variant="determinate" value={chapterProgress} />
      </ChapterLink>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  height: 5rem;
  /* border-bottom: 1px solid grey; */
  /* border-top: ${props => props.first && "1px solid grey"}; */
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding-left: 5%;
  padding-right: 5%;
  text-align: left;
`;

const ChapterTitle = styled.h3``;

const ChapterLink = styled(Link)`
  height: 100%;
`;
