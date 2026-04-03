export {};

interface DataLayerEvent {
  event: string;
  [key: string]: unknown;
}

declare global {
  interface Window {
    dataLayer: DataLayerEvent[];
  }
}
