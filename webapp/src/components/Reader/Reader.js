import React from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import { GET_CHAPTER } from "../../queries/chapter";
import { Link } from "react-router-dom";
import { ReaderContent } from "./ReaderContent";
import { grey } from "@material-ui/core/colors";
import { ChapterNav } from "./ChapterNav";

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
        <Inner>
          <ChapterNav type="left" chapterId={data.chapter.prevId} />
          <ReaderContent chapter={data.chapter} content={content} />
          <ChapterNav type="right" chapterId={data.chapter.nextId} />
        </Inner>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  margin: auto;
  padding-top: 20px;
  display: flex;
  flex-direction: column;
`;

const StyledLink = styled(Link)`
  color: ${grey[900]};
  font-size: 1.4em;
  margin-left: 20px;
  text-decoration: none;
  :hover {
    text-decoration: underline;
  }
`;

const Inner = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
`;
