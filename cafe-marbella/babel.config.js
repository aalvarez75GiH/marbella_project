module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // Only include this if you use Reanimated
      // "react-native-reanimated/plugin",
    ],
  };
};
