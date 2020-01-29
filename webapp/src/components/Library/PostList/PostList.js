import React, { useState } from 'react';
import styled from 'styled-components';
import { useQuery } from '@apollo/react-hooks';
import List from '@material-ui/core/List';
import { PostListItem } from './PostListItem';
import { GET_POSTS } from '../../../queries/post';

export const PostList = ({ hidden }) => {
  const { loading, error, data, refetch } = useQuery(GET_POSTS);

  if (hidden) return null;
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <List>
      {data.posts.map(post => {
        return <PostListItem key={post.id} post={post} />;
      })}
    </List>
  );
};
