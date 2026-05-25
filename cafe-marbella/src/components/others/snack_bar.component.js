import React from "react";
import { Snackbar } from "react-native-paper";
import { Platform } from "react-native";

import { GlobalContext } from "../../infrastructure/services/global/global.context";

export const Snack_Bar_Component = ({
  snackbar,
  bottom_ios,
  bottom_android,
}) => {
  const { hideSnackbar } = React.useContext(GlobalContext);
  return (
    <Snackbar
      visible={snackbar.visible}
      onDismiss={() => {}}
      duration={Number.POSITIVE_INFINITY}
      action={{
        label: snackbar.actionLabel,
        onPress: () => {
          if (snackbar.onAction) {
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
// names - bottom: Platform.OS === "ios" ? 310 : 290,
