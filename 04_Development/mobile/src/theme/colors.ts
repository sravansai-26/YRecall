export const colors = {
  transparent: 'transparent',
  white: '#FFFFFF',
  black: '#000000',
  background: {
    primary: '#FFFFFF',
    secondary: '#F5F5F7',
    inverse: '#0A0A0B',
  },
  text: {
    primary: '#0A0A0B',
    secondary: '#6B7280',
    inverse: '#FFFFFF',
    disabled: '#9CA3AF',
  },
  border: {
    default: '#E5E7EB',
    focus: '#3B82F6',
  },
  brand: {
    primary: '#2563EB',
    secondary: '#7C3AED',
  },
  status: {
    success: '#16A34A',
    warning: '#D97706',
    error: '#DC2626',
    info: '#0284C7',
  },
} as const;

export type Colors = typeof colors;
