import React, { useContext } from "react";
import { useTheme } from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useTranslation } from "react-i18next";

import {
  Action_Container,
  Container,
} from "../../components/containers/general.containers";
import { SafeArea } from "../../components/spacers and globals/safe-area.component";
import { NewSafeArea } from "../../components/spacers and globals/safe-area.component";
import { Spacer } from "../../components/spacers and globals/optimized.spacer.component";
import { Exit_Header_With_Label } from "../../components/headers/exit_with_label.header";
import { Text } from "../../infrastructure/typography/text.component";
import { Menu_Sub_Title_Title } from "../../components/titles/menu_sub_titles.title";
import { Menu_Tile } from "../../components/tiles/menu_tiles.tile";
import { Switch_Language_Tile } from "../../components/tiles/switch_language.tile";
import { Regular_CTA } from "../../components/ctas/regular.cta";
import { Global_activity_indicator } from "../../components/activity indicators/global_activity_indicator_screen.component";

import { AuthenticationContext } from "../../infrastructure/services/authentication/authentication.context";
import { GlobalContext } from "../../infrastructure/services/global/global.context";
import { WarehouseContext } from "../../infrastructure/services/warehouse/warehouse.context";

export default function Menu_View() {
  const theme = useTheme();
  const navigation = useNavigation();
  const tabBarHeight = useBottomTabBarHeight();
  const { t } = useTranslation();

  const { user } = useContext(AuthenticationContext);
  const { email, display_name, user_id, customer_qr } = user || {};
  const { customer_token } = customer_qr || {};
  // console.log("Menu_View user:", user);

  // Check if there are other users in the device in order to use it as a
  //condition to enable or disable the "Switch to another account" option in the menu

  const { toggleGlobalLanguage, globalLanguage, isLoading } =
    useContext(GlobalContext);
  const { myWarehouse } = useContext(WarehouseContext);
  const { warehouse_name } = myWarehouse || {};

  return (
    <NewSafeArea
      background_color={theme.colors.bg.elements_bg}
      edges={["top", "left", "right"]}
      style={{ flex: 1 }}
    >
      {isLoading ? (
        <Global_activity_indicator caption={t("menu.activity_indicator")} />
      ) : user_id !== undefined ? (
        <Container
          width="100%"
          height="100%"
          color={theme.colors.bg.elements_bg}
          justify="flex-start"
          align="center"
          style={{ paddingBottom: tabBarHeight }}
        >
          <Exit_Header_With_Label
            caption=""
            action={() => navigation.goBack()}
            orientation="right"
          />
          <Container
            width="100%"
            height="10%"
            color={theme.colors.bg.elements_bg}
            justify="center"
            align="flex-start"
          >
            <Spacer position="left" size="extraLarge">
              <Text variant="raleway_bold_26">{t("menu.title")}</Text>
            </Spacer>
          </Container>

          <Spacer position="top" size="small" />
          <Container
            width="100%"
            height="15%"
            color={theme.colors.bg.elements_bg}
            justify="center"
            align="flex-start"
          >
            <Spacer position="left" size="extraLarge">
              <Text variant="raleway_bold_24">{display_name}</Text>
            </Spacer>
            <Spacer position="top" size="small" />
            <Spacer position="left" size="extraLarge">
              <Text variant="raleway_medium_16">{email}</Text>
            </Spacer>
          </Container>

          <ScrollView
            style={{ flex: 1, width: "100%" }}
            contentContainerStyle={{ flexGrow: 1, alignItems: "center" }}
          >
            <Menu_Sub_Title_Title caption={t("menu.profile_subTitle")} />
            <Menu_Tile
              caption={t("menu.tiles.personal_info")}
              action={() => navigation.navigate("Personal_Information_View")}
            />
            <Menu_Tile
              caption={t("menu.tiles.transactions_history")}
              // action={() => navigation.navigate("Orders_View")}
              action={() =>
                navigation.navigate("Orders", {
                  screen: "Orders_View",
                })
              }
            />
            <Menu_Tile
              caption={t("menu.tiles.qr_code")}
              action={() =>
                navigation.navigate("Customer_QR_View", {
                  customer_token,
                  size: 300,
                })
              }
              // disabled={true}
            />

            <Menu_Sub_Title_Title caption={t("menu.credentials_subTitle")} />
            <Menu_Tile
              caption={t("menu.tiles.get_new_pin")}
              action={() => navigation.navigate("Reset_PIN_View")}
            />
            <Menu_Tile
              caption={t("menu.tiles.switch_account")}
              action={() => navigation.navigate("Switching_Accounts_View")}
            />

            <Menu_Sub_Title_Title caption={t("menu.help_subTitle")} />
            <Switch_Language_Tile
              caption={t("menu.tiles.switch_language")}
              action={() => toggleGlobalLanguage()}
            />
            <Menu_Tile
              caption={t("menu.help_subTitle")}
              action={() => null}
              disabled={true}
            />
            <Menu_Tile
              caption={t("menu.tiles.sign_out")}
              action={() => navigation.navigate("Sign_Out_Overlay_View")}
            />
            <Menu_Tile
              // caption={t("menu.tiles.sign_out")}
              caption={`${t("menu.tiles.warehouse")} ${warehouse_name}`}
              action={() => null}
            />
            <Menu_Tile caption="" action={() => null} disabled={true} />
          </ScrollView>
        </Container>
      ) : (
        <Container
          width="100%"
          height="100%"
          color={theme.colors.bg.elements_bg}
          //color={"blue"}
          justify="flex-start"
          align="center"
          // style={{ paddingBottom: tabBarHeight }}
        >
          <Exit_Header_With_Label
            label="eppppa"
            action={() => navigation.goBack()}
            orientation="right"
          />
          {isLoading ? (
            <Global_activity_indicator caption={t("menu.activity_indicator")} />
          ) : (
            <>
              <Container
                width="100%"
                height="10%"
                color={theme.colors.bg.elements_bg}
                //color={"lightblue"}
                justify="center"
                align="flex-start"
              >
                <Spacer position="left" size="extraLarge">
                  <Text variant="raleway_bold_26">{t("menu.welcome")}</Text>
                </Spacer>
              </Container>

              <Spacer position="top" size="large" />

              <Container
                width="100%"
                height="72%"
                // flex={1}
                color={theme.colors.bg.elements_bg}
                //color={"lightgreen"}
                justify="space-between"
                align="center"
                direction="column"
              >
                <Container
                  width="100%"
                  height={"20%"}
                  color={theme.colors.bg.elements_bg}
                  justify="center"
                  align="flex-start"
                  padding_horizontal="5%"
                >
                  <Regular_CTA
                    width={"55%"}
                    height={60}
                    color={theme.colors.ui.black}
                    border_radius={"40px"}
                    caption={t("menu.sign_in_cta")}
                    caption_text_variant="raleway_regular_18_white"
                    action={() => {
                      navigation.navigate("AuthModal", {
                        screen: "Login_View",
                        params: {
                          returnTo: {
                            tab: "Shop",
                            screen: "Shop_Products_View",
                            params: {},
                          },
                        },
                      });
                    }}
                  />
                </Container>

                <Container
                  width="100%"
                  height="15%"
                  // color="lightblue"
                  style={{ marginBottom: 16 }}
                >
                  <Container
                    width="100%"
                    height="50%"
                    color={theme.colors.bg.elements_bg}
                    direction="column"
                  >
                    <Action_Container
                      width="100%"
                      height="100%"
                      // color="orange"
                      color={theme.colors.bg.elements_bg}
                      direction="column"
                      onPress={toggleGlobalLanguage}
                      justify="center"
                      align="flex-start"
                    >
                      <Spacer position="left" size="extraLarge">
                        <Text
                          variant="raleway_bold_14"
                          color={theme.colors.text.secondary}
                          style={{
                            textDecorationLine: "underline",
                          }}
                        >
                          {globalLanguage === "en"
                            ? "ES - Español"
                            : "EN - English"}
                        </Text>
                      </Spacer>
                    </Action_Container>
                  </Container>

                  <Container
                    width="100%"
                    height="50%"
                    color={theme.colors.bg.elements_bg}
                  />
                </Container>
              </Container>
            </>
          )}
        </Container>
      )}
    </NewSafeArea>
  );
}
