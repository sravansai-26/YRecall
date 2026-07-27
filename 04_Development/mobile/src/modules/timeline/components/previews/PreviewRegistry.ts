import { PreviewRendererComponent } from './types';
import { URLPreview } from './URLPreview';
import { DocumentPreview } from './DocumentPreview';
import { LocationPreview } from './LocationPreview';
import { MediaPreview } from './MediaPreview';
import { TextPreview } from './TextPreview';
import { DefaultPreview } from './DefaultPreview';

const registry: Record<string, PreviewRendererComponent> = {
  url: URLPreview,
  document: DocumentPreview,
  pdf: DocumentPreview,
  file: DocumentPreview,
  location: LocationPreview,
  image: MediaPreview,
  video: MediaPreview,
  audio: MediaPreview,
  voice: MediaPreview,
  note: TextPreview,
  text: TextPreview,
  automation: TextPreview,
};

export const getPreviewRenderer = (type: string): PreviewRendererComponent => {
  return registry[type] || DefaultPreview;
};

export const registerPreviewRenderer = (type: string, component: PreviewRendererComponent) => {
  registry[type] = component;
};
