import React from "react";
import styled, { useTheme } from "styled-components/native";
import { theme } from "../../infrastructure/theme";

const sizeVariant = {
  xs: 0.5,
  small: 1,
  medium: 2,
  large: 3,
  extraLarge: 4,
  xxl: 5,
};

const positionVariant = {
  top: "marginTop",
  left: "marginLeft",
  right: "marginRight",
  bottom: "marginBottom",
};

const colorVariant = {
  primary: theme.colors.bg.elements_bg,
  secondary: theme.colors.bg.screens_bg,
  success: theme.colors.ui.success,
};

const getVariant = (position, size, theme) => {
  const property = positionVariant[position];
  const sizeIndex = sizeVariant[size];
  const value = theme.space[sizeIndex];
  return `${property}: ${value}`;
};

const SpacerView = styled.View`
  ${({ variant }) => variant}
`;

export const Spacer = ({ position, size, children }) => {
  const theme = useTheme();
  const variant = getVariant(position, size, theme);
  return <SpacerView variant={variant}>{children}</SpacerView>;
};

Spacer.defaultProps = {
  position: "top",
  size: "small",
};
