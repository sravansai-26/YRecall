import { Capture } from '../../../../captures/services/api';

export type PreviewVariant = 'compact' | 'full';

export interface PreviewProps {
  capture: Capture;
  variant: PreviewVariant;
  onPress?: (capture: Capture) => void;
}

export type PreviewRendererComponent = React.ComponentType<PreviewProps>;
