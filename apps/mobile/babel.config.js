module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // Note: react-native-reanimated/plugin removed for web compatibility
    // Add it back when building native apps
  };
};
