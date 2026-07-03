---
name: YRecall AI OS
colors:
  surface: '#f9f9ff'
  surface-dim: '#cfdaf1'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eeff'
  surface-container-high: '#dee8ff'
  surface-container-highest: '#d8e3fa'
  on-surface: '#111c2c'
  on-surface-variant: '#43474f'
  inverse-surface: '#263142'
  inverse-on-surface: '#ebf1ff'
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
  tertiary: '#201e1a'
  on-tertiary: '#ffffff'
  tertiary-container: '#36332f'
  on-tertiary-container: '#a09b95'
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
  tertiary-fixed: '#e8e1db'
  tertiary-fixed-dim: '#cbc5bf'
  on-tertiary-fixed: '#1e1b17'
  on-tertiary-fixed-variant: '#4a4641'
  background: '#f9f9ff'
  on-background: '#111c2c'
  surface-variant: '#d8e3fa'
typography:
  display-lg:
    fontFamily: Public Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Public Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-md:
    fontFamily: Public Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Public Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Public Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Public Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Public Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-caps:
    fontFamily: Public Sans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
  mono-data:
    fontFamily: Courier Prime
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  container-margin: 24px
  gutter: 16px
  node-padding: 12px
  sidebar-width: 280px
---

## Brand & Style
The design system for YRecall AI OS is engineered for high-density collaboration and cognitive synthesis. The brand personality is **scholarly, precise, and dependable**, functioning as a calm "digital sanctuary" for complex knowledge work. 

The aesthetic is a hybrid of **Modern Corporate** reliability and **Minimalist** clarity. It prioritizes information density without sacrificing legibility. The UI should evoke a sense of organized intelligence—like a high-end architectural blueprint or a modern library archive. Visual noise is aggressively minimized to ensure that user-generated knowledge graphs and AI-driven insights remain the focal point.

## Colors
The palette is anchored by **Warm White (#fff8f1)**, which serves as the primary canvas color to reduce eye strain during long research sessions. **Deep Blue (#003366)** provides the authoritative structural framework and primary interactions.

**Teal (#008080)** is reserved exclusively for "Intelligence Signifiers"—indicating AI-generated nodes, active suggestions, or synthesized data points. 

For multi-user collaboration, a distinct high-contrast **Presence Palette** is used for cursors and live activity indicators, ensuring individual contributors are distinguishable against the neutral background.

## Typography
This design system utilizes **Public Sans** for all primary interfaces to leverage its exceptional legibility and institutional neutrality. 

- **Data Density:** Use `body-sm` for secondary metadata and `mono-data` for technical attributes within knowledge graphs.
- **Hierarchy:** `label-caps` is used for category headers and UI navigation labels to distinguish them from user-generated content.
- **Collaboration:** Usernames in presence indicators should use `body-sm` with a medium weight to remain legible at small scales.

## Layout & Spacing
The layout follows a **Hybrid Fluid Grid**. While global navigation and sidebars are fixed, the central "Knowledge Canvas" is fluid, allowing for expansive graph visualizations.

- **4px Base Unit:** All spacing must be a multiple of 4px to maintain tight alignment in data-heavy views.
- **High-Density Reflow:** On smaller screens, the sidebars collapse into icons, and the knowledge graph switches to a "List View" or "Condensed Node" mode.
- **Collaboration Zones:** Cursors and presence avatars exist on a separate "Interaction Layer" above the grid, maintaining 8px of clearance from active text carets.

## Elevation & Depth
Depth is communicated through **Tonal Layering** and **Low-Contrast Outlines** rather than heavy shadows, preserving the "clean paper" feel.

1.  **Canvas (Base):** Warm White (#fff8f1).
2.  **Panels/Cards:** White (#ffffff) with a 1px border of Deep Blue at 10% opacity.
3.  **Active/Hover State:** Subtle 4px blur shadow with 5% opacity and a Teal-tinted border.
4.  **Floating Elements (Modals/Cursors):** 8px soft shadow with 12% opacity to indicate the highest level of the Z-index.

## Shapes
The shape language is **Soft (0.25rem base)**. This provides a professional, "architectural" feel that is more approachable than sharp corners but more serious than fully rounded UI. 

- **Nodes:** Knowledge graph nodes use `rounded-lg` (0.5rem) to distinguish them from standard UI containers.
- **Presence Avatars:** Circular (100% radius) to clearly denote "human" elements within the geometric system.
- **Buttons:** Small radius (0.25rem) to maintain a precise, tool-like appearance.

## Components

### Collaborative Presence
- **Cursors:** 1px vertical line in the user's assigned presence color, topped with a small flag containing their name.
- **Live Activity Rings:** Avatars in the header glow with a 2px Teal ring when the user is actively interacting with an AI-generated insight.
- **Shared Node States:** When a node is being edited, it gains a "halo" border in the editor's presence color.

### Data & Intelligence
- **Intelligence Chips:** Small, Teal-filled pills with white text for AI categories.
- **Knowledge Nodes:** White containers with `body-md` text; nodes with high "centrality" in the graph increase in border weight (from 1px to 2px).
- **Input Fields:** Minimalist design with a 1px bottom border that turns Deep Blue on focus; AI-assisted fields have a subtle Teal glow on the left edge.

### Interaction
- **Primary Buttons:** Deep Blue background, White text. No gradients.
- **Secondary Buttons:** Transparent background, Deep Blue outline (1px).
- **Ghost Buttons:** Deep Blue text, no border; used for low-priority actions in dense lists.