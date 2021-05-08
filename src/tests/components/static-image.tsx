import React from "react";
import styled from "styled-components";

const Image = styled.img`
  width: 100vw;
`;

export const StaticImageComponent = () => <Image src="/public/react.png" />;
