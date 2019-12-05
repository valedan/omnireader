import React, { useEffect } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import { GET_STORY } from "../../queries/story";
import { ApolloConsumer } from "react-apollo";

import { StoryContents } from "./StoryContents";

export const Story = () => {
  const { id } = useParams();
  const { loading, error, data } = useQuery(GET_STORY, { variables: { id } });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  return <StoryContents story={data.story} />;
};
