import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { GET_CHAPTER, UPDATE_CHAPTER } from "../../queries/chapter";
import { Link } from "react-router-dom";
import { ReaderContent } from "./Content";
import { grey } from "@material-ui/core/colors";
import { ChevronLeft, ChevronRight } from "@material-ui/icons";

export const Reader = () => {
  const { id } = useParams();
  const { loading, error, data } = useQuery(GET_CHAPTER, { variables: { id } });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  const content = `<h1>${data.chapter.title}</h1>` + data.chapter.content;

  return (
    <Wrapper>
      <StyledLink to="/">{"<"} Library</StyledLink>
      {data && (
        <ReaderInner>
          {(data.chapter.prevId && (
            <ChapterNav to={`/chapter/${data.chapter.prevId}`}>
              <ChevronLeft fontSize="inherit" />
            </ChapterNav>
          )) || <DummyNav>{"<"}</DummyNav>}
          <ReaderContent
            chapter={data.chapter}
            content={content}
          ></ReaderContent>
          {(data.chapter.nextId && (
            <ChapterNav to={`/chapter/${data.chapter.nextId}`}>
              <ChevronRight fontSize="inherit" />
            </ChapterNav>
          )) || <DummyNav>{">"}</DummyNav>}
        </ReaderInner>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  margin: auto;
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  /* text-align: center; */
`;

const StyledLink = styled(Link)`
  color: ${grey[900]};
  font-size: 1.4em;
  margin-left: 20px;
  /* font-weight: bold; */
  text-decoration: none;
  :hover {
    text-decoration: underline;
  }
`;

const ReaderInner = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
`;

const ChapterNav = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${grey[900]};
  font-size: 10rem;
  opacity: 0.85;
  height: 40vh;
  :hover {
    background: rgba(0, 0, 0, 0.15);
  }
`;

const DummyNav = styled.div`
  font-size: 10rem;
  opacity: 0;
`;
