import { Chip } from "@material-ui/core";
import React from "react";
import styled from "styled-components";

export const OmniChip = styled(Chip)`
  && {
    margin-left: 12px;
    color: white;
    font-family: "Merriweather Sans";
    font-weight: bold;
    align-self: center;
    align-items: center;
    .MuiChip-label {
      margin-top: 0;
    }
  }
`;
