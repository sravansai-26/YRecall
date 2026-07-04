export const opacity = {
  disabled: 0.4,
  muted: 0.6,
  overlay: 0.8,
  full: 1,
} as const;

export type Opacity = typeof opacity;
