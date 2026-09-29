# YRecall Mobile Release Workflow

This document outlines the standard release and deployment strategy for the YRecall mobile application.

The core principle of our release architecture is:
> **GitHub Release = Installable Native Application (APK / IPA)**
> **EAS Update = Over-The-Air (OTA) frontend update for an existing native application**

## 1. Understanding OTA vs. Native Changes

### OTA-Safe Changes (Frontend)
These changes **DO NOT** require a new native application build. They can be delivered instantly to users' devices.
*   UI/UX modifications (styling, colors, layouts)
*   React Native JavaScript/TypeScript logic
*   Asset changes (images, fonts, text, translations)
*   Any change that does not interact with the underlying Android/iOS native runtime.

### Native Changes (Backend/Runtime)
These changes **REQUIRE** a new native application build and a new GitHub Release.
*   Adding new native dependencies (e.g., a new Expo module or SDK requiring native code).
*   Upgrading the React Native or Expo SDK version.
*   Changes to `app.json` configuration related to native properties (e.g., permissions, intent filters, splash screens, Android/iOS configurations).
*   Modifications to custom native modules.

---

## 2. Release Conventions

### Publishing an OTA-Safe Change
1.  Make your changes in the source code.
2.  Test thoroughly.
3.  Deploy the update to the corresponding channel (e.g., `preview` or `production`):
    ```bash
    eas update --channel preview --message "feat: description of changes"
    ```
4.  **Result:** The existing installed APK will download the update seamlessly on its next launch.
5.  **GitHub Action:** Commit and push the code. *No new GitHub Release is required.*

### Publishing a Backend-Only Change
1.  Make your changes in the backend source code.
2.  Test thoroughly.
3.  Deploy the update to Render.
4.  **Result:** No new APK or GitHub Release is required, provided that API compatibility with the mobile app is maintained.

### Publishing a Native Change
1.  Make your native changes.
2.  Increment the application version and `versionCode` in `app.json` as appropriate (e.g., `1.0.0` -> `1.1.0` and `versionCode: 1` -> `2`).
3.  Build a new native application:
    ```bash
    eas build --platform android --profile preview
    ```
4.  Test the new APK.
5.  Create a new **GitHub Release**:
    *   Tag: `vX.X.X` (matching `app.json`)
    *   Title: `YRecall vX.X.X`
    *   **Attach the `.apk` file** downloaded from the EAS Dashboard to the release.
    *   Provide clear installation instructions and explicitly state the `runtimeVersion` this APK supports.

---

## 3. Versioning Rules

*   **App Version (`version`):** Semantic versioning (`Major.Minor.Patch`). Increment for native changes.
*   **Android `versionCode`:** An integer that strictly increases with every new native build.
*   **Runtime Version (`runtimeVersion`):** Currently set to `"policy": "appVersion"`. This means OTA updates are tied to the specific `version` string in `app.json`. An OTA update published for `1.0.0` will *only* apply to devices running the `1.0.0` native APK. 
*   **Channels:**
    *   `preview`: Used for internal testing and staging.
    *   `production`: Used for stable public releases.

---

## 4. Rollback Considerations

*   If a bad OTA update is deployed via `eas update`, you can roll it back by publishing a new update containing the reverted code, or by using the EAS Dashboard to republish a previous successful update.
*   If a bad native APK is released, you must build a new native APK with incremented versioning and release it as a new GitHub Release.

## 5. Relationship Between GitHub Releases and EAS Updates

One single GitHub Release (e.g., `v1.0.0 APK`) acts as the foundation. It can receive dozens of EAS OTA updates over its lifetime without the user ever needing to download a new `.apk` file from GitHub. Only direct the user to download a new APK from GitHub when a fundamental native capability changes.
