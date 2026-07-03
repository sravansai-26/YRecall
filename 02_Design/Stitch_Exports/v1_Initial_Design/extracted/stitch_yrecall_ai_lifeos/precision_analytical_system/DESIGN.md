---
name: Precision Analytical System
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#45464d'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#0051d5'
  on-secondary: '#ffffff'
  secondary-container: '#316bf3'
  on-secondary-container: '#fefcff'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#0b1c30'
  on-tertiary-container: '#75859d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#dbe1ff'
  secondary-fixed-dim: '#b4c5ff'
  on-secondary-fixed: '#00174b'
  on-secondary-fixed-variant: '#003ea8'
  tertiary-fixed: '#d3e4fe'
  tertiary-fixed-dim: '#b7c8e1'
  on-tertiary-fixed: '#0b1c30'
  on-tertiary-fixed-variant: '#38485d'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display-lg:
    fontFamily: Public Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Public Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Public Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-md:
    fontFamily: Public Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Public Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Public Sans
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
  data-mono:
    fontFamily: Public Sans
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: -0.01em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 32px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

This design system is engineered for high-stakes decision-making environments where clarity and data integrity are paramount. The brand personality is authoritative yet transparent, positioning itself as a sophisticated co-pilot that surfaces insights without obscuring raw data. 

The aesthetic follows a **Data-Driven Editorial** approach—a hybrid of **Minimalism** and **Modern Corporate** styles. It prioritizes high information density, structural rigor, and clear visual hierarchies. The interface feels like a premium digital publication: intentional whitespace, structured grids, and a focus on legibility. This style builds trust through precision, ensuring that AI-generated insights are presented with calibrated confidence rather than opaque certainty.

## Colors

The palette is anchored in deep slates and professional blues to evoke stability. 

- **Primary & Neutral:** Uses a high-contrast ratio (minimum 7:1 for text) to ensure peak legibility. The primary slate (#0F172A) acts as the foundation for all typography and structural elements.
- **Confidence Scoring:** A semantic trio (Emerald, Amber, Rose) is used exclusively for scoring. These are tuned to maintain AA accessibility standards against white and light-gray backgrounds.
- **AI States:** A dedicated "Intelligence Violet" (#8B5CF6) is reserved for AI-specific behaviors, such as generative states and thinking indicators, clearly separating machine logic from human input.
- **Proactive Notifications:** These utilize a high-contrast inverted scheme (Dark Slate background with White text) to ensure they are visually distinct and demand attention without being disruptive.

## Typography

The design system exclusively utilizes **Public Sans**, a typeface designed for government and institutional clarity. The typographic scale is optimized for reading long-form data and complex dashboards.

- **Editorial Hierarchy:** Large display styles use tight tracking and heavy weights to create an authoritative, headline-driven feel.
- **Data Representation:** Use `label-caps` for metadata and section headers to provide a clear visual break from body copy.
- **Micro-copy:** `body-sm` is the workhorse for confidence explanations and tooltips, maintaining legibility even at reduced sizes.

## Layout & Spacing

The layout employs a **12-column fixed grid** for desktop to maintain an editorial structure, transitioning to a fluid single-column for mobile.

- **Rhythm:** A 4px baseline grid ensures vertical consistency. All spacing between components must be a multiple of 4px.
- **Density:** High-density layouts are preferred for data views, using `stack-sm` for related items. Editorial views use `stack-lg` to allow the content to breathe.
- **Breakpoints:** 
  - Mobile: < 600px (4 columns, 16px margins)
  - Tablet: 601px - 1024px (8 columns, 24px margins)
  - Desktop: > 1025px (12 columns, 32px margins)

## Elevation & Depth

To maintain the "Editorial" feel, this design system avoids heavy shadows, opting instead for **Tonal Layers** and **Low-contrast Outlines**.

- **Surface Tiers:** Use subtle background shifts (#FFFFFF to #F8FAFC) to differentiate the global navigation from the content canvas.
- **Borders:** Use 1px solid borders in #E2E8F0 for cards and containers. This provides structure without adding visual "weight."
- **AI Focus:** When the AI is in a "thinking" or "active" state, the specific container may use a soft "Intelligence Violet" glow (blur: 20px, opacity: 10%) to draw the eye without breaking the flat aesthetic.
- **Notifications:** Proactive alerts sit at the highest elevation, using a crisp 4px shadow offset to appear physically "above" the data layer.

## Shapes

The design system utilizes **Soft** geometry. Sharp corners are avoided to prevent the UI from appearing too "brutal," but curves are kept minimal (4px) to retain a professional, architectural feel. 

- **Primary Elements:** Buttons and Input fields use a 4px radius.
- **Containers:** Large cards or sections use an 8px (rounded-lg) radius to create a nesting hierarchy.
- **Status Indicators:** Confidence score chips and AI tags use a 12px (rounded-xl) radius to differentiate them as metadata elements.

## Components

### Buttons & Inputs
- **Primary Action:** Solid Slate (#0F172A) with White text.
- **Secondary Action:** Transparent background with 1px border.
- **Inputs:** Clean, 1px bordered boxes. On focus, the border thickens to 2px in Primary Blue.

### AI Thinking States
- **Skeleton Loaders:** Use a rhythmic pulse rather than a spin.
- **Progressive Disclosure:** Text-based "thinking" logs should appear in a monospaced-style Public Sans variant to signal raw machine processing.
- **Indicator:** A small, 8px Violet dot that pulses gently (1.5s duration) next to the "AI Generating" label.

### Confidence Scores
- **Visual:** A small horizontal bar or pill. 
- **High (90%+):** Emerald (#059669).
- **Medium (70-89%):** Amber (#D97706).
- **Low (<70%):** Rose (#DC2626).
- **Context:** Always pair the color with a numerical percentage to ensure accessibility for color-blind users.

### Proactive Notifications
- **High-Contrast Design:** Dark Slate background with White typography.
- **Placement:** Top-right toast or inline banner with a Primary Blue left-accent bar to signal "proactive" status.
- **Contrast Compliance:** Ensure all notification icons maintain a 4.5:1 ratio against the dark background.

### Cards
- **Editorial Card:** Large padding (32px), 1px border, and a clear hierarchy between the "Data Label" and "Value."