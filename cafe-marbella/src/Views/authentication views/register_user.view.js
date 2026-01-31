import React, { useContext, useEffect } from "react";
import { FlatList, View, SectionList } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from "styled-components/native";

import { Container } from "../../components/containers/general.containers";
import { Just_Caption_Header } from "../../components/headers/just_caption.header.js";
import { Exit_Header_With_Label } from "../../components/headers/exit_with_label.header";
import { SafeArea } from "../../components/spacers and globals/safe-area.component";
import { Spacer } from "../../components/spacers and globals/optimized.spacer.component";
import { Text } from "../../infrastructure/typography/text.component";
import { Global_activity_indicator } from "../../components/activity indicators/global_activity_indicator_screen.component";

import { AuthenticationContext } from "../../infrastructure/services/authentication/authentication.context.js";

export default function Register_Users_View() {
  const navigation = useNavigation();

  const { user } = useContext(AuthenticationContext);
  const { user_id } = user || {};
  const theme = useTheme();

  const route = useRoute();

  return (
    <SafeArea
      background_color={theme.colors.bg.elements_bg}
      style={{ flex: 1 }}
    >
      <Container
        width="100%"
        height="100%"
        color={theme.colors.bg.elements_bg}
        //color={"red"}
        justify="flex-start"
        align="center"
      >
        <Exit_Header_With_Label
          label="Register user"
          action={() => navigation.goBack()}
        />
      </Container>
    </SafeArea>
  );
}
