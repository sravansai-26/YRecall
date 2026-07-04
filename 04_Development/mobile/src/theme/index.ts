import { colors, type Colors } from './colors';
import { elevation, type Elevation } from './elevation';
import { motion, type Motion } from './motion';
import { opacity, type Opacity } from './opacity';
import { radius, type Radius } from './radius';
import { shadows, type Shadows } from './shadows';
import { spacing, type Spacing } from './spacing';
import { typography, type Typography } from './typography';

export const theme = {
  colors,
  spacing,
  typography,
  radius,
  elevation,
  opacity,
  motion,
  shadows,
} as const;

export type Theme = {
  colors: Colors;
  spacing: Spacing;
  typography: Typography;
  radius: Radius;
  elevation: Elevation;
  opacity: Opacity;
  motion: Motion;
  shadows: Shadows;
};

export { colors, elevation, motion, opacity, radius, shadows, spacing, typography };

export type { Colors, Elevation, Motion, Opacity, Radius, Shadows, Spacing, Typography };
