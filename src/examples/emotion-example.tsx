import styled from "@emotion/styled";
import React from "react";

const Container = styled.div`
  padding: 16px;
`;

const Button = styled.button`
  font-family: Arial;
  background: #00f;
  color: #fff;
  padding: 8px;
  border-radius: 4px;
  font-size: 2em;
`;

export const EmotionExample = () => (
  <Container>
    <Button>This component was styled with Emotion</Button>
  </Container>
);
