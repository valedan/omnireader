import React, { useState } from 'react';
import styled from 'styled-components';
import { useQuery, useMutation } from '@apollo/react-hooks';
import List from '@material-ui/core/List';
import { StoryListItem } from './StoryListItem';
import { GET_STORIES, TOC_CHECKED } from '../../../queries/story';

export const StoryList = ({ hidden }) => {
  const { loading, error, data, refetch } = useQuery(GET_STORIES);
  const [open, setOpen] = useState(null);
  const [sendTOCChecked] = useMutation(TOC_CHECKED);

  if (hidden) return null;
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  const handleChange = id => (event, isOpen) => {
    setOpen(isOpen ? id : false);
    if (isOpen) {
      sendTOCChecked({
        variables: { storyId: id },
      });
    }
  };

  return (
    <List>
      {data.stories.map((story, index) => {
        return (
          <StoryListItem
            // TODO: passing refetch down here seems like a code smell
            refetch={refetch}
            open={open === story.id}
            handleChange={handleChange(story.id)}
            key={story.id}
            story={story}
          />
        );
      })}
    </List>
  );
};
