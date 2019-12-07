import React, { useEffect } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import { GET_STORY } from "../../queries/story";
import { ApolloConsumer } from "react-apollo";
import { StorySummary } from "./StorySummary";
import { StoryContents } from "./StoryContents";
import Paper from "@material-ui/core/Paper";

export const Story = () => {
  const { id } = useParams();
  const { loading, error, data } = useQuery(GET_STORY, { variables: { id } });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  return (
    <Wrapper>
      <StorySummary story={data.story} />
      <StoryContents story={data.story} />
    </Wrapper>
  );
};

const Wrapper = styled(Paper)`
  background-color: white;
  display: flex;
  flex-direction: column;
  margin-left: auto;

  margin-right: auto;
  align-self: center;

  @media (max-width: 700px) {
    padding-top: 1em;
  }
  @media (min-width: 700px) {
    margin-top: 2%;
    width: 80%;
  }
`;
