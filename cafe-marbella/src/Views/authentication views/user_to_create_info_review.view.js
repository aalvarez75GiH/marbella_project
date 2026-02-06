import React, { useContext } from "react";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { useTheme } from "styled-components/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { rootNavigate } from "../../infrastructure/navigation/navigation_ref.js";

import { Container } from "../../components/containers/general.containers.js";
import { Go_Back_Header } from "../../components/headers/goBack_with_label.header.js";
import { SafeArea } from "../../components/spacers and globals/safe-area.component.js";
import { Spacer } from "../../components/spacers and globals/optimized.spacer.component.js";
import { Text } from "../../infrastructure/typography/text.component.js";
import { Regular_CTA } from "../../components/ctas/regular.cta.js";
import { Global_activity_indicator } from "../../components/activity indicators/global_activity_indicator_screen.component.js";
import { rootReset } from "../../infrastructure/navigation/navigation_ref";
import { normalizeCartFromBackend } from "../../infrastructure/local_data/images_mapping/normalize_cart_from_backend.js";

import { AuthenticationContext } from "../../infrastructure/services/authentication/authentication.context.js";
import { CartContext } from "../../infrastructure/services/cart/cart.context.js";
import { OrdersContext } from "../../infrastructure/services/orders/orders.context.js";
import { GlobalContext } from "../../infrastructure/services/global/global.context.js";

export default function User_To_Create_Info_Review_View() {
  const navigation = useNavigation();
  const theme = useTheme();

  const [isLoading, setIsLoading] = React.useState(false);

  const { userToDB, registerUser, setUser, registerLocalUser } = useContext(
    AuthenticationContext
  );
  const { first_name, last_name, email, address, phone_number } =
    userToDB || {};

  const { prepareOrderFromCart } = useContext(OrdersContext);

  console.log("USER TO DB AT REVIEW VIEW:", JSON.stringify(userToDB, null, 2));

  const {
    cart,
    setCart,
    clearGuestCart,
    setCartTotalItems,
    getTotalCartQuantity,
  } = useContext(CartContext);
  const { productsCatalog } = useContext(GlobalContext);

  const cartPayload = {
    products: cart.products.map((p) => {
      const v = p.size_variants[0]; // your cart stores selected variant at index 0
      return {
        productId: p.id,
        variantId: v.id,
        quantity: v.quantity,
        images: v.images ?? [],
        image_keys: v.image_keys ?? [],
      };
    }),
  };

  console.log(
    "CART PAYLOAD AT REVIEW VIEW:",
    JSON.stringify(cartPayload, null, 2)
  );
  console.log(
    "RAW CART PAYLOAD AT REVIEW VIEW:",
    JSON.stringify(cart, null, 2)
  );

  return (
    <SafeArea
      background_color={theme.colors.bg.elements_bg}
      style={{ flex: 1 }}
    >
      {isLoading && (
        <Global_activity_indicator
          caption="Wait, we are registering your account..."
          caption_width="65%"
          color={theme.colors.bg.elements_bg}
        />
      )}
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
            height={"40%"}
            color={theme.colors.ui.primary}
            border_radius={"40px"}
            caption="Finish registration"
            caption_text_variant="dm_sans_bold_20_white"
            action={async () => {
              setIsLoading(true);
              try {
                const result = await registerUser(userToDB, cartPayload);
                console.log(
                  "REGISTER RESULT:",
                  JSON.stringify(result, null, 2)
                );

                if (!result?.ok) {
                  console.log("Register failed:", result);
                  return;
                }

                const nextUser = { ...result.user, authenticated: true };
                const nextCart = { ...result.cart };

                // ✅ 1) Persist session so reload restores user
                await registerLocalUser(nextUser);
                // (This should setUser internally too. If not, keep setUser below.)

                // ✅ 2) Update contexts (safe to keep even if registerLocalUser sets user)
                const hydratedCart = normalizeCartFromBackend(nextCart);
                setCart(hydratedCart);
                setCartTotalItems(getTotalCartQuantity(hydratedCart));

                // ✅ 3) Clear guest cart storage
                await clearGuestCart();

                // ✅ 4) Build order BEFORE navigating
                prepareOrderFromCart(hydratedCart, nextUser);

                // ✅ 5) One reset only
                rootReset({
                  index: 0,
                  routes: [
                    {
                      name: "App",
                      state: {
                        index: 0,
                        routes: [
                          {
                            name: "Shop",
                            state: {
                              index: 0,
                              routes: [
                                {
                                  name: "Shop_Delivery_Type_View",
                                  params: { coming_from: "Shopping_Cart_View" },
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                  ],
                });
              } catch (e) {
                console.log("Finish registration action error:", e);
              } finally {
                setIsLoading(false);
              }
            }}
          />
        </Container>
      </Container>
    </SafeArea>
  );
}
