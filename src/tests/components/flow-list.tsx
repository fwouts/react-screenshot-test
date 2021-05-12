import React from "react";
import styled, { css } from "styled-components";

const smallMax = 767;
const mediumMin = 768;
const mediumMax = 994;
const largeMin = 995;
const smallMaxPx = `${smallMax}px`;
const mediumMinPx = `${mediumMin}px`;
const mediumMaxPx = `${mediumMax}px`;
const largeMinPx = `${largeMin}px`;

const media = {
  smallOnly: `@media (max-width: ${smallMaxPx})`,
  mediumDown: `@media (max-width: ${mediumMaxPx})`,
  mediumOnly: `@media (min-width: ${mediumMinPx}) and (max-width: ${mediumMaxPx})`,
  mediumUp: `@media (min-width: ${mediumMinPx})`,
  largeOnly: `@media (min-width: ${largeMinPx})`,
} as const;

const componentBaseStyles = css`
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
  color: "#333333";
  font-family: "Source Sans Pro", YuGothic, "Yu Gothic", Meiryo, "メイリオ",
    "Hiragino Kaku Gothic ProN W3", "ヒラギノ角ゴ ProN W3", sans-serif;
  font-size: 16px;
  font-style: normal;
  line-height: 1.15;
  text-rendering: optimizeLegibility;
  text-transform: none;
  transition: all 0.25s ease;
  &::before,
  &::after {
    transition: all 0.25s ease;
    box-sizing: border-box;
  }
`;

const componentChildStyles = css`
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
  text-rendering: optimizeLegibility;
  transition: all 0.25s ease;
  &::before,
  &::after {
    transition: all 0.25s ease;
    box-sizing: border-box;
  }
`;

const FlowListItemTitle = styled.p<{ index?: number }>`
  ${componentChildStyles}
  align-items: center;
  display: flex;
  font-weight: bold;
  margin: 0 0 20px;
  padding-top: 1px;
  position: relative;
  ${media.smallOnly} {
    font-size: 16px;
  }
  ${media.mediumUp} {
    font-size: 20px;
  }
  &:before {
    align-items: center;
    background-color: blue;
    border-radius: 50%;
    color: white;
    content: "${({ index }) => index}";
    display: flex;
    font-size: 15px;
    justify-content: center;
    line-height: 1;
    position: absolute;
    ${media.smallOnly} {
      height: 20px;
      left: -31px;
      margin-right: 10px;
      top: 0;
      width: 20px;
    }
    ${media.mediumUp} {
      height: 26px;
      left: -42px;
      margin-right: 15px;
      top: 0;
      width: 26px;
    }
  }
`;

const FlowListItemContent = styled.div<{ index?: number }>`
  ${componentChildStyles}
  margin: 0 0 0 12px;
  ${media.smallOnly} {
    padding-left: 20px;
  }
  ${media.mediumUp} {
    padding-left: 28px;
  }
  & > *:last-child {
    margin-bottom: 0;
  }
`;

const FlowListItemBase = styled.li`
  ${componentBaseStyles}
  list-style-type: none;
  margin-top: 0;
  &:not(:last-child) {
    ${FlowListItemContent} {
      border-left: 2px solid blue;
      ${media.smallOnly} {
        padding-bottom: 40px;
      }
      ${media.mediumUp} {
        padding-bottom: 60px;
      }
    }
  }
`;

const FlowListBase = styled.ul`
  ${componentBaseStyles}
  margin-left: 0;
  padding-left: 0;
`;

export type FlowListItemProps = {
  index?: number;
  title: string;
};

export const FlowListItem: React.FC<FlowListItemProps> = (props) => {
  const { index, title, children } = props;

  return (
    <FlowListItemBase>
      <FlowListItemContent index={index}>
        <FlowListItemTitle index={index}>{title}</FlowListItemTitle>
        {children}
      </FlowListItemContent>
    </FlowListItemBase>
  );
};

const FlowList: React.FC = (props) => {
  const { children } = props;

  return (
    <FlowListBase>
      {React.Children.map(
        children,
        (child, index) =>
          child &&
          React.cloneElement(child as React.ReactElement<FlowListItemProps>, {
            index: index + 1,
          })
      )}
    </FlowListBase>
  );
};

export default FlowList;
