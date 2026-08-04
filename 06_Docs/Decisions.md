# Architectural Decisions

This document tracks significant architectural decisions made during the development of YRecall.

## August 2026

### 1. Android Headless Widget Image Rendering Strategy
**Context:** Rendering images inside Android Home Screen widgets using 
eact-native-android-widget caused silent crashes when attempting to use remote HTTP URLs (https://...) or Base64 data URIs. Because Android widgets render out-of-process via RemoteViews, network image fetching is highly unreliable without native caching mechanisms.
**Decision:** We mandate the use of bundled local assets via 
equire() inside the widget components. This guarantees synchronous resolution by the Metro bundler and successfully passes the primitive bitmap across the IPC bridge to the Android home screen without relying on headless network requests.

### 2. Headless Task Interceptors & Error Logging
**Context:** The widgetTaskHandler runs completely headlessly. Errors (like missing imports or API failures) fail silently.
**Decision:** 
- The entire widgetTaskHandler is wrapped in a top-level 	ry/catch block that explicitly writes raw stack traces to a persistent file using expo-file-system.
- Axios interceptors (setupApiInterceptors()) must be manually invoked inside the headless task entry point to guarantee that authentication tokens are retrieved from AsyncStorage.

### 3. Widget Layout Optimization
**Context:** Relying on lex: 1 properties inside widget FlexBox structures caused right-aligned elements to drift from the absolute right edge.
**Decision:** Avoid lex: 1 for absolute edge alignment in widget primitives. Instead, enforce explicit container bounds (width: 'match_parent') and use justifyContent: 'space-between' on the outer row to strictly pin elements to the edges. Required imageWidth and imageHeight props must also be explicitly set for all <ImageWidget> definitions.
