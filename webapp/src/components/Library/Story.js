import React, { useEffect } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import { GET_STORY } from "../../queries/story";
import { ApolloConsumer } from "react-apollo";
import { StorySummary } from "./StorySummary";
import { StoryContents } from "./StoryContents";
import Paper from "@material-ui/core/Paper";
import { Link } from "react-router-dom";
import { grey } from "@material-ui/core/colors";
import { Divider, useMediaQuery } from "@material-ui/core";
import { ReadButton } from "./ReadButton";
import _ from "lodash";

export const Story = () => {
  const bigScreen = useMediaQuery("(min-width:700px)");
  const { id } = useParams();
  const { loading, error, data } = useQuery(GET_STORY, { variables: { id } });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  const story = data.story;
  const currentChapter =
    _.maxBy(story.chapters, chapter => chapter.progressUpdatedAt) ||
    story.chapters[0];
  const calculateStoryProgress = () => {
    if (story.chapters.length === 0) return 0;
    if (!currentChapter) return 0;

    const totalChapters = story.chapters.length;
    const completedChapters = currentChapter.number - 1;
    return (
      ((completedChapters + 1 * currentChapter.progress) / totalChapters) * 100
    );
  };
  const storyProgress = calculateStoryProgress();

  return (
    <div>
      {bigScreen && <StyledLink to="/">{"<"} Library</StyledLink>}
      <Wrapper>
        {!bigScreen && (
          <>
            <StyledLink to="/">{"<"} Library</StyledLink>
            <Divider />
          </>
        )}

        <StorySummary story={data.story} noLink />
        {!bigScreen && (
          <>
            <Divider />
            <ReadButton
              storyProgress={storyProgress}
              currentChapter={currentChapter}
            />
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
