import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login_View from "../../Views/authentication views/login_user.view";
import Register_View from "../../Views/authentication views/register_user.view";
import Enter_Names_View from "../../Views/authentication views/enter_names.view";
import Enter_Email_View from "../../Views/authentication views/enter_email.view";
import Enter_Address_View from "../../Views/authentication views/enter_address.view";
import Enter_Phone_Number_View from "../../Views/authentication views/enter_phone_number.view";
import User_To_Create_Info_Review_View from "../../Views/authentication views/user_to_create_info_review.view";

const AuthStack = createNativeStackNavigator();

export const Auth_Navigator = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <AuthStack.Screen name="Login_View" component={Login_View} />
      <AuthStack.Screen name="Register_View" component={Register_View} />
      <AuthStack.Screen name="Enter_Names_View" component={Enter_Names_View} />
      <AuthStack.Screen name="Enter_Email_View" component={Enter_Email_View} />
      <AuthStack.Screen
        name="Enter_Address_View"
        component={Enter_Address_View}
      />
      <AuthStack.Screen
        name="Enter_Phone_Number_View"
        component={Enter_Phone_Number_View}
      />
      <AuthStack.Screen
        name="User_To_Create_Info_Review_View"
        component={User_To_Create_Info_Review_View}
      />
    </AuthStack.Navigator>
  );
};
