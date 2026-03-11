import styled from "styled-components/native";
import { Card } from "react-native-paper";

export const ProductCardContainer = styled(Card)`
  background-color: ${(props) => props.theme.colors.ui.quaternary};
  width: 95%;
  height: 100%;
  margin-left: 3%;
`;

export const ProductCardCover = styled(Card.Cover)`
  padding: ${(props) => props.theme.space[3]};
  height: 400px;
  background-color: ${(props) => props.theme.colors.bg.primary};
`;
