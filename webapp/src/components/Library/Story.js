import React, { useEffect } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { GET_STORY, TOC_CHECKED } from "../../queries/story";
import { StorySummary } from "./StorySummary";
import { StoryContents } from "./StoryContents";
import Paper from "@material-ui/core/Paper";
import { Link } from "react-router-dom";
import { grey } from "@material-ui/core/colors";
import { Divider } from "@material-ui/core";
import { ReadButton } from "./ReadButton";
import { useMedScreen } from "../shared/breakpoints";

export const Story = () => {
  const medScreen = useMedScreen();
  const { id } = useParams();
  const { loading, error, data } = useQuery(GET_STORY, { variables: { id } });
  const [sendTOCChecked] = useMutation(TOC_CHECKED);

  useEffect(() => {
    sendTOCChecked({
      variables: { storyId: id }
    });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const story = data.story;
  return (
    <div>
      {medScreen && <StyledLink to="/">{"<"} Library</StyledLink>}
      <Wrapper>
        {!medScreen && (
          <>
            <StyledLink to="/">{"<"} Library</StyledLink>
            <Divider />
          </>
        )}

        <StorySummary story={data.story} noLink />
        {!medScreen && (
          <>
            <Divider />
            <ReadButton story={story} />
          </>
        )}
        <StoryContents story={data.story} />
      </Wrapper>
    </div>
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
    text-align: left;
  }
  @media (min-width: 700px) {
    text-align: center;
    margin-top: 20px;
    width: 80%;
  }
`;

const StyledLink = styled(Link)`
  color: ${grey[900]};
  font-size: 1.4em;
  margin-left: 20px;
  display: block;
  text-decoration: none;
  :hover {
    text-decoration: underline;
  }

  @media (max-width: 700px) {
    margin-bottom: 0.7em;
  }
  @media (min-width: 700px) {
    padding-top: 20px;
  }
`;
