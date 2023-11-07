import { RendererState } from './state';
export default abstract class ARenderer {
    config: RendererConfig;
    defaultWebGLConfig: {
        alpha: boolean;
        antialias: boolean;
        preserveDrawingBuffer: boolean;
        stencil: boolean;
    };
    sceneElement?: HTMLCanvasElement | null;
    constructor(config: RendererConfig);
    protected onResize(): void;
    getConfig(): RendererConfig;
    protected setupViewport(): void;
    protected dispose(): void;
}
export type RendererLibrary = 'babylon' | 'three';
export type Mode = 'standard' | 'xr';
export interface RendererConfig {
    state?: RendererState;
    readonly rendererLibrary: RendererLibrary;
    readonly sceneElementID: string;
    readonly sceneElement?: HTMLCanvasElement;
    sceneId?: string;
    readonly mode?: Mode;
    readonly loop?: boolean;
    readonly updateLoopsPerNFrames?: number;
    readonly disableCameraZoom?: boolean;
    readonly disableCameraRotation?: boolean;
    readonly exportConfig?: RendererExportConfig;
    debug?: {
        enable: boolean;
        element: HTMLElement;
    };
}
export interface RendererExportConfig {
    readonly outputFormat: RendererOutputFormat;
    readonly outputDir: string;
    readonly sceneName: string;
}
export type RendererOutputFormat = 'gltf' | 'room';
export interface IRenderer {
    getConfig(): RendererConfig;
    getScene(): any;
    getCamera(): any;
    init(): void;
    render(onUpdate?: CallableFunction, onRender?: CallableFunction, onFrame?: CallableFunction): Promise<void>;
    setDefaultCameraPosition(vector3: number[]): void;
    setDefaultCameraTarget(vector3: number[]): void;
    onResize(): void;
    dispose(): void;
}
//# sourceMappingURL=a.renderer.d.ts.map