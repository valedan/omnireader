import React from "react";
import styled from "styled-components";
import ChevronRight from "@material-ui/icons/ChevronRight";
import { Link } from "react-router-dom";
import { Button, Divider, Slider, useMediaQuery } from "@material-ui/core";
import lightBlue from "@material-ui/core/colors/lightBlue";
import grey from "@material-ui/core/colors/grey";

export const ReadButton = ({ currentChapter, storyProgress }) => {
  return (
    <StyledButton color="secondary">
      {currentChapter && (
        <ReadLink to={`/chapter/${currentChapter.id}`}>
          {storyProgress === 0 ? "Start" : "Continue"}
          <ChevronRight />
        </ReadLink>
      )}
    </StyledButton>
  );
};

const StyledButton = styled(Button)`
  && {
    min-width: 7rem;
    color: ${grey[900]};
    font-weight: bold;
    font-family: "Merriweather Sans", sans-serif;
    border-radius: 0;
    padding: 0;
    padding-left: 8px;
    :hover {
      background: ${lightBlue[100]};
    }
  }
  cursor: pointer;
  outline: none;
`;

const ReadLink = styled(Link)`
  height: 7rem;
  width: 100%;
  color: ${grey[900]};
  text-decoration: none;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
`;
