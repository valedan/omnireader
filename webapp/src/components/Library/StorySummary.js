import React from "react";
import styled from "styled-components";
import grey from "@material-ui/core/colors/grey";
import lightBlue from "@material-ui/core/colors/lightBlue";
import { Button, Divider, Slider, useMediaQuery } from "@material-ui/core";
import ChevronRight from "@material-ui/icons/ChevronRight";
import { StoryInfo } from "./StoryInfo";
import _ from "lodash";
import { Link } from "react-router-dom";

export const StorySummary = ({ story }) => {
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

  return (
    <Summary onClick={e => e.stopPropagation()}>
      <ImageContainer>
        {bigScreen && <Image src={story.avatar || "/ffn_anon.webp"} />}
        {!bigScreen && (
          <ImageReadLink to={`/chapter/${currentChapter.id}`}>
            <Image src={story.avatar || "/ffn_anon.webp"} />
          </ImageReadLink>
        )}
      </ImageContainer>

      <StoryInfo story={story} />

      {bigScreen && (
        <>
          <Divider orientation="vertical" />
          <ReadButton color="secondary">
            {currentChapter && (
              <ReadLink to={`/chapter/${currentChapter.id}`}>
                {storyProgress === 0 ? "Start" : "Continue"}
                <ChevronRight />
              </ReadLink>
            )}
          </ReadButton>
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
    cursor: pointer;
    :hover {
      background-color: ${grey[50]};
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
const ReadButton = styled(Button)`
  && {
    min-width: 7rem;
    color: ${grey[900]};
    font-weight: bold;
    font-family: "Merriweather Sans", sans-serif;
    border-radius: 0;
    padding: 0;
    padding-left: 8px;
    :hover {
      background: ${lightBlue[100]};
    }
  }
  cursor: pointer;
  outline: none;
`;

const ReadLink = styled(Link)`
  height: 7rem;
  width: 100%;
  color: ${grey[900]};
  text-decoration: none;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
`;
