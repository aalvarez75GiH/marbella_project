import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "../../infrastructure/typography/text.component"; // or RN Text
import CartIcon from "../../../assets/my_icons/cart.svg";
import BuggyIcon from "../../../assets/my_icons/buggy.svg";
import { Container } from "../containers/general.containers";
import { Spacer } from "../spacers and globals/optimized.spacer.component";
import { theme } from "../../infrastructure/theme";

export const Cart_Active_With_Items_CTA = ({ color, size = 25, quantity }) => {
  return (
    <>
      <Container
        width={"100%"}
        height={"100%"}
        justify="center"
        align="center"
        direction="row"
        color={theme.colors.bg.elements_bg}
      >
        <BuggyIcon width={size} height={size} fill={"#FFFFFF"} />
        <Spacer position="left" size="medium" />
        {quantity > 0 && (
          <View style={{ width: size, height: size }}>
            {quantity > 0 && (
              <View style={styles.badge}>
                <Text variant="raleway_bold_10" style={styles.badgeText}>
                  {quantity > 9 ? "9+" : quantity}
                </Text>
              </View>
            )}
          </View>
        )}
      </Container>
    </>
  );
};
//   return (
//     <View style={{ width: size, height: size }}>
//       <BuggyIcon width={size} height={size} fill={"#FFFFFF"} />

//       {quantity > 0 && (
//         <View style={styles.badge}>
//           <Text variant="raleway_bold_10" style={styles.badgeText}>
//             {quantity > 99 ? "99+" : quantity}
//           </Text>
//         </View>
//       )}
//     </View>
//   );
// };

const styles = StyleSheet.create({
  badge: {
    position: "absolute",
    top: 0,
    right: 0,
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    paddingHorizontal: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E53935",
  },
  badgeText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },
});

// const styles = StyleSheet.create({
//   badge: {
//     position: "absolute",
//     top: -8,
//     right: -10,
//     minWidth: 18,
//     height: 18,
//     borderRadius: 9,
//     paddingHorizontal: 5,
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "#E53935",
//   },
//   badgeText: {
//     color: "#fff",
//     fontSize: 10,
//     fontWeight: "700",
//   },
// });
