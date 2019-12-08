import React from "react";
import styled from "styled-components";
import ProgressBar from "../shared/ProgressBar";
import { lighten } from "polished";
import grey from "@material-ui/core/colors/grey";
import { Link } from "react-router-dom";

import _ from "lodash";
import { useMediaQuery } from "@material-ui/core";

export const StoryInfo = ({ story, noLink }) => {
  const bigScreen = useMediaQuery("(min-width:700px)");

  const getValueFromInfo = (info, key) =>
    info
      .split(" - ")
      .find(item => item.includes(key))
      .split(": ")[1];

  const timeKey = story.details.information.includes("Updated")
    ? "Updated"
    : "Published";
  const updated = getValueFromInfo(story.details.information, timeKey);

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
  const Wrapper = bigScreen || noLink ? DivWrapper : LinkWrapper;

  return (
    <Wrapper to={`/story/${story.id}`}>
      <MainInfo>
        <Title>{story.title}</Title>
        <Author>{story.author}</Author>
      </MainInfo>
      <ExtraInfo>
        <span>
          {story.chapters.length}{" "}
          {story.chapters.length === 1 ? "chapter" : "chapters"}
        </span>
        <span>Updated {updated}</span>
      </ExtraInfo>

      {storyProgress > 0 && <ProgressBar value={storyProgress} showPercent />}
    </Wrapper>
  );
};

const WrapperStyles = `
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex-grow: 1;
  padding-right: 2%;
  padding-left: 2%;
  justify-content: space-around;
  text-decoration: none;
  color: inherit;
`;

const DivWrapper = styled.div`
  ${WrapperStyles}
`;

const LinkWrapper = styled(Link)`
  ${WrapperStyles}
`;

const Title = styled.h2`
  @media (min-width: 700px) {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 1.4em;
  }

  @media (max-width: 700px) {
    font-size: 1.3em;
  }
  margin: 0;
  width: 100%;
  /* max-width: 20rem; */
`;

const Author = styled.span`
  font-style: italic;
  /* margin-left: 16px; */
  /* margin-top: 4px; */
  display: inline-flex;
  align-self: left;
  @media (min-width: 700px) {
    align-self: center;
  }
`;

const MainInfo = styled.div`
  display: flex;
  flex-direction: column;
`;
const ExtraInfo = styled.div`
  display: flex;
  @media (max-width: 700px) {
    flex-direction: column;
    align-items: flex-start;
  }
  span {
    margin-top: 4px;
  }
  justify-content: space-around;
  /* margin-top: 8px; */
  /* margin-bottom: 4px; */
  font-family: "Merriweather Sans", sans-serif;
  color: ${lighten(0.3, grey[900])};
`;
