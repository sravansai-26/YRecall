---
name: Midnight Intelligence
colors:
  surface: '#131315'
  surface-dim: '#131315'
  surface-bright: '#39393b'
  surface-container-lowest: '#0e0e10'
  surface-container-low: '#1b1b1d'
  surface-container: '#1f1f21'
  surface-container-high: '#2a2a2b'
  surface-container-highest: '#353436'
  on-surface: '#e4e2e4'
  on-surface-variant: '#c6c6cd'
  inverse-surface: '#e4e2e4'
  inverse-on-surface: '#303032'
  outline: '#909097'
  outline-variant: '#45464d'
  surface-tint: '#bec6e0'
  primary: '#bec6e0'
  on-primary: '#283044'
  primary-container: '#0f172a'
  on-primary-container: '#798098'
  inverse-primary: '#565e74'
  secondary: '#adc6ff'
  on-secondary: '#002e6a'
  secondary-container: '#0566d9'
  on-secondary-container: '#e6ecff'
  tertiary: '#cbc5bf'
  on-tertiary: '#33302c'
  tertiary-container: '#191713'
  on-tertiary-container: '#85807a'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#adc6ff'
  on-secondary-fixed: '#001a42'
  on-secondary-fixed-variant: '#004395'
  tertiary-fixed: '#e8e1db'
  tertiary-fixed-dim: '#cbc5bf'
  on-tertiary-fixed: '#1e1b17'
  on-tertiary-fixed-variant: '#4a4641'
  background: '#131315'
  on-background: '#e4e2e4'
  surface-variant: '#353436'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1200px
  gutter: 24px
  margin-mobile: 20px
  margin-desktop: 64px
  section-gap: 128px
---

## Brand & Style
The design system is engineered for a premium, editorial marketing presence that positions the product at the intersection of advanced technology and human cognition. The visual narrative balances the cold, precise power of AI with the warmth and texture of human memory.

The style is **Premium Editorial with Glassmorphism**. It utilizes expansive negative space, high-contrast typography, and layered translucent surfaces to create a sense of depth and sophistication. The aesthetic should feel like a high-end digital magazine—clean, authoritative, and future-facing. Focus on high-fidelity device mockups integrated into the layout using subtle environmental shadows and light leaks.

## Colors
The palette is dominated by **Deep Midnight**, providing a stable, intellectual foundation. **Electric Blue** serves as the functional driver, used for calls to action, focus states, and highlighting "intelligence" features. **Warm Ivory** provides the essential editorial contrast, used primarily for headline typography and delicate dividers to evoke a sense of paper and permanence.

- **Primary (Deep Midnight):** The canvas. Use for backgrounds and deep containers.
- **Secondary (Electric Blue):** The spark. Use for interactivity and data visualization.
- **Tertiary (Warm Ivory):** The human element. Use for primary text and high-contrast accents.
- **Gradients:** Use subtle Electric Blue-to-transparent radial gradients in backgrounds to simulate screen glow and depth.

## Typography
The typographic scale emphasizes a strong hierarchy. **Playfair Display** provides the editorial authority for headlines, while **Hanken Grotesk** ensures modern, neutral readability for body copy.

- **Headlines:** Use Playfair Display with tighter letter-spacing for a sophisticated, "magazine cover" feel. 
- **Body:** Use Hanken Grotesk for its sharp, contemporary character that bridges the gap between tech and design.
- **Captions & Metadata:** Use JetBrains Mono in all-caps for technical labels, timestamps, or system data to reinforce the "tech-forward" intelligence aspect.
- **Color Application:** Headings should predominantly be Warm Ivory. Body text should be Warm Ivory at 80% opacity for optimal legibility against Deep Midnight.

## Layout & Spacing
The layout follows a **Fluid Grid** model with generous vertical rhythm to emphasize the premium feel. 

- **Desktop/Tablet:** Use a 12-column grid. Key marketing assets (like device mockups) should often break the grid or bleed off-edge to create dynamic energy.
- **Mobile:** Transition to a single-column layout with 20px side margins. Typography scales aggressively to maintain impact.
- **Negative Space:** Avoid clutter. Each section should focus on a single core message or feature, surrounded by at least 128px of vertical padding on desktop to allow the "Deep Midnight" background to breathe.

## Elevation & Depth
This design system utilizes **Glassmorphism** to represent layers of memory and data processing.

- **Surfaces:** Use semi-transparent Deep Midnight fills (70-80% opacity) with a 20px background blur for cards and modals.
- **Borders:** Apply a 1px "inner glow" border (Warm Ivory at 10% opacity) to glass elements to define their edges without adding heavy visual weight.
- **Shadows:** Avoid traditional black shadows. Instead, use soft, expansive glows in Electric Blue (low opacity) behind primary UI elements to suggest light emanating from the screen.
- **Z-Index:** High-fidelity device mockups sit at the highest elevation, often casting a soft environmental shadow onto the glass layers beneath them.

## Shapes
The shape language is **Rounded**, balancing the sharp precision of the serif typography with approachable, modern UI elements.

- **Primary Containers:** 0.5rem (8px) radius for a disciplined, architectural look.
- **Feature Cards:** 1rem (16px) radius to create a softer, more inviting nested feel.
- **Interactive Elements:** Use the 0.5rem radius for buttons to maintain a professional profile. Avoid pill shapes except for small status chips or tags.

## Components
- **Buttons:** Primary buttons use a solid Electric Blue fill with Hanken Grotesk Bold text in Deep Midnight. Secondary buttons use a "Ghost" style with a 1px Warm Ivory border.
- **Glass Cards:** Used for feature highlights. Features a subtle gradient mesh background and internal glassmorphism for nested content.
- **Device Mockups:** High-fidelity 3D renders of hardware. Screens within mockups should showcase the app's clean UI, utilizing the same typography and color rules defined here.
- **Feature Chips:** Small, monospaced labels (JetBrains Mono) with a subtle Electric Blue tint background and 10% opacity.
- **Lists:** Use thin Warm Ivory dividers (5% opacity). Each list item should have ample vertical padding (16px+) to maintain the editorial rhythm.
- **Input Fields:** Dark surfaces with a 1px border that illuminates in Electric Blue upon focus.