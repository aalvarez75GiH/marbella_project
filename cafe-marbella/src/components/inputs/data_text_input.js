import styled from "styled-components/native";
import { TextInput } from "react-native-paper";
export const DataInput = styled(TextInput)`
  width: 95%;
  height: 80px;
  border-bottom-width: 2px;
  background-color: ${(props) => props.theme.colors.bg.elements_bg} !important;
  /* margin: ${(props) => props.theme.space[3]}; */
`;
