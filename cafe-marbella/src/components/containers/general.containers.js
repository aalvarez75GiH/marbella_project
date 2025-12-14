import { Pressable, ScrollView, TouchableOpacity, View } from "react-native";
import styled, { css } from "styled-components/native";
import { theme } from "../../infrastructure/theme/index"; // adjust path

const baseStyles = css`
  width: ${(props) => props.width || "100%"};
  ${(props) =>
    props.height &&
    css`
      height: ${props.height};
    `}
  /* height: ${(props) => (props.height ? props.height : undefined)}; */
  /* height: heightProp ? heightProp : undefined */

  justify-content: ${(props) => props.justify || "center"};
  align-items: ${(props) => props.align || "center"};
  background-color: ${(props) => props.color || "#FADADD"};
  flex-direction: ${(props) => props.direction || "column"};
  margin-top: ${(props) => props.margin_top || "0px"};
  margin-bottom: ${(props) => props.margin_bottom || "0px"};
  margin-right: ${(props) => props.margin_right || "0px"};
  margin-left: ${(props) => props.margin_left || "0px"};
  /* Correctly apply individual border radius properties */
  border-width: ${(props) => props.border_width || "0px"};
  border-color: ${(props) => props.border_color || "transparent"};
  border-style: ${(props) => props.border_style || "solid"};
  border-radius: ${(props) => props.border_radius || "0px"};
  border-top-left-radius: ${(props) =>
    props.border_radius_top_left || props.border_radius || "0px"};
  border-top-right-radius: ${(props) =>
    props.border_radius_top_right || props.border_radius || "0px"};
  border-bottom-left-radius: ${(props) =>
    props.border_radius_bottom_left || props.border_radius || "0px"};
  border-bottom-right-radius: ${(props) =>
    props.border_radius_bottom_right || props.border_radius || "0px"};
  gap: ${(props) => props.gap || "0px"};
  overflow: ${(props) => props.overflow || "visible"};
`;

export const Container = styled(View)`
  ${baseStyles};
`;

export const Flexible_Container = styled(View)`
  ${baseStyles};
  flex: ${(props) => props.flex || 1};
`;

export const Action_Container = styled(TouchableOpacity)`
  ${baseStyles};
`;

export const Action_Flex_Container = styled(TouchableOpacity)`
  ${baseStyles};
  flex: ${(props) => props.flex || 1};
`;

export const Scrollable_MainContent = styled(ScrollView).attrs((props) => ({
  contentContainerStyle: {
    justifyContent: props.justify || "center",
    alignItems: props.align || "center",
    flexGrow: 1,
  },
}))`
  width: ${(props) => props.width || "100%"};
  height: ${(props) => props.height || "89%"};
  background-color: ${(props) => props.color || "blue"};
`;

export const Pressable_Container = styled(Pressable)`
  ${baseStyles};
`;

export const ThumbnailPressable = styled(Pressable)`
  width: ${(props) => props.width || "80px"};
  height: ${(props) => props.height || "80px"};
  border-radius: ${(props) => props.radius || "12px"};
  overflow: hidden;

  justify-content: center;
  align-items: center;

  border-width: ${(props) => (props.active ? "2px" : "1px")};
  border-color: ${(props) =>
    props.active ? theme.colors.ui.success : "#E2E2E2"};
  background-color: #f8f8f8;
`;
