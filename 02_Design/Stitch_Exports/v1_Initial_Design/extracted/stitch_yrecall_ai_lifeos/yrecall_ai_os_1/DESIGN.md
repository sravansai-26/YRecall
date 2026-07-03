---
name: YRecall AI OS
colors:
  surface: '#fff8f1'
  surface-dim: '#e0d9d1'
  surface-bright: '#fff8f1'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#faf3eb'
  surface-container: '#f4ede5'
  surface-container-high: '#eee7df'
  surface-container-highest: '#e8e1da'
  on-surface: '#1e1b17'
  on-surface-variant: '#43474f'
  inverse-surface: '#33302b'
  inverse-on-surface: '#f7f0e8'
  outline: '#737780'
  outline-variant: '#c3c6d1'
  surface-tint: '#3a5f94'
  primary: '#001e40'
  on-primary: '#ffffff'
  primary-container: '#003366'
  on-primary-container: '#799dd6'
  inverse-primary: '#a7c8ff'
  secondary: '#006a6a'
  on-secondary: '#ffffff'
  secondary-container: '#90efef'
  on-secondary-container: '#006e6e'
  tertiary: '#002504'
  on-tertiary: '#ffffff'
  tertiary-container: '#003d0b'
  on-tertiary-container: '#5ead5c'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d5e3ff'
  primary-fixed-dim: '#a7c8ff'
  on-primary-fixed: '#001b3c'
  on-primary-fixed-variant: '#1f477b'
  secondary-fixed: '#93f2f2'
  secondary-fixed-dim: '#76d6d5'
  on-secondary-fixed: '#002020'
  on-secondary-fixed-variant: '#004f4f'
  tertiary-fixed: '#a3f69c'
  tertiary-fixed-dim: '#88d982'
  on-tertiary-fixed: '#002204'
  on-tertiary-fixed-variant: '#005312'
  background: '#fff8f1'
  on-background: '#1e1b17'
  surface-variant: '#e8e1da'
typography:
  display-lg:
    fontFamily: Public Sans
    fontSize: 44px
    fontWeight: '700'
    lineHeight: 52px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Public Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Public Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  title-sm:
    fontFamily: Public Sans
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
  body-md:
    fontFamily: Public Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  caption-sm:
    fontFamily: Public Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-xs:
    fontFamily: Public Sans
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  gutter: 16px
  margin-mobile: 20px
  margin-desktop: 40px
---

## Brand & Style

The design system is anchored in the concept of an "AI Life Operating System"—a digital environment that feels human, calm, and intellectually capable. The aesthetic blends the systematic rigor of modern enterprise design with the warmth of high-end editorial layouts.

The design style is **Minimalist-Tactile**. It utilizes heavy whitespace to reduce cognitive load, prioritizing clarity and focus. By mixing the structural clarity of Material 3 with the refined finish of Apple’s Human Interface Guidelines, the system achieves a "timeless" quality. The UI should feel like a premium physical object: deliberate, high-quality, and responsive to the touch.

Key visual principles:
- **Spaciousness:** Generous margins to allow content to breathe.
- **Intentional Contrast:** Using subtle shifts in neutral tones rather than harsh lines.
- **Intelligence:** AI-driven components use unique depth and motion to signal "active" processing without being distracting.

## Colors

The color strategy relies on a "Warm White" foundation to avoid the sterile feel of pure digital white. The primary Deep Blue provides a sense of authority and trust, while the Teal accent is used sparingly to highlight AI-interacted elements or secondary actions.

**Color Usage Guidelines:**
- **Background:** Use the Warm White (`#FCFAF7`) for the lowest layer of the application.
- **Surface:** Use Soft Gray (`#F3F0EC`) for cards, containers, and inset fields.
- **Typography:** Text should follow a monochromatic scale derived from the primary navy, transitioning from nearly black for headlines to a soft slate for captions.
- **Functional Colors:** Success, Warning, and Error colors are desaturated to maintain the "Calm" brand personality while ensuring accessibility.

## Typography

This design system uses **Public Sans** to achieve a clean, institutional yet approachable feel. The typography follows a clear hierarchy to guide the user through complex AI-generated data.

- **Display & Headlines:** Use tight letter spacing and bold weights to anchor pages.
- **Body Text:** Standardized at 16px for optimal legibility across all age groups.
- **Labels:** Set in uppercase with increased letter spacing to differentiate metadata from interactive content.
- **Scaling:** On mobile devices, Display styles scale down to avoid awkward line breaks while maintaining visual impact.

## Layout & Spacing

The layout is built on a **Fluid 8px Grid System**. The philosophy centers on "Generous Whitespace," ensuring that no two interactive elements feel crowded.

**Breakpoints:**
- **Mobile (up to 599px):** 4-column grid, 20px side margins, 16px gutters.
- **Tablet (600px - 1023px):** 8-column grid, 32px side margins, 16px gutters.
- **Desktop (1024px+):** 12-column grid, maximum content width of 1440px, 40px side margins.

Use `lg` (24px) or `xl` (32px) spacing for vertical section separation to maintain the "Calm" aesthetic. Use `sm` (8px) for internal component spacing (e.g., icon to text).

## Elevation & Depth

This design system uses **Tonal Layering** combined with **Ambient Shadows**. Instead of heavy dropshadows, depth is expressed through surface color shifts and extremely diffused, low-opacity shadows.

- **Level 0 (Background):** `#FCFAF7`.
- **Level 1 (Cards/Floating Elements):** White background with a 10% opacity shadow, 20px blur, and 4px vertical offset.
- **Level 2 (Active/Hover States):** Deepened shadow (15% opacity) to simulate physical lifting.
- **AI Tiers:** AI-specific components use a subtle 1px inner stroke in the Accent Teal color to signify "Intelligence" layers without breaking the minimalist aesthetic.

## Shapes

The shape language is "Friendly-Geometric." 

- **Components:** Standard buttons and inputs use a `0.5rem` (8px) radius for a professional look.
- **Containers:** Content cards and major UI blocks use a `rounded-xl` (24px) radius to create a soft, inviting container for life data.
- **Selection:** Active states in navigation or chips use a pill-shape (fully rounded) to provide high contrast against the squared-off grid.

## Components

### Buttons
- **Primary:** Deep Blue background, white text. Large height (56px) for main mobile actions. 16px corner radius.
- **Secondary:** Soft Gray background, Deep Blue text. 
- **Elevation:** Level 1 shadow on hover/active.

### Cards
- **Standard:** White background, 24px corner radius, Level 1 shadow. 24px internal padding.
- **AI-Enhanced:** Same as standard, but with a 1px border using a gradient of Teal to Soft Gray. Suggests a "smart" container.

### Inputs
- **Text Fields:** 56px height, 8px corner radius. Minimal 1px border in `#D1CDC7`. On focus, the border thickens to 2px in Primary Deep Blue.
- **Selection:** Checkboxes and Radios use the Primary color for checked states with a smooth scale-in animation.

### Navigation
- **Bottom Bar:** 80px height, Warm White background with a subtle top border. Icons are 24px, "Material Symbols Rounded" style. Active state uses a pill-shaped tonal background behind the icon.

### Feedback & Lists
- **Lists:** No dividers between items; use 8px spacing and subtle background hover states to define rows.
- **Chips:** 32px height, pill-shaped, Teal background at 10% opacity for categorized AI tags.