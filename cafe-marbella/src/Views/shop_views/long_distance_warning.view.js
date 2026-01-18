import React, { useContext } from "react";
import { useTheme } from "styled-components/native";
import {
  useNavigation,
  useRoute,
  StackActions,
} from "@react-navigation/native";
import { InteractionManager } from "react-native";

import { Container } from "../../components/containers/general.containers";
import { SafeArea } from "../../components/spacers and globals/safe-area.component";
import { Spacer } from "../../components/spacers and globals/optimized.spacer.component";
import { Exit_Header_With_Label } from "../../components/headers/exit_with_label.header";
import { Go_Back_Header } from "../../components/headers/goBack_with_label.header";
import { Text } from "../../infrastructure/typography/text.component";
import { Long_Distance_Warning_Tile } from "../../components/tiles/long_distance_warning.tile";
import { Regular_CTA } from "../../components/ctas/regular.cta";

import StoreIcon from "../../../assets/my_icons/storeIcon.svg";
import TimeIcon from "../../../assets/my_icons/time_icon.svg";
import DistanceIcon from "../../../assets/my_icons/distance_icon.svg";

export default function Long_Distance_Warning_View() {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { formatted_address, distance_in_miles, distance_time, coming_from } =
    route.params || {};

  return (
    <SafeArea
      background_color={theme.colors.bg.elements_bg}
      style={{ flex: 1 }}
    >
      <Container
        width="100%"
        height="100%"
        color={theme.colors.bg.elements_bg}
        // color={"green"}
        justify="flex-start"
        align="center"
      >
        <Go_Back_Header label="Warning" action={() => navigation.goBack()} />
        <Spacer position="top" size="large" />
        <Container
          width="100%"
          height="40%"
          //   color="red"
          color={"transparent"}
          justify="center"
          align="center"
        >
          <Long_Distance_Warning_Tile
            formatted_address={formatted_address}
            distance_time={distance_time}
            distance_in_miles={distance_in_miles}
          />

          {/* ****** Component ******** */}
        </Container>
        <Container
          width="100%"
          height="40%"
          //   color="red"
          color={"transparent"}
          justify="flex-start"
          align="center"
        >
          <Spacer position="top" size="extraLarge" />
          <Regular_CTA
            width="93%"
            height="25%"
            color={theme.colors.ui.business}
            border_radius={"0px"}
            border_width="0px"
            caption={"Yes, continue with purchase"}
            caption_text_variant="dm_sans_bold_20"
            // disabled={isLoading} // ✅ prevent double taps if your CTA supports it
            action={() => navigation.navigate("Shop_Order_Review_View")}
          />
          <Spacer position="top" size="extraLarge" />
          {/* <Spacer position="top" size="extraLarge" /> */}
          <Regular_CTA
            width="93%"
            height="25%"
            color="transparent"
            border_radius={"0px"}
            border_width="0px"
            caption={"No, it's very far away"}
            caption_text_variant="dm_sans_bold_20_underlined"
            action={() => navigation.dispatch(StackActions.popToTop())}
          />
        </Container>
      </Container>
    </SafeArea>
  );
}
