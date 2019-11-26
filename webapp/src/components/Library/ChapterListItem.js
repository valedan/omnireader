import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import LinearProgress from "@material-ui/core/LinearProgress";
import { Button } from "@material-ui/core";
import { grey } from "@material-ui/core/colors";

export const ChapterListItem = ({ chapter }) => {
  return (
    <Wrapper>
      <ChapterLink to={`/chapter/${chapter.id}`}>
        <ChapterTitle>{chapter.title}</ChapterTitle>
        <LinearProgress
          variant="determinate"
          color="secondary"
          value={chapter.progress * 100}
        />
      </ChapterLink>
    </Wrapper>
  );
};

const Wrapper = styled(Button)`
  height: 5rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding-left: 5%;
  padding-right: 5%;
  && {
    text-transform: none;
    padding-top: 0;
    padding-bottom: 0;
    text-align: left;
    align-items: stretch;
    padding-left: 2%;
    .MuiButton-label {
      height: 100%;
      :hover {
        text-decoration: underline;
      }
    }
  }
`;

const ChapterTitle = styled.h3``;

const ChapterLink = styled(Link)`
  height: 100%;
  width: 100%;
  text-decoration: none;
  color: ${grey[900]};
`;
