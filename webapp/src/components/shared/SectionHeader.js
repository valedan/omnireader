import React from "react";
import styled from "styled-components";

export const SectionHeader = ({ children }) => {
  return <Header>{children}</Header>;
};

const Header = styled.h1`
  font-family: cursive;
  overflow: hidden;
  text-align: center;

  :before,
  :after {
    background-color: #000;
    content: "";
    display: inline-block;
    height: 2px;
    position: relative;
    vertical-align: middle;
    width: 30%;
  }

  :before {
    right: 0.5em;
    margin-left: -25%;
  }

  :after {
    left: 0.5em;
    margin-right: -25%;
  }
`;
