import React from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import { GET_CHAPTER } from "../../queries/chapter";
import { Link } from "react-router-dom";
import { ReaderContent } from "./ReaderContent";
import { grey } from "@material-ui/core/colors";
import { ChapterNav } from "./ChapterNav";
import useMediaQuery from "@material-ui/core/useMediaQuery";

export const Reader = () => {
  const { id } = useParams();
  const bigScreen = useMediaQuery("(min-width:1200px)");

  const { loading, error, data } = useQuery(GET_CHAPTER, { variables: { id } });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const content = `<h1>${data.chapter.title}</h1>` + data.chapter.content;

  return (
    <Wrapper>
      {/* {bigScreen && <StyledLink to="/">{"<"} Library</StyledLink>} */}
      {data && (
        <Inner>
          {/* {bigScreen && (
            <ChapterNav type="left" chapterId={data.chapter.prevId} />
          )} */}
          <ReaderContent chapter={data.chapter} content={content} />
          {/* {bigScreen && (
            <ChapterNav type="right" chapterId={data.chapter.nextId} />
          )} */}
        </Inner>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  margin: auto;
  @media (min-width: 1200px) {
  }
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
