# Changelog

## [Unreleased] - August 2026

### Added
- Implemented robust widgetTaskHandler for Android widgets with global try/catch persistent error logging to expo-file-system.
- Injected explicitly bounded ImageWidget utilizing bundled assets (require()) to display the official YRecall branding across all widgets.
- Deployed SUN_SVG, CLOCK_SVG, MIC_SVG, TEXT_SVG, and CAMERA_SVG primitives directly into the widget rendering tree.
- Established setupApiInterceptors() injection for secure API resolution in headless environments.

### Fixed
- Fixed critical headless crash caused by missing apiClient import during Timeline widget data fetching.
- Resolved Android RemoteViews rendering failures by eliminating remote https:// image URLs in favor of synchronously bundled images.
- Eliminated invalid React Native style props (space_between, space_around, flex: 1 on Text) that prevented Metro from bundling the headless task payload.
- Fixed widget right-margin gaps by migrating from relative flex sizing to absolute match_parent bounded layouts using space-between.
- Fixed Email templates to ensure the YRecall logo is visible against colored headers by wrapping it in a rounded background circle.

### Changed
- Reorganized 05_Testing/java_crash_logs to safely archive Java HotSpot out-of-memory crash dumps away from the project root.
- Standardized Android Widget architecture to prohibit dynamic network image loading.
