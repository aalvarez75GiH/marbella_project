import React from "react";

import { Container } from "../containers/general.containers.js";

export const Splitter_Component = ({
  width = "90%",
  height = "0.3%",
  color = "#EBEBEB",
}) => {
  return <Container width={width} height={height} color={color}></Container>;
};
