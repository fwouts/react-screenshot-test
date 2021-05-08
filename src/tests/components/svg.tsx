import React from "react";
import styled from "styled-components";
import logo from "../../../brand/social.svg";

const Image = styled.img`
  width: 100vw;
`;

export const SvgComponent = () => <Image src={logo} />;
