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
    googleServicesFile: "./GoogleService-Info.plist",
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
    googleServicesFile: "./google-services.json",
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
    "@react-native-google-signin/google-signin",
    "expo-audio"
  ],
  
  experiments: {
    typedRoutes: true,
  },
  
  extra: {
    apiUrl: process.env.EXPO_PUBLIC_API_URL,
    appEnv: process.env.EXPO_PUBLIC_APP_ENV,
    eas: {
      projectId: "a7181c21-2faf-4311-af67-aa7d0c981afa"
    }
  },
};