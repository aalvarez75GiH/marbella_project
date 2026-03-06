import React, { useContext, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
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
import { navigationRef } from "../../infrastructure/navigation/navigation_ref.js";

import { AuthenticationContext } from "../../infrastructure/services/authentication/authentication.context.js";
import { CartContext } from "../../infrastructure/services/cart/cart.context.js";
import { OrdersContext } from "../../infrastructure/services/orders/orders.context.js";

export default function User_To_Create_Info_Review_View() {
  const navigation = useNavigation();
  const theme = useTheme();
  const route = useRoute();
  const { returnTo } = route?.params ?? {};
  // const [isLoading, setIsLoading] = useState(false);

  const { userToDB, registerUser, registerLocalUser } = useContext(
    AuthenticationContext
  );
  const { first_name, last_name, email, address, phone_number } =
    userToDB || {};

  const { prepareOrderFromCart } = useContext(OrdersContext);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  console.log("USER TO DB AT REVIEW VIEW:", JSON.stringify(userToDB, null, 2));

  const {
    cart,
    setCart,
    clearGuestCart,
    setCartTotalItems,
    getTotalCartQuantity,
    lockCartInit,
    mergeCartGuestOverridesDb,
    upsertCart,
    gettingCartByUserID,
    cartTotalItems,
  } = useContext(CartContext);

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
      {isSubmitting && (
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
          width="95%"
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
              width="30%"
              height="100%"
              color={theme.colors.bg.elements_bg}
              // color="blue"
              justify="center"
              align="flex-end"
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
                  {" "}
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
              width="30%"
              height="100%"
              color={theme.colors.bg.elements_bg}
              // color="blue"
              justify="center"
              align="flex-end"
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
                  {" "}
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
              width="30%"
              height="100%"
              color={theme.colors.bg.elements_bg}
              // color="blue"
              justify="center"
              align="flex-end"
            >
              <Spacer position="left" size="medium">
                <Text variant="raleway_bold_16" textAlign="center">
                  Email:
                </Text>
              </Spacer>
            </Container>
            <Container
              width="70%"
              height="100%"
              color={theme.colors.bg.elements_bg}
              //color="green"
              justify="center"
              align="flex-start"
            >
              <Spacer position="left" size="medium">
                <Text variant="raleway_regular_16" textAlign="center">
                  {" "}
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
              width="30%"
              height="100%"
              color={theme.colors.bg.elements_bg}
              // color="blue"
              justify="center"
              align="flex-end"
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
                <Text
                  variant="raleway_regular_16"
                  textAlign="center"
                  style={{
                    flexShrink: 1,
                    flexWrap: "wrap",
                  }}
                >
                  {" "}
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
              width="30%"
              height="100%"
              color={theme.colors.bg.elements_bg}
              // color="blue"
              justify="center"
              align="flex-end"
            >
              <Spacer position="left" size="medium">
                <Text variant="raleway_bold_16" textAlign="center">
                  Phone #:
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
                  {" "}
                  {phone_number}
                </Text>
              </Spacer>
            </Container>
          </Container>
          {error && (
            <Container
              width="100%"
              height="25%"
              color={theme.colors.bg.elements_bg}
              justify="flex-start"
              align="flex-start"
            >
              <Spacer position="top" size="large" />
              <Spacer position="left" size="large">
                <Text variant="dm_sans_bold_14" style={{ color: "red" }}>
                  {error}
                </Text>
              </Spacer>
            </Container>
          )}
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
          {error === "You already have a account, please log in instead." && (
            <Regular_CTA
              width="75%"
              height={"40%"}
              color={theme.colors.ui.primary}
              border_radius={"40px"}
              caption="Login instead"
              caption_text_variant="dm_sans_bold_20_white"
              // action={() => null}
              action={() => {
                navigation.reset({
                  index: 0,
                  routes: [
                    {
                      name: "Login_View",
                      params: { returnTo }, // keep returnTo if you had it
                    },
                  ],
                });
              }}
            />
          )}
          {!error && (
            <Regular_CTA
              width="75%"
              height={"40%"}
              color={theme.colors.ui.primary}
              border_radius={"40px"}
              caption="Finish registration"
              caption_text_variant="dm_sans_bold_20_white"
              action={async () => {
                if (isSubmitting) return; // prevent double taps
                setIsSubmitting(true);
                lockCartInit(true);

                try {
                  console.log("CTA: start register");

                  // 1) capture guest cart BEFORE registration call
                  const guestCart = cart;

                  // 2) register
                  const result = await registerUser(userToDB, cartPayload);

                  if (!result?.ok) {
                    setError(
                      result?.error === "Email already in use"
                        ? "You already have an account, please log in instead."
                        : result?.error || "Could not register"
                    );
                    return; // ✅ critical
                  }

                  const nextUser = { ...result.user, authenticated: true };
                  const userId = nextUser.user_id;

                  // 3) persist authenticated user locally
                  await registerLocalUser(nextUser);

                  // 4) fetch DB cart (new user may not have one yet)
                  let dbCart = null;
                  try {
                    dbCart = await gettingCartByUserID(userId, {
                      setState: false,
                    });
                  } catch (e) {
                    console.log("CTA: no db cart, continuing", e?.message ?? e);
                    dbCart = null;
                  }

                  // 5) merge (guest overrides db)
                  const mergedCart = mergeCartGuestOverridesDb(
                    dbCart,
                    guestCart,
                    userId
                  );

                  // 6) set local cart immediately (UI stays consistent)
                  setCart(mergedCart);
                  // ✅ no setCartTotalItems here — cartTotalItems derives from cart

                  // 7) persist merged cart
                  await upsertCart(mergedCart);

                  // 8) clear guest cart ONLY after successful upsert
                  await clearGuestCart();

                  // 9) build order from the same cart
                  prepareOrderFromCart(mergedCart, nextUser);

                  // 10) close auth modal
                  navigation.getParent()?.goBack();

                  // 11) then close auth modal

                  requestAnimationFrame(() => {
                    navigationRef.current?.navigate("App", {
                      screen: returnTo?.tab ?? "Shop",
                      params: {
                        screen: returnTo?.screen ?? "Home_View",
                        params: returnTo?.params ?? {},
                      },
                    });
                  });
                } catch (e) {
                  console.log("CTA REGISTER ERROR:", e?.message ?? e, e);
                  setError("Registration failed. Please try again.");
                } finally {
                  setIsSubmitting(false);
                  lockCartInit(false);
                }
              }}
            />
          )}
        </Container>
      </Container>
    </SafeArea>
  );
}
