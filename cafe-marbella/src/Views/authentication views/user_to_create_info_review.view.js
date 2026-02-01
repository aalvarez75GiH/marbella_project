import React, { useContext, useState, useMemo } from "react";
import { View, KeyboardAvoidingView, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "styled-components/native";

import { Container } from "../../components/containers/general.containers.js";
import { Go_Back_Header } from "../../components/headers/goBack_with_label.header.js";
import { SafeArea } from "../../components/spacers and globals/safe-area.component.js";
import { Spacer } from "../../components/spacers and globals/optimized.spacer.component.js";
import { Text } from "../../infrastructure/typography/text.component.js";
import { DataInput } from "../../components/inputs/data_text_input.js";
import { Regular_CTA } from "../../components/ctas/regular.cta.js";

import { AuthenticationContext } from "../../infrastructure/services/authentication/authentication.context.js";
import { GlobalContext } from "../../infrastructure/services/global/global.context.js";

export default function User_To_Create_Info_Review_View() {
  const navigation = useNavigation();
  const theme = useTheme();

  const { userToDB } = useContext(AuthenticationContext);
  const { first_name, last_name, email, address, phone_number } =
    userToDB || {};

  return (
    <SafeArea
      background_color={theme.colors.bg.elements_bg}
      style={{ flex: 1 }}
    >
      <Container
        width="100%"
        height="100%"
        color={theme.colors.bg.elements_bg}
        justify="flex-start"
        align="center"
      >
        <Go_Back_Header
          label="Your information review"
          action={() => navigation.goBack()}
        />

        {/* <Container
          width="100%"
          height="10%"
          color={theme.colors.bg.elements_bg}
          align="flex-start"
          justify="center"
          // color={"lightblue"}
        >
          <Spacer position="left" size="large">
            <Text variant="raleway_bold_20" textAlign="center">
              Your information review:
            </Text>
          </Spacer>
        </Container> */}
        <Spacer position="top" size="extraLarge" />

        <Container
          width="100%"
          height="60%"
          color={theme.colors.bg.elements_bg}
          // color="red"
          justify="flex-start"
          align="center"
          direction="column"
        >
          {/* ********************************* */}
          <Container
            width="100%"
            height="10%"
            color={theme.colors.bg.elements_bg}
            // color="pink"
            justify="flex-start"
            align="center"
            direction="row"
          >
            <Container
              width="35%"
              height="100%"
              color={theme.colors.bg.elements_bg}
              // color="blue"
              justify="center"
              align="flex-start"
              // direction="row"
            >
              <Spacer position="left" size="medium">
                <Text variant="raleway_bold_16" textAlign="center">
                  First name:
                </Text>
              </Spacer>
            </Container>
            <Container
              width="65%"
              height="100%"
              color={theme.colors.bg.elements_bg}
              // color="green"
              justify="center"
              align="flex-start"
              // direction="row"
            >
              <Spacer position="left" size="medium">
                <Text variant="raleway_regular_16" textAlign="center">
                  {first_name}
                </Text>
              </Spacer>
            </Container>
          </Container>
          {/* ********************************* */}
          <Container
            width="100%"
            height="10%"
            color={theme.colors.bg.elements_bg}
            // color="red"
            justify="flex-start"
            align="center"
            direction="row"
          >
            <Container
              width="35%"
              height="100%"
              color={theme.colors.bg.elements_bg}
              // color="blue"
              justify="center"
              align="flex-start"

              // direction="row"
            >
              <Spacer position="left" size="medium">
                <Text variant="raleway_bold_16" textAlign="center">
                  Last name:
                </Text>
              </Spacer>
            </Container>
            <Container
              width="65%"
              height="100%"
              color={theme.colors.bg.elements_bg}
              // color="green"
              justify="center"
              align="flex-start"
              // direction="row"
            >
              <Spacer position="left" size="medium">
                <Text variant="raleway_regular_16" textAlign="center">
                  {last_name}
                </Text>
              </Spacer>
            </Container>
          </Container>
          {/* ********************************* */}
          <Container
            width="100%"
            height="10%"
            color={theme.colors.bg.elements_bg}
            // color="red"
            justify="flex-start"
            align="center"
            direction="row"
          >
            <Container
              width="35%"
              height="100%"
              color={theme.colors.bg.elements_bg}
              // color="blue"
              justify="center"
              align="flex-start"

              // direction="row"
            >
              <Spacer position="left" size="medium">
                <Text variant="raleway_bold_16" textAlign="center">
                  Email:
                </Text>
              </Spacer>
            </Container>
            <Container
              width="65%"
              height="100%"
              color={theme.colors.bg.elements_bg}
              // color="green"
              justify="center"
              align="flex-start"
              // direction="row"
            >
              <Spacer position="left" size="medium">
                <Text variant="raleway_regular_16" textAlign="center">
                  {email}
                </Text>
              </Spacer>
            </Container>
          </Container>
          {/* ********************************* */}
          <Container
            width="100%"
            height="10%"
            color={theme.colors.bg.elements_bg}
            // color="red"
            justify="flex-start"
            align="center"
            direction="row"
          >
            <Container
              width="35%"
              height="100%"
              color={theme.colors.bg.elements_bg}
              // color="blue"
              justify="center"
              align="flex-start"

              // direction="row"
            >
              <Spacer position="left" size="medium">
                <Text variant="raleway_bold_16" textAlign="center">
                  Address:
                </Text>
              </Spacer>
            </Container>
            <Container
              width="65%"
              height="100%"
              color={theme.colors.bg.elements_bg}
              // color="green"
              justify="center"
              align="flex-start"
              // direction="row"
            >
              <Spacer position="left" size="medium">
                <Text variant="raleway_regular_16" textAlign="center">
                  {address}
                </Text>
              </Spacer>
            </Container>
          </Container>
          {/* ********************************* */}
          <Container
            width="100%"
            height="10%"
            color={theme.colors.bg.elements_bg}
            // color="red"
            justify="flex-start"
            align="center"
            direction="row"
          >
            <Container
              width="35%"
              height="100%"
              color={theme.colors.bg.elements_bg}
              // color="blue"
              justify="center"
              align="flex-start"

              // direction="row"
            >
              <Spacer position="left" size="medium">
                <Text variant="raleway_bold_16" textAlign="center">
                  Phone number:
                </Text>
              </Spacer>
            </Container>
            <Container
              width="65%"
              height="100%"
              color={theme.colors.bg.elements_bg}
              // color="green"
              justify="center"
              align="flex-start"
              // direction="row"
            >
              <Spacer position="left" size="medium">
                <Text variant="raleway_regular_16" textAlign="center">
                  {phone_number}
                </Text>
              </Spacer>
            </Container>
          </Container>
        </Container>

        {/* CTA pinned bottom-ish using flex (Option A pattern) */}
        <Container
          width="100%"
          // style={{ flex: 1, paddingBottom: 16 }}
          color={theme.colors.bg.elements_bg}
          //color={"red"}
          align="center"
          justify="center"
          direction="row"
        >
          <Regular_CTA
            width="75%"
            height={70}
            color={theme.colors.ui.primary}
            border_radius={"40px"}
            caption="Finish registration"
            caption_text_variant="dm_sans_bold_20_white"
            action={() => null}
          />
        </Container>
      </Container>
    </SafeArea>
  );
}
