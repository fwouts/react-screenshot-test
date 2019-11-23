import React from "react";
import styled from "styled-components";
import logo from "../../../brand/social.png";

const Image = styled.img`
  width: 100%;
`;

export const PngComponent = () => <Image src={logo} />;
