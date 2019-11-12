import React, { useState } from "react";
import styled from "styled-components";
import TextField from "@material-ui/core/TextField";
import { useMutation } from "@apollo/react-hooks";
import Button from "@material-ui/core/Button";
import { CREATE_STORY } from "../../queries/story";

export const AddStory = ({ onSuccess }) => {
  const [input, setInput] = useState("");
  const [createStory, { error }] = useMutation(CREATE_STORY);
  return (
    <Wrapper>
      <form
        onSubmit={async e => {
          e.preventDefault();
          await createStory({ variables: { url: input } });
          onSuccess();
          setInput("");
        }}
      >
        <StyledTextField
          label="Add Story"
          placeholder="Enter URL..."
          value={input}
          onChange={e => setInput(e.target.value)}
        ></StyledTextField>
        <StyledButton type="submit" variant="contained" color="primary">
          Add Story
        </StyledButton>
      </form>
      {error && <p>{error.message.split(":")[1]}</p>}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
`;

const StyledTextField = styled(TextField)`
  width: 60%;
`;

const StyledButton = styled(Button)`
  margin-bottom: -20px;
`;
