import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "@material-ui/icons";
import { grey } from "@material-ui/core/colors";

export const ChapterNav = ({ chapterId, type }) => {
  const Chevron = type === "left" ? ChevronLeft : ChevronRight;

  if (!chapterId)
    return (
      <DummyNav>
        <Chevron fontSize="inherit" />
      </DummyNav>
    );

  return (
    <Nav to={`/chapter/${chapterId}`}>
      <Chevron fontSize="inherit" />
    </Nav>
  );
};

const NavBase = `
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${grey[900]};
  font-size: 10rem;
  opacity: 0.85;
  height: 40vh;
`;

const Nav = styled(Link)`
  ${NavBase}
  :hover {
    background: rgba(0, 0, 0, 0.15);
  }
`;

const DummyNav = styled.div`
  ${NavBase}
  opacity: 0;
`;
