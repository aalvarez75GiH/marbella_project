import React from "react";
import { View } from "react-native";
import { List } from "react-native-paper";
import { Product_Initial_Card } from "../cards/product_initial_card/product_intial.card";
import { Product_Inventory_Edit_Card } from "../cards/products_inventory.card";

export const Inventory_Accordion = ({
  groundProducts = [],
  wholeProducts = [],
  onChangeVariantQty = null,
}) => {
  return (
    <View style={{ width: "100%" }}>
      <List.AccordionGroup>
        <List.Accordion
          id="ground"
          title={`Ground bean coffee (${groundProducts.length})`}
          style={{
            width: "100%",
            backgroundColor: "#FFFFFF",
          }}
          titleStyle={{
            color: "#000000",
            fontSize: 16,
          }}
        >
          <View style={{ padding: 12 }}>
            {groundProducts.map((product) => (
              <Product_Inventory_Edit_Card
                key={product.id}
                product={product}
                onChangeVariantStock={onChangeVariantStock}
              />
            ))}
          </View>
        </List.Accordion>

        <List.Accordion
          id="whole"
          title={`Whole bean coffee (${wholeProducts.length})`}
          style={{
            width: "100%",
            backgroundColor: "#FFFFFF",
          }}
          titleStyle={{
            color: "#000000",
            fontSize: 16,
          }}
        >
          <View style={{ padding: 12 }}>
            {wholeProducts.map((product) => (
              <Product_Inventory_Edit_Card
                key={product.id}
                product={product}
                onChangeVariantStock={onChangeVariantQty}
              />
            ))}
          </View>
        </List.Accordion>
      </List.AccordionGroup>
    </View>
  );
};
