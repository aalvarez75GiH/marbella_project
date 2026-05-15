// navigation.helpers.js

export const safeGoBack = (navigation, fallbackScreen, params = {}) => {
  if (navigation.canGoBack()) {
    navigation.goBack();
  } else {
    navigation.navigate(fallbackScreen, params);
  }
};
