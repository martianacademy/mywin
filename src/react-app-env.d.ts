/// <reference types="react-scripts" />

import { ExternalProvider } from "@ethersproject/providers";

declare global {
  interface Window {
    ethereum?: ExternalProvider;
  }
}

declare module '@metamask/logo' {
  interface ModelViewerOptions {
    pxNotRatio?: boolean;
    width?: number;
    height?: number;
    followMouse?: boolean;
    slowDrift?: boolean;
  }

  interface ModelViewer {
    container: HTMLElement;
    lookAt: (position: { x: number; y: number }) => void;
    setFollowMouse: (enabled: boolean) => void;
    stopAnimation: () => void;
  }

  export function ModelViewer(options: ModelViewerOptions): ModelViewer;
}
