import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import { GET_CHAPTER } from "../../queries/chapter";
import { Link } from "react-router-dom";

export const Reader = () => {
  const { id } = useParams();
  const { loading, error, data } = useQuery(GET_CHAPTER, { variables: { id } });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <Wrapper>
      <Link to="/">{"<"} Back to Library</Link>
      {data && (
        <>
          <Title>{data.chapter.title}</Title>
          <div dangerouslySetInnerHTML={{ __html: data.chapter.content }}></div>
        </>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding-top: 5%;
  margin: auto;
  width: 90%;
  /* text-align: center; */
`;

const Title = styled.h1``;
