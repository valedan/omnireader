import React from "react";
import styled from "styled-components";
import { ChevronLeft, ChevronRight } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { grey } from "@material-ui/core/colors";

export const ChapterNavBar = ({ chapter }) => {
  return (
    <Wrapper>
      <Nav
        disabled={!chapter.prevId}
        onClick={e => !chapter.prevId && e.preventDefault()}
        to={`/chapter/${chapter.prevId}`}
      >
        <>
          <ChevronLeft />
          {"Prev"}
        </>
      </Nav>
      <Nav to="/">Library</Nav>
      <Nav
        disabled={!chapter.nextId}
        onClick={e => !chapter.nextId && e.preventDefault()}
        to={`/chapter/${chapter.nextId}`}
      >
        <>
          {"Next"}
          <ChevronRight />
        </>
      </Nav>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  height: 48px;
  justify-content: space-between;
  align-items: center;
`;

const Nav = styled(Link)`
  && {
    text-decoration: none;
    :hover {
      text-decoration: ${props => (props.disabled ? "none" : "underline")};
    }
    user-select: none;
    cursor: ${props => (props.disabled ? "default" : "pointer")};
    font-size: 1.2em;
    display: flex;
    align-items: center;
    color: ${props => (props.disabled ? grey[400] : grey[800])};
  }
`;
