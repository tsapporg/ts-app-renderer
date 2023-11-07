import { RendererConfig, IRenderer } from './a.renderer';
import '@babylonjs/core/Loading/loadingScreen';
import '@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent';
import { ShadowGenerator as BabylonShadowGenerator } from '@babylonjs/core/Lights/Shadows/shadowGenerator';
export default abstract class AScene implements IScene {
    initialized: boolean;
    config: RendererConfig;
    renderer: IRenderer;
    shadowGenerator?: BabylonShadowGenerator;
    constructor(config: RendererConfig);
    getRenderer(): IRenderer;
    cast<T>(): T;
    init(): Promise<void>;
    protected initBabylonScene(): void;
    protected initThreeScene(): void;
    private configureBabylonShadows;
    protected disableBabylonCameraRotation(): void;
    protected disableBabylonCameraZoom(): void;
    render(onUpdate?: CallableFunction, onRender?: CallableFunction, onFrame?: CallableFunction): Promise<void>;
    unload(): Promise<void>;
    protected babylonOnDestroy(): Promise<void>;
    protected threeOnDestroy(): Promise<void>;
}
export interface IScene {
    cast<T>(): T;
    getRenderer(): IRenderer;
    init(): Promise<void>;
    render(onUpdate?: CallableFunction, onRender?: CallableFunction, onFrame?: CallableFunction): Promise<void>;
    unload?(): Promise<void>;
}
export interface ILevel {
    load(): Promise<void>;
}
//# sourceMappingURL=a.scene.d.ts.map