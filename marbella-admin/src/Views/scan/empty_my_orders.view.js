import SadCoffeeMaker from "../../../assets/doodles/sad_coffee_maker_transparent.png";
import { Text } from "../../infrastructure/typography/text.component";

import { AuthenticationContext } from "../../infrastructure/services/authentication/authentication.context";

export default function Empty_My_Orders_View() {
  const theme = useTheme();

  const { user } = useContext(AuthenticationContext);
  const { user_id } = user || {};
  console.log("USER ID IN EMPTY ORDERS VIEW:", user_id);
  return (
    <Container
      width="100%"
      height="100%"
      color={theme.colors.bg.elements_bg}
      //color={"green"}
      justify="flex-start"
      align="center"
    >
      <Container
        width="100%"
        height="100%"
        color={theme.colors.bg.elements_bg}
        //   color={"red"}
        justify="center"
        align="center"
      >
        <Image source={SadCoffeeMaker} style={{ width: 350, height: 350 }} />
        <Spacer position="top" size="large" />
        {user_id === undefined && (
          <>
            <Text variant="raleway_bold_20">You are not logged in!</Text>
            <Text variant="raleway_medium_16">
              Go to menu and Sign in or Sign up
            </Text>
            <Text variant="raleway_medium_16">
              then go ahead and place orders!!
            </Text>
          </>
        )}
        {user_id !== undefined && (
          <>
            <Text variant="raleway_bold_20">Start an order, Come on!!</Text>
            <Text variant="raleway_medium_16">
              as you make a purchase order at Shop section
            </Text>
            <Text variant="raleway_medium_16">it'll be shown up here</Text>
          </>
        )}
      </Container>
    </Container>
  );
}
