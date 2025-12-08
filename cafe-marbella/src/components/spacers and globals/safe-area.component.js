import { Platform, SafeAreaView } from "react-native";
import styled from "styled-components/native";

export const SafeArea = styled(SafeAreaView)`
  flex: 1;
  padding-top: ${Platform.OS === "android" ? 35 : 0}px;
  background-color: ${(props) => props.background_color};
  /* justify-content: center; */
  /* align-items: center; */
`;
