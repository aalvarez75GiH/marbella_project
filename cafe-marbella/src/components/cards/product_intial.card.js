import React from "react";
import { Image } from "react-native";
import { Text } from "../../infrastructure/typography/text.component.js";
import {
  Container,
  Action_Container,
} from "../containers/general.containers.js";
import { theme } from "../../infrastructure/theme/index.js";
import { Spacer } from "../spacers and globals/optimized.spacer.component.js";
import StarIcon from "../../../assets/my_icons/star_icon.svg";

export const Product_Initial_Card = ({
  item = null,
  action,
  caption = "",
  product_type = "Medium Roast",
  product_size_1 = "250g",
  product_size_2 = "500g",
  product_size_3 = "1kg",
  product_image_path = "../../../assets/products_images/vzla_bag_wb.png",
}) => {
  const images = {
    product1: require("../../../assets/products_images/vzla_bag_wb.png"),
    product2: require("../../../assets/products_images/vzla_bag_wb.png"),
  };

  console.log("ITEM:", JSON.stringify(item, null, 2));
  const { flag_image: FlagImage } = item || {};

  return (
    <Container
      width="370px"
      height="480px"
      align="center"
      direction="column"
      justify="flex-start"
      color={theme.colors.bg.elements_bg}
    >
      <Container
        width="100%"
        height="10%"
        color={theme.colors.bg.elements_bg}
        // color={"lightblue"}
        justify="space-between"
        align="center"
        direction="row"
      >
        <Container
          width="20%"
          height="100%"
          color={theme.colors.bg.elements_bg}
          // color={"blue"}
          justify="center"
          align="center"
          direction="row"
        >
          <StarIcon width={30} height={22} />
          <Spacer position="left" size="medium" />
          <Text variant="raleway_bold_16">{item.rating}</Text>
        </Container>
        <Container
          width="15%"
          height="100%"
          color={theme.colors.bg.elements_bg}
          // color={"blue"}
          justify="center"
          align="center"
        >
          <FlagImage width={40} height={35} />
        </Container>
      </Container>
      <Container
        width="100%"
        height="60%"
        color={theme.colors.bg.elements_bg}
        //color={"red"}
        justify="center"
        align="center"
        style={{ paddingRight: "5%" }}
      >
        <Image
          // source={images[item.image]}
          source={item.image}
          style={{
            width: "90%",
            height: "90%",
            resizeMode: "contain", // Ensures the image fits without distortion
          }}
        />
      </Container>
      <Container
        width="100%"
        height="26%"
        //color={theme.colors.bg.elements_bg}
        color={"lightgreen"}
        justify="center"
        align="center"
        direction="row"
      >
        <Container
          width="75%"
          height="100%"
          color={theme.colors.bg.elements_bg}
          // color={"#CAD"}
          justify="flex-start"
          align="flex-start"
          // style={{ paddingRight: "5%" }}
        >
          <Spacer position="top" size="large" />
          <Spacer position="left" size="large">
            <Text variant="raleway_bold_18">{item.product_name_1}</Text>
            <Text variant="raleway_bold_18">{item.product_name_2}</Text>
          </Spacer>
          <Container
            width="100%"
            height="45%"
            color={theme.colors.bg.elements_bg}
            // color={"blue"}
            justify="flex-start"
            align="flex-start"
            direction="row"
          >
            <Spacer position="left" size="large" />
            {/* <Text variant="raleway_bold_18">250 gr</Text> */}
            <Text variant="raleway_bold_18">{item.sizes[0]}</Text>
            <Spacer position="left" size="medium" />
            <Container width="2px" height="25px" color="#000000" />
            <Spacer position="left" size="large" />
            <Text variant="raleway_bold_18">{item.sizes[1]}</Text>
            <Spacer position="left" size="medium" />
            <Container width="2px" height="25px" color="#000000" />
            <Spacer position="left" size="large" />
            <Text variant="raleway_bold_18">{item.sizes[2]}</Text>
          </Container>
        </Container>
        <Container
          width="25%"
          height="100%"
          color={theme.colors.bg.elements_bg}
          // color="lightyellow"
          justify="center"
          align="center"
          // style={{ paddingRight: "5%" }}
        >
          <Text
            variant="raleway_bold_14"
            style={{ color: "#247F35", textDecorationLine: "underline" }}
          >
            View
          </Text>
        </Container>
      </Container>
      <Spacer position="top" size="small" />
      <Container
        width="100%"
        height="3%"
        //color={theme.colors.bg.elements_bg}
        color={"#CA7B53"}
        justify="center"
        align="center"
        style={{ paddingRight: "6%" }}
      ></Container>
    </Container>
  );
};
