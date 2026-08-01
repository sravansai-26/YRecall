module.exports = {
  name: "YRecall",
  slug: "yrecall",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  userInterfaceStyle: "automatic",
  scheme: "yrecall",
  newArchEnabled: true,
  
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
    softwareKeyboardLayoutMode: "pan", 
    // Force native properties injection directly through the android platform scope
    gradleProperties: {
      "android.useAndroidX": "true",
      "android.enableJetifier": "true"
    }
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
    "expo-audio",
    [
      "expo-local-authentication",
      {
        "faceIDPermission": "Allow YRecall to use Face ID to authenticate you."
      }
    ],
    [
      "expo-camera",
      {
        "cameraPermission": "Allow YRecall to access your camera to scan barcodes and capture photos."
      }
    ],
    [
      "expo-build-properties",
      {
        "android": {
          "extraGradleProperties": [
            { "name": "android.useAndroidX", "value": "true" },
            { "name": "android.enableJetifier", "value": "true" }
          ]
        }
      }
    ],
    [
      "react-native-android-widget",
      {
        "widgets": [
          {
            "name": "QuickCaptureWidget",
            "label": "YRecall Quick Capture",
            "minWidth": "300dp",
            "minHeight": "140dp",
            "description": "Capture memories instantly",
            "previewImage": "./assets/images/icon.png"
          },
          {
            "name": "DailyBriefWidget",
            "label": "YRecall Daily Brief",
            "minWidth": "300dp",
            "minHeight": "200dp",
            "description": "Your morning AI summary",
            "previewImage": "./assets/images/icon.png"
          },
          {
            "name": "SearchWidget",
            "label": "YRecall Search",
            "minWidth": "300dp",
            "minHeight": "60dp",
            "description": "Search your memory graph",
            "previewImage": "./assets/images/icon.png"
          },
          {
            "name": "TimelineWidget",
            "label": "YRecall Timeline",
            "minWidth": "300dp",
            "minHeight": "300dp",
            "description": "Latest memories & AI insights",
            "previewImage": "./assets/images/icon.png"
          }
        ]
      }
    ]
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