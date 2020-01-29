import React, { useState } from 'react';
import styled from 'styled-components';
import Paper from '@material-ui/core/Paper';
import { AddPost } from './AddPost';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { StoryList } from './StoryList/StoryList';
import { useMedScreen } from '../shared/breakpoints';

export const Library = () => {
  const [tab, setTab] = useState(0);
  const changeTab = (event, newTab) => {
    setTab(newTab);
  };
  const medScreen = useMedScreen();

  return (
    <Wrapper>
      {medScreen && <AddPost onSuccess={() => window.location.reload()} />}
      <ListWrapper>
        <Tabs value={tab} onChange={changeTab}>
          <Tab label="Stories" />
          <Tab label="Posts" />
        </Tabs>
        <StoryList hidden={tab !== 0} />
      </ListWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  @media (min-width: 700px) {
    padding: 2%;
    min-width: 700px;
    width: 80%;
  }
  @media (max-width: 700px) {
    width: 100%;
  }
  margin: auto;
  text-align: center;
`;

const ListWrapper = styled(Paper)`
  @media (max-width: 700px) {
    ul {
      padding: 0;
    }
  }
  @media (min-width: 700px) {
    margin-top: 2%;
    padding: 2%;
  }
  padding-top: 1%;
`;
