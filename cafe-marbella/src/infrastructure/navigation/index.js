import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";

import { AuthenticationContext } from "../services/authentication/authentication.context";
import { AppNavigator } from "./app.navigator";

export const Navigation = () => {
  const { user } = useContext(AuthenticationContext);
  // console.log("USER AT NAVIGATION: ", JSON.stringify(user, null, 2));

  return (
    <NavigationContainer>
      {user.authenticated === true ? <AppNavigator /> : null}
    </NavigationContainer>
  );
};
