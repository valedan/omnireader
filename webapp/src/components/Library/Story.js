import React from "react";
import styled from "styled-components";
import { StoryContents } from "./StoryContents";

export const Story = ({ story }) => {
  console.log(story);
  return <StoryContents story={story} />;
};
