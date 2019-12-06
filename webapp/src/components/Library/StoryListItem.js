import React from "react";
import styled from "styled-components";

import { StoryContents } from "./StoryContents";
import ExpandMore from "@material-ui/icons/ExpandMore";
import grey from "@material-ui/core/colors/grey";
import lightBlue from "@material-ui/core/colors/lightBlue";
import { Button, Divider, Slider, useMediaQuery } from "@material-ui/core";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import _ from "lodash";
import { StorySummary } from "./StorySummary";
export const StoryListItem = ({
  refetch,
  story,
  first,
  open,
  handleChange
}) => {
  const bigScreen = useMediaQuery("(min-width:700px)");

  return (
    <Wrapper expanded={open} onChange={handleChange} elevation={2}>
      <SummaryWrapper first={first} expandIcon={bigScreen && <ExpandMore />}>
        <StorySummary story={story} />
      </SummaryWrapper>
      {bigScreen && <StoryContents refetch={refetch} story={story} />}
    </Wrapper>
  );
};

const Wrapper = styled(ExpansionPanel)``;

const SummaryWrapper = styled(ExpansionPanelSummary)`
  && {
    .MuiExpansionPanelSummary-content {
      margin: 0;
      max-width: calc(100% - 5rem);
      min-width: calc(100% - 5rem);
      @media (max-width: 700px) {
        max-width: 100%;
        min-width: 100%;
      }
    }
    .MuiExpansionPanelSummary-expandIcon {
      margin: 0 16px;
    }
    padding: 0;
    flex-direction: row-reverse;
    justify-content: space-between;
  }
`;
