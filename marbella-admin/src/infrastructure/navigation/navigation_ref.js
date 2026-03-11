import { createNavigationContainerRef } from "@react-navigation/native";

export const navigationRef = createNavigationContainerRef();

export const rootNavigate = (name, params) => {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
};

export const rootReset = (state) => {
  if (navigationRef.isReady()) {
    navigationRef.reset(state);
  }
};
