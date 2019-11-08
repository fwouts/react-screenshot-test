import styled from "@emotion/styled";
import React from "react";

const Container = styled.div`
  padding: 16px;
`;

const Button = styled.button`
  background: #f80a;
  color: #000;
  padding: 8px;
  border-radius: 4px;
  font-size: 2em;
`;

export const EmotionExample = () => (
  <Container>
    <Button>This component was styled with Emotion</Button>
  </Container>
);
