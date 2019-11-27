import React from "react";
import styled from "styled-components";
import _ from "lodash";
import LaunchIcon from "@material-ui/icons/Launch";

export const StoryDescription = ({ story }) => {
  const infoItems = story.details.information.split(" - ");
  const infoWhitelist = [
    "Words",
    "Reviews",
    "Favs",
    "Follows",
    "Published",
    "Status"
  ];

  const itemElements = infoItems
    .filter(item => infoWhitelist.includes(item.split(": ")[0]))
    .map(item => {
      return (
        <InfoItem>
          <strong>{item.split(": ")[0]}: </strong>
          {item.split(": ")[1]}
        </InfoItem>
      );
    });

  itemElements.push(
    <InfoItem>
      <a href={story.canonicalUrl}>
        Source <LaunchIcon fontSize="inherit" />
      </a>
    </InfoItem>
  );
  return (
    <Wrapper>
      <Description>{story.details.description}</Description>
      <Information>
        {_.chunk(itemElements, Math.ceil(itemElements.length / 4)).map(
          chunk => (
            <div>{chunk}</div>
          )
        )}
      </Information>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding: 5%;
`;

const Description = styled.div`
  margin-bottom: 20px;
  font-style: italic;
`;

const Information = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  div {
    align-items: flex-start;
    display: flex;
    flex-direction: column;
  }
`;

const InfoItem = styled.span`
  svg {
    margin-bottom: -4px;
  }
`;
