import React, { use, useContext, useEffect, useState } from "react";
import { FlatList, View, SectionList, StyleSheet, Image } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from "styled-components/native";

import { Container } from "../../components/containers/general.containers";
import { Just_Caption_Header } from "../../components/headers/just_caption.header.js";
import { Exit_Header_With_Label } from "../../components/headers/exit_with_label.header";
import { Go_Back_Header } from "../../components/headers/goBack_with_label.header.js";
import { SafeArea } from "../../components/spacers and globals/safe-area.component";
import { Spacer } from "../../components/spacers and globals/optimized.spacer.component";
import { Text } from "../../infrastructure/typography/text.component";
import { Global_activity_indicator } from "../../components/activity indicators/global_activity_indicator_screen.component";
import { DataInput } from "../../components/inputs/data_text_input.js";
import { Underlined_CTA } from "../../components/ctas/underlined.cta.js";
import { AuthenticationContext } from "../../infrastructure/services/authentication/authentication.context.js";

export default function Login_Users_View() {
  const navigation = useNavigation();

  const {
    user,
    email,
    setEmail,
    setPassword,
    password,
    setUserToDB,
    userToDB,
    comingFrom,
  } = useContext(AuthenticationContext);
  const { user_id } = user || {};
  const theme = useTheme();

  const [emailTouched, setEmailTouched] = useState(false);
  const [error, setError] = useState(null);

  const route = useRoute();

  console.log("COMING TO LOGIN VIEW FROM:", comingFrom);
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
        <Go_Back_Header label="" action={() => navigation.goBack()} />
        <Container
          width="100%"
          height="15%"
          color={theme.colors.bg.elements_bg}
        >
          <Image
            source={require("../../../assets/brand_images/marbella_cafe_especial_logo_transparent.png")}
            style={styles.image_1}
          />
        </Container>
        <Container
          width="100%"
          height="10%"
          color={theme.colors.bg.elements_bg}
          //   color={"yellow"}
          align="flex-start"
        >
          <Spacer position="left" size="extraLarge">
            <Text variant="raleway_bold_18" textAlign="center">
              Let's start logging In...
            </Text>
          </Spacer>
        </Container>
        <Container
          width="100%"
          height="20%"
          color={theme.colors.bg.elements_bg}
          //   color={"yellow"}
          align="center"
          direction="column"
        >
          <DataInput
            label="Enter email "
            value={userToDB.email}
            onChangeText={(value) => {
              setUserToDB({
                ...userToDB,
                email: value,
              });
              if (emailTouched) setEmailTouched(false);
              if (error) setError(null);
            }}
            // underlineColor={theme.colors.inputs.bottom_lines_disabled}
            border_color={theme.colors.inputs.bottom_lines_disabled}
            underlineColor={theme.colors.inputs.bottom_lines_disabled}
            border_width={"0.5px"}
            activeUnderlineColor={theme.colors.ui.primary}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="emailAddress"
            autoComplete="email"
            returnKeyType="done"
            blurOnSubmit
          />
          <Spacer position="top" size="extraLarge" />
          <DataInput
            label="Enter password "
            value={userToDB.password}
            onChangeText={(value) => {
              setUserToDB({
                ...userToDB,
                password: value,
              });
              if (emailTouched) setEmailTouched(false);
              if (error) setError(null);
            }}
            underlineColor={theme.colors.inputs.bottom_lines_disabled}
            border_color={theme.colors.inputs.bottom_lines_disabled}
            border_width={"0.5px"}
            activeUnderlineColor={theme.colors.ui.primary}
            keyboardType="password"
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="Password"
            autoComplete="email"
            returnKeyType="done"
            blurOnSubmit
          />
        </Container>
        <Spacer position="top" size="extraLarge" />
        <Container
          width="100%"
          height="10%"
          color={theme.colors.bg.elements_bg}
          //   color={"yellow"}
          align="center"
          direction="row"
        >
          <Spacer position="left" size="extraLarge" />
          <Underlined_CTA
            width="50%"
            height={"40%"}
            caption="Forgot my password"
            color="transparent"
            action={() => null}
            border_color="#898989"
          />
          <Underlined_CTA
            width="50%"
            height={"40%"}
            caption="Sign Up"
            color="transparent"
            action={() => navigation.navigate("Enter_Names_View")}
            border_color="#898989"
          />
        </Container>
      </Container>
    </SafeArea>
  );
}
const styles = StyleSheet.create({
  image_1: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  image_2: {
    width: "90%",
    height: "90%",
    resizeMode: "contain",
  },
});
