import React, { useEffect, useRef, useState } from "react";
import { Animated, ActivityIndicator } from "react-native";
import { Image } from "expo-image";

import { Container } from "../containers/general.containers";
import { theme } from "../../infrastructure/theme/index";
import { Text } from "../../infrastructure/typography/text.component";

const splashImages = [
  require("../../../assets/splash_screen_images/splash_screen_image_1.png"),
  require("../../../assets/splash_screen_images/splash_screen_image_2.png"),
  require("../../../assets/splash_screen_images/splash_screen_image_3.png"),
  require("../../../assets/splash_screen_images/splash_screen_image_4.png"),
  require("../../../assets/splash_screen_images/splash_screen_image_5.png"),
  require("../../../assets/splash_screen_images/splash_screen_image_6.png"),
];

const NORMAL_IMAGE_DURATION = 1000;
const LAST_IMAGE_DURATION = 4000;
const FADE_OUT_DURATION = 250;
const FADE_IN_DURATION = 350;

export const Marbella_Custom_Splash = () => {
  const opacity = useRef(new Animated.Value(1)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    let timeoutId;

    const animateToNextImage = () => {
      const currentDuration =
        imageIndex === splashImages.length - 1
          ? LAST_IMAGE_DURATION
          : NORMAL_IMAGE_DURATION;

      timeoutId = setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0.35,
            duration: FADE_OUT_DURATION,
            useNativeDriver: true,
          }),
          Animated.timing(overlayOpacity, {
            toValue: 1,
            duration: FADE_OUT_DURATION,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setImageIndex((currentIndex) => {
            return (currentIndex + 1) % splashImages.length;
          });

          Animated.parallel([
            Animated.timing(opacity, {
              toValue: 1,
              duration: FADE_IN_DURATION,
              useNativeDriver: true,
            }),
            Animated.timing(overlayOpacity, {
              toValue: 0,
              duration: FADE_IN_DURATION,
              useNativeDriver: true,
            }),
          ]).start();
        });
      }, currentDuration);
    };

    animateToNextImage();

    return () => clearTimeout(timeoutId);
  }, [imageIndex, opacity, overlayOpacity]);

  const isLastImage = imageIndex === splashImages.length - 1;

  return (
    <Container
      width="100%"
      height="100%"
      color={theme.colors.bg.elements_bg}
      justify="center"
      align="center"
    >
      <Animated.View
        style={{
          width: "100%",
          height: "100%",
          opacity,
          position: "absolute",
        }}
      >
        <Image
          source={splashImages[imageIndex]}
          style={{
            width: "100%",
            height: "100%",
          }}
          contentFit="cover"
          transition={300}
        />
      </Animated.View>

      <Animated.View
        pointerEvents="none"
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(180,180,180,0.18)",
          opacity: overlayOpacity,
        }}
      />

      <Container
        width="100%"
        height="100%"
        color="rgba(0,0,0,0.10)"
        justify="flex-end"
        align="center"
        style={{
          paddingBottom: 45,
        }}
      >
        {isLastImage && (
          <>
            <ActivityIndicator size="large" color={theme.colors.ui.white} />
            <Text
              variant="raleway_bold_24_white"
              color="#FFFFFF"
              style={{
                marginTop: 10,
              }}
            >
              Welcome
            </Text>
          </>
        )}
      </Container>
    </Container>
  );
};
// import React, { useEffect, useRef, useState } from "react";
// import { Animated } from "react-native";
// import { Image } from "expo-image";
// // import { useTheme } from "styled-components/native";

// import { Container } from "../containers/general.containers";
// import { Text } from "../../infrastructure/typography/text.component";
// import { theme } from "../../infrastructure/theme/index";

// const splashImages = [
//   require("../../../assets/splash_screen_images/splash_screen_image_1.png"),
//   require("../../../assets/splash_screen_images/splash_screen_image_2.png"),
//   require("../../../assets/splash_screen_images/splash_screen_image_3.png"),
//   require("../../../assets/splash_screen_images/splash_screen_image_4.png"),
//   require("../../../assets/splash_screen_images/splash_screen_image_5.png"),
//   require("../../../assets/splash_screen_images/splash_screen_image_6.png"),
// ];

// export const Marbella_Custom_Splash = () => {
//   const opacity = useRef(new Animated.Value(1)).current;

//   const [imageIndex, setImageIndex] = useState(0);
//   const overlayOpacity = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     const interval = setInterval(() => {
//       Animated.parallel([
//         Animated.timing(opacity, {
//           toValue: 0.35,
//           duration: 250,
//           useNativeDriver: true,
//         }),
//         Animated.timing(overlayOpacity, {
//           toValue: 1,
//           duration: 250,
//           useNativeDriver: true,
//         }),
//       ]).start(() => {
//         setImageIndex((currentIndex) => {
//           return (currentIndex + 1) % splashImages.length;
//         });

//         Animated.parallel([
//           Animated.timing(opacity, {
//             toValue: 1,
//             duration: 350,
//             useNativeDriver: true,
//           }),
//           Animated.timing(overlayOpacity, {
//             toValue: 0,
//             duration: 350,
//             useNativeDriver: true,
//           }),
//         ]).start();
//       });
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [opacity, overlayOpacity]);

//   return (
//     <Container
//       width="100%"
//       height="100%"
//       color={theme.colors.bg.elements_bg}
//       justify="center"
//       align="center"
//     >
//       <Animated.View
//         style={{
//           width: "100%",
//           height: "100%",
//           opacity,
//           position: "absolute",
//         }}
//       >
//         <Image
//           source={splashImages[imageIndex]}
//           style={{
//             width: "100%",
//             height: "100%",
//           }}
//           contentFit="cover"
//           transition={300}
//         />
//       </Animated.View>

//       <Animated.View
//         pointerEvents="none"
//         style={{
//           position: "absolute",
//           width: "100%",
//           height: "100%",
//           backgroundColor: "rgba(180,180,180,0.18)",
//           opacity: overlayOpacity,
//         }}
//       />

//       <Container
//         width="100%"
//         height="100%"
//         color="rgba(0,0,0,0.10)"
//         justify="center"
//         align="center"
//       >
//         {/* <Text variant="raleway_bold_18" color="#FFFFFF">
//           Marbella Coffee
//         </Text> */}
//       </Container>
//     </Container>
//   );
// };
