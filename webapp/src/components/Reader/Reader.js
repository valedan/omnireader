import React from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import { GET_CHAPTER } from "../../queries/chapter";
import { ReaderContent } from "./ReaderContent";

export const Reader = () => {
  const { id } = useParams();

  const { loading, error, data } = useQuery(GET_CHAPTER, { variables: { id } });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const content = `<h1>${data.chapter.title}</h1>` + data.chapter.content;

  return (
    <Wrapper>
      {data && (
        <Inner>
          <ReaderContent chapter={data.chapter} content={content} />
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

const Inner = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
`;
