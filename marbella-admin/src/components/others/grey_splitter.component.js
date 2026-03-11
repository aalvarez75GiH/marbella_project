import React from "react";

import { Container } from "../containers/general.containers.js";

export const Splitter_Component = ({
  width = "0.3%",
  height = null,
  color = "#898989",
}) => {
  return <Container width={width} height={height} color={color}></Container>;
};
