// This file is responsible for defining our shared renderer logic.
// Here's a list of renderer libraries to consider: https://gist.github.com/dmnsgn/76878ba6903cf15789b712464875cfdc
import * as log from 'ts-app-logger';
log.debug('a.renderer loaded');

//import { IFilesystem } from 'ts-app-filesystem';
import { RendererState } from './state';

export default abstract class ARenderer {
  config: RendererConfig;

  defaultWebGLConfig = {
    alpha: true,
    antialias: true,
    preserveDrawingBuffer: true,
    stencil: true // TODO only babylon?
  };
  
  sceneElement?: HTMLCanvasElement | null;

  constructor(config: RendererConfig) {
    this.config = config;

    if (!this.config.state) { this.config.state = new RendererState(); }

    window.addEventListener('resize', this.onResize);

    // Allow passing in of HTMLCanvasElement if managed elsewhere (i.e. shadow DOM).
    if (this.config.sceneElement) { this.sceneElement = this.config.sceneElement; }
  }

  //@log.Log()
  protected onResize() {}
 
  //@log.Log()
  getConfig(): RendererConfig { return this.config; }

  //@log.Log()
  protected setupViewport() {
    // If not managed elsewhere, get HTMLCanvasElement to bind scene to.
    if (!this.sceneElement) { this.sceneElement = document.getElementById(this.config.sceneElementID) as HTMLCanvasElement; }
  }

  //@log.Log()
  protected dispose() {
    window?.removeEventListener('resize', this.onResize);
  }
}

export type RendererLibrary = 'babylon' | 'three';
export type Mode = 'standard' | 'xr';

export interface RendererConfig {
  state?: RendererState;

  readonly rendererLibrary: RendererLibrary;
  readonly sceneElementID: string;
  readonly sceneElement?: HTMLCanvasElement; // When using shadow DOM.
  /*
  readonly viewportDimensions?: { // When using shadow DOM.
    readonly width: number;
    readonly height: number;
  };
  */
  sceneId?: string;
  readonly mode?: Mode;
  readonly loop?: boolean;
  readonly updateLoopsPerNFrames?: number; // 10 means exec your logic every 10 frames, which would be 6 times per second if targetting 60fps.
  readonly disableCameraZoom?: boolean;
  readonly disableCameraRotation?: boolean;
  readonly exportConfig?: RendererExportConfig;

  debug?: {
    enable: boolean,
    element: HTMLElement; 
  }
}

export interface RendererExportConfig {
  readonly outputFormat: RendererOutputFormat;
  readonly outputDir: string;
  readonly sceneName: string;
  //readonly filesystem: IFilesystem;
}

export type RendererOutputFormat = 'gltf' | 'room';

// Renderers expose renderer APIs defined by config and where to render.
export interface IRenderer {
  getConfig(): RendererConfig;
  getScene(): any; // Specific to renderer.
  getCamera(): any; // Specific to renderer.
  init(): void;
  render(onUpdate?: CallableFunction, onRender?: CallableFunction, onFrame?: CallableFunction): Promise<void>;
  setDefaultCameraPosition(vector3: number[]): void;
  setDefaultCameraTarget(vector3: number[]): void;
  onResize(): void;
  dispose(): void;
}