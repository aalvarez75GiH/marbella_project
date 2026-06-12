import React from "react";
import { Snackbar } from "react-native-paper";
import { Platform } from "react-native";

import { GlobalContext } from "../../infrastructure/services/global/global.context";

export const Snack_Bar_Component = ({
  snackbar,
  bottom_ios = 40,
  bottom_android = 40,
}) => {
  const { hideSnackbar } = React.useContext(GlobalContext);

  if (!snackbar) return null;

  return (
    <Snackbar
      visible={snackbar.visible}
      onDismiss={hideSnackbar}
      duration={Number.POSITIVE_INFINITY}
      action={{
        label: snackbar.actionLabel || "OK",
        onPress: () => {
          if (typeof snackbar.onAction === "function") {
            snackbar.onAction();
          } else {
            hideSnackbar();
          }
        },
      }}
      wrapperStyle={{
        bottom: Platform.OS === "ios" ? bottom_ios : bottom_android,
        zIndex: 9999,
        elevation: 9999,
      }}
      style={{
        minHeight: 80,
        backgroundColor: snackbar.bgColor,
      }}
    >
      {snackbar.message}
    </Snackbar>
  );
};
