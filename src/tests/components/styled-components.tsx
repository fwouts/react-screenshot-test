import React from "react";
import styled from "styled-components";

const Container = styled.div`
  padding: 16px;
`;

const Button = styled.button`
  background: #00f;
  color: #fff;
  padding: 8px;
  border-radius: 4px;
  font-size: 2em;
`;

export const StyledComponentsComponent = () => (
  <Container>
    <Button>This component was styled with styled-components</Button>
  </Container>
);
