import React from "react";
import styled from "styled-components";
import grey from "@material-ui/core/colors/grey";
import { Slider } from "@material-ui/core";

export const ProgressBar = ({ value, showPercent }) => {
  return (
    <Wrapper>
      {showPercent && <Percent>{Math.round(value)}%</Percent>}
      <Bar value={value} color="secondary" />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Percent = styled.span`
  font-size: 0.8em;
  margin-right: 8px;
  color: ${grey[800]};
  font-family: "Merriweather Sans";
`;

const Bar = styled(Slider)`
  && {
    cursor: default;
    .MuiSlider-rail {
      background-color: ${grey[400]};
    }
    .MuiSlider-active {
      box-shadow: none;
    }

    .MuiSlider-thumbColorSecondary:hover {
      box-shadow: none;
    }
  }
`;
