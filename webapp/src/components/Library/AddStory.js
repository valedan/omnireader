import React, { useState } from "react";
import styled from "styled-components";
import TextField from "@material-ui/core/TextField";
import { useMutation } from "@apollo/react-hooks";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";

import { CREATE_STORY } from "../../queries/story";

export const AddStory = ({ onSuccess }) => {
  const [input, setInput] = useState("");
  const [createStory, { error }] = useMutation(CREATE_STORY);

  const submitForm = async e => {
    e.preventDefault();
    await createStory({ variables: { url: input } });
    onSuccess();
    setInput("");
  };

  return (
    <Wrapper>
      <Form onSubmit={submitForm}>
        <StyledTextField
          color="secondary"
          label="Add Story"
          placeholder="Enter URL..."
          value={input}
          onChange={e => setInput(e.target.value)}
        ></StyledTextField>
        <StyledButton type="submit" variant="contained" color="secondary">
          Add Story
        </StyledButton>
      </Form>
      {error && <p>{error.message.split(":")[1]}</p>}
    </Wrapper>
  );
};

const Wrapper = styled(Paper)`
  width: 100%;
  padding: 16px 0;
`;

const StyledTextField = styled(TextField)`
  && {
    width: 70%;
    margin-right: 16px;
  }
`;

const Form = styled.form`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const StyledButton = styled(Button)`
  && {
    font-family: "Merriweather Sans", sans-serif;
    color: white;
    font-weight: bold;
  }
`;
