// This file is responsible for handling viewport logic for 3D scenes in 2D space.
// A viewport is simply an HTML element that provides a way for our user to view their scene.
//  but the scene ultimately decides what you see in the viewport.
// The viewport is a window frame, the world outside the window is the scene.
// In headless mode a viewport still exists, you just can't see it.
import * as log from 'ts-app-logger';
log.debug('viewport loaded');

import * as constants from './constants';
import { RendererConfig } from './a.renderer';

// See: https://stackoverflow.com/questions/10214873/make-canvas-as-wide-and-as-high-as-parent
export const fitCanvasToContainer = (canvas: HTMLCanvasElement) => {
  // Make it visually fill the positioned parent.
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  // Set the internal size to match.
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}

// TODO this works for resize? or keep viewport as state and update in onResize?
export const getDimensions = (config: RendererConfig): Dimensions => {
  return getElementDimensions(config.sceneElement!);
}

export const getElementDimensions = (element: ViewportElementType): Dimensions => {
  const width = parseFloat(getComputedStyle(element).getPropertyValue('width'));
  const height = parseFloat(getComputedStyle(element).getPropertyValue('height'));
  
  return { width, height };
}

type ViewportElementType = HTMLVideoElement | HTMLCanvasElement | HTMLElement;

export interface Dimensions { 
  width: number; 
  height: number; 
}

export const getPixels = (webGLRenderingContext: WebGLRenderingContext | WebGL2RenderingContext, activeViewportDimensions?: Dimensions): Uint8Array => {
  if (!activeViewportDimensions) { activeViewportDimensions = defaultViewportDimensions };

  const pixels = new Uint8Array(4 * activeViewportDimensions.width * activeViewportDimensions.height);

  webGLRenderingContext.readPixels(0, 0, activeViewportDimensions.width, activeViewportDimensions.height, webGLRenderingContext.RGBA, webGLRenderingContext.UNSIGNED_BYTE, pixels);

  return pixels;
}

// TODO needed?
export const defaultViewportDimensions = {
  width: constants.scene.headlessViewportWidth,
  height: constants.scene.headlessViewportHeight,
};