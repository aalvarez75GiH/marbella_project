import { useTheme } from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native";

import {
  Container,
  Flexible_Container,
} from "../../components/containers/general.containers";
// import BuggyIcon from "../../../assets/my_icons/buggy_icon.svg";
import { BuggyIcon } from "../../../assets/modified icons/buggy_modified_icon";
import { Go_Back_Header } from "../../components/headers/goBack_with_label.header";
import { SafeArea } from "../../components/spacers and globals/safe-area.component";
import { Spacer } from "../../components/spacers and globals/optimized.spacer.component";
import { Product_Initial_Card } from "../../components/cards/product_initial_card/product_intial.card";

import { whole_bean_coffee } from "../../../src/infrastructure/local data/products";
import { ground_bean_coffee } from "../../../src/infrastructure/local data/products";
import { Product_Details_Card } from "../../components/cards/product_details_card/product_details.card";

export default function Shop_Product_Details_View({ route }) {
  const theme = useTheme();
  const navigation = useNavigation();
  const { item } = route.params;
  console.log("ROUTE ITEM:", JSON.stringify(item, null, 2));
  return (
    <SafeArea
      background_color={theme.colors.bg.elements_bg}
      style={{ flex: 1 }}
    >
      <Go_Back_Header
        action={() => navigation.goBack()}
        label="Product Details"
      />
      {/* <Flexible_Container> */}
      <ScrollView
        style={{ flex: 1, width: "100%" }}
        showsVerticalScrollIndicator={false}
        // contentContainerStyle={{
        //   paddingBottom: 260,
        // }}
      >
        <Product_Details_Card item={item} />
      </ScrollView>
      {/* </Flexible_Container> */}
    </SafeArea>
  );
}
