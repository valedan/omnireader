import React from "react";
import styled from "styled-components";
import grey from "@material-ui/core/colors/grey";
import { Button, Divider, Slider, useMediaQuery } from "@material-ui/core";
import { StoryInfo } from "./StoryInfo";
import _ from "lodash";
import { Link } from "react-router-dom";
import { ReadButton } from "./ReadButton";

export const StorySummary = ({ story, noLink }) => {
  // TODO: these functions should be put in a shared story_utils file
  const bigScreen = useMediaQuery("(min-width:700px)");
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

  let image = null;
  if (bigScreen || noLink) {
    image = <Image src={story.avatar || "/ffn_anon.webp"} />;
  } else {
    image = (
      <ImageReadLink to={`/chapter/${currentChapter.id}`}>
        <Image src={story.avatar || "/ffn_anon.webp"} />
      </ImageReadLink>
    );
  }

  return (
    <Summary onClick={e => e.stopPropagation()} noLink={noLink}>
      <ImageContainer>{image}</ImageContainer>

      <StoryInfo story={story} noLink={noLink} />

      {bigScreen && (
        <>
          <Divider orientation="vertical" />
          <ReadButton
            storyProgress={storyProgress}
            currentChapter={currentChapter}
          />
        </>
      )}
    </Summary>
  );
};

const Summary = styled.div`
  width: 100%;
  @media (min-width: 700px) {
    height: 7rem;
  }
  @media (max-width: 700px) {
    height: 11rem;
    text-align: left;
    cursor: ${props => (props.noLink ? "default" : "pointer")};
    :hover {
      background-color: ${props => (props.noLink ? "inherit" : grey[50])};
    }
  }
  display: flex;
  justify-content: space-between;
  background-color: white;
  cursor: default;
`;

const ImageContainer = styled.div`
  display: flex;
  min-width: 6rem;
  height: 100%;
  align-self: center;
  align-items: center;
  justify-content: center;
`;

const Image = styled.img`
  object-fit: contain;
  max-width: 6rem;
  max-height: 6rem;
`;

const ImageReadLink = styled(Link)`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
