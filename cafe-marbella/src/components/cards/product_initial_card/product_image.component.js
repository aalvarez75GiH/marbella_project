import React from "react";
import { Image } from "expo-image";
import { theme } from "../../../infrastructure/theme/index.js";
import { Container } from "../../containers/general.containers.js";
// import NotImageYet from "../../../../assets/ilustrations/broken-image.png";
import NotImageYet from "../../../../assets/my_icons/broken-image.png";
import { Text } from "../../../infrastructure/typography/text.component.js";

export const Product_Image_Component = ({ image }) => {
  const imageSource = typeof image === "string" ? { uri: image } : image;

  const isValidImage = imageSource === null;
  console.log("IS VALID IMAGE: ", isValidImage);

  console.log("IMAGE SOURCE IN PRODUCT IMAGE COMPONENT: ", imageSource);

  return (
    <Container
      width="100%"
      height="60%"
      color={theme.colors.bg.elements_bg}
      // color={"red"}
      justify="center"
      align="center"
      style={{ paddingRight: "5%" }}
    >
      <Image
        source={isValidImage ? NotImageYet : imageSource}
        style={{
          // width: isValidImage ? "190%" : "90%",
          width: "90%",
          height: isValidImage ? "50%" : "90%",
          // height: "190%",
        }}
        contentFit="contain" // replaces resizeMode
        transition={300} // smooth fade-in
        placeholder="blurhash-string"
      />
      {isValidImage && (
        <Text
          variant="dm_sans_bold_14"
          style={{ color: theme.colors.ui.error, marginTop: "10px" }}
        >
          Not image yet
        </Text>
      )}
    </Container>
  );
};
