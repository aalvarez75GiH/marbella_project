import { StatusBar } from "expo-status-bar";
import { StyleSheet, FlatList } from "react-native";
import { useTheme } from "styled-components/native";

import { fonts, fontWeights } from "../../infrastructure/theme/fonts";

import { Container } from "../../components/containers/general.containers";
// import BuggyIcon from "../../../assets/my_icons/buggy_icon.svg";
import { BuggyIcon } from "../../../assets/modified icons/buggy_modified_icon";
import { Go_Back_Header } from "../../components/headers/goBack_with_label.header";
import { SafeArea } from "../../components/spacers and globals/safe-area.component";
import { Spacer } from "../../components/spacers and globals/optimized.spacer.component";
import { Product_Initial_Card } from "../../components/cards/product_initial_card/product_intial.card";

import { whole_bean_coffee } from "../../../src/infrastructure/local data/products";
import { ground_bean_coffee } from "../../../src/infrastructure/local data/products";
import { products } from "../../../src/infrastructure/local data/products";

export default function Shop_View() {
  const data = products.filter((p) => p.grindType === "ground");
  console.log("GROUND BEAN COFFEE:", JSON.stringify(data, null, 2));

  const renderProductInitialCard = ({ item }) => {
    return (
      <Spacer position="bottom" size="medium">
        <Product_Initial_Card item={item} />
      </Spacer>
    );
  };

  const theme = useTheme();

  return (
    <SafeArea background_color={theme.colors.bg.elements_bg}>
      <Container
        width="100%"
        height="100%"
        color={theme.colors.bg.screens_bg}
        // color={"green"}
        justify="flex-start"
        align="center"
      >
        <Go_Back_Header action={() => null} label="Whole bean coffee" />
        <Spacer position="top" size="large" />
        {/* <Product_Initial_Card /> */}
        <FlatList
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          data={data}
          // data={ground_bean_coffee}
          // data={whole_bean_coffee}
          renderItem={renderProductInitialCard}
          keyExtractor={(item, id) => {
            return item.id;
          }}
        />
      </Container>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: theme.colors.ui.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  test: {
    width: 300,
    height: 300,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
});
