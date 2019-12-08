import React, { useState } from "react";
import styled from "styled-components";
import _ from "lodash";
import LaunchIcon from "@material-ui/icons/Launch";
import { Button, Menu, MenuItem } from "@material-ui/core";
import { DELETE_STORY } from "../../queries/story";
import { useMutation } from "@apollo/react-hooks";
import { red } from "@material-ui/core/colors";
import { withStyles } from "@material-ui/styles";
import MoreVertIcon from "@material-ui/icons/MoreVert";

export const StoryDescription = ({ refetch, story }) => {
  const infoItems = story.details.information.split(" - ");
  const infoWhitelist = ["Words", "Published", "Status"];
  const [menuAnchor, setMenuAnchor] = useState(null);
  const openMenu = event => {
    setMenuAnchor(event.currentTarget);
  };

  const closeMenu = () => {
    setMenuAnchor(null);
  };
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

  itemElements.push(
    <InfoItem>
      <a href={story.canonicalUrl}>
        Source <LaunchIcon fontSize="inherit" />
      </a>
    </InfoItem>
  );

  return (
    <Wrapper>
      <MainContent>
        <Description>{story.details.description}</Description>
        <Information>
          {_.chunk(itemElements, Math.ceil(itemElements.length / 4)).map(
            chunk => (
              <div>{chunk}</div>
            )
          )}
        </Information>
        {error && <p>{error.message.split(":")[1]}</p>}
      </MainContent>
      <MenuWrapper>
        <MenuButton onClick={openMenu}>
          <MoreVertIcon />
        </MenuButton>
        <StyledMenu
          transformOrigin={{ horizontal: 70, vertical: -20 }}
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={closeMenu}
        >
          <DeleteButton onClick={deleteStory}>Delete</DeleteButton>
        </StyledMenu>
      </MenuWrapper>
    </Wrapper>
  );
};

const MenuButton = styled(Button)`
  && {
    position: absolute;
    top: 0px;
    right: 0px;
    min-width: 32px;
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

const MenuWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  position: relative;
`;

const MainContent = styled.div`
  padding: 3%;

  margin-right: 32px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: space-around;
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

const DeleteButton = styled(MenuItem)`
  && {
    font-family: "Merriweather Sans";
    color: ${red[500]};
  }
`;

const StyledMenu = styled(Menu)`
  && {
    .MuiMenu-paper {
    }
  }
`;
