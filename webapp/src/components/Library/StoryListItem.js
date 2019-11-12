import React, { useEffect, useState } from "react";
import styled from "styled-components";
import List from "@material-ui/core/List";

import ListItem from "@material-ui/core/ListItem";
import { Link } from "react-router-dom";
import { fontWeight } from "@material-ui/system";

export const StoryListItem = ({ story }) => {
  const [open, setOpen] = useState(false);
  return (
    <Wrapper onClick={() => setOpen(!open)}>
      <StoryInfo>
        <span>{story.chapters.length}</span>
        <span style={{ fontWeight: "bold" }}>{story.title}</span>
        <span>{story.author}</span>
      </StoryInfo>
      {open && (
        <List>
          {story.chapters.map(chapter => {
            return (
              <Chapter key={chapter.id}>
                <Link to={`/chapter/${chapter.id}`}>{chapter.title}</Link>
              </Chapter>
            );
          })}
        </List>
      )}
    </Wrapper>
  );
};

const StoryInfo = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding-left: 5%;
  padding-right: 5%;
  padding-top: 2%;
  padding-bottom: 2%;
  border-bottom: 1px solid grey;
`;

const Wrapper = styled.div`
  margin: auto;
  cursor: pointer;
  width: 100%;

  text-align: center;
`;

const Chapter = styled(ListItem)``;
