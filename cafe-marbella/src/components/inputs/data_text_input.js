import styled from "styled-components/native";
import { TextInput } from "react-native-paper";
export const DataInput = styled(TextInput)`
  width: 95%;
  height: 80px;
  border-bottom-width: ${(props) => props.border_width || "1px"};
  border-color: ${(props) => props.border_color} !important;
  background-color: ${(props) => props.theme.colors.bg.elements_bg} !important;
`;
