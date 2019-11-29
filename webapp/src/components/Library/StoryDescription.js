import React from "react";
import styled from "styled-components";
import _ from "lodash";
import LaunchIcon from "@material-ui/icons/Launch";
import { Button } from "@material-ui/core";
import { DELETE_STORY } from "../../queries/story";
import { useMutation } from "@apollo/react-hooks";
import { red } from "@material-ui/core/colors";
import { withStyles } from "@material-ui/styles";

export const StoryDescription = ({ refetch, story }) => {
  const infoItems = story.details.information.split(" - ");
  const infoWhitelist = ["Words", "Published", "Status"];

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

  const [deleteStoryMutation, { error }] = useMutation(DELETE_STORY);
  const deleteStory = async () => {
    await deleteStoryMutation({ variables: { id: story.id } });
    refetch();
  };

  itemElements.unshift(
    <InfoItem>
      <a href={story.canonicalUrl}>
        Source <LaunchIcon fontSize="inherit" />
      </a>
    </InfoItem>
  );

  itemElements.push(
    <DeleteButton color="inherit" variant="outlined" onClick={deleteStory}>
      Delete
    </DeleteButton>
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
      {error && <p>{error.message.split(":")[1]}</p>}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding: 3%;
`;

const Description = styled.div`
  margin-bottom: 30px;
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

const DeleteButton = withStyles(theme => ({
  root: {
    fontFamily: "Merriweather Sans",
    fontWeight: "bold",
    color: theme.palette.getContrastText(red[500]),
    backgroundColor: red[500],
    "&:hover": {
      backgroundColor: red[700]
    }
  }
}))(Button);
