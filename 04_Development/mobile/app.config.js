// app.config.js (plain JS, no TypeScript syntax)
module.exports = {
  name: "YRecall",
  slug: "yrecall",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  userInterfaceStyle: "automatic",
  scheme: "yrecall",
  
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.lyfspot.yrecall",
  },
  
  android: {
    adaptiveIcon: {
      backgroundColor: "#E6F4FE",
      foregroundImage: "./assets/images/android-icon-foreground.png",
      backgroundImage: "./assets/images/android-icon-background.png",
      monochromeImage: "./assets/images/android-icon-monochrome.png",
    },
    package: "com.lyfspot.yrecall",
    predictiveBackGestureEnabled: true,
  },
  
  web: {
    favicon: "./assets/images/favicon.png",
    bundler: "metro",
  },
  
  plugins: [
    "expo-router",
    "expo-secure-store",
    "expo-localization",
    "expo-font",
  ],
  
  experiments: {
    typedRoutes: true,
  },
  
  extra: {
    apiUrl: process.env.EXPO_PUBLIC_API_URL,
    appEnv: process.env.EXPO_PUBLIC_APP_ENV,
  },
};