import '@babylonjs/loaders/glTF';
import '@babylonjs/core/Materials/standardMaterial';
import '@babylonjs/core/Rendering/boundingBoxRenderer';
import '@babylonjs/core/Engines/Extensions/engine.dynamicTexture';
import ARenderer, { IRenderer, RendererConfig } from './a.renderer';
import { Scene as BabylonScene } from '@babylonjs/core/scene';
import { Engine as BabylonEngine } from '@babylonjs/core/Engines/engine';
import { Vector3 as BabylonVector3 } from '@babylonjs/core/Maths/math';
export default class BabylonRenderer<T> extends ARenderer implements IRenderer {
    webGLRenderingContext?: WebGLRenderingContext | WebGL2RenderingContext;
    engine?: BabylonEngine;
    scene?: BabylonScene;
    _camera?: T;
    constructor(config: RendererConfig);
    getScene(): BabylonScene | undefined;
    set camera(camera: T);
    get camera(): T;
    getCamera(): T;
    init(): void;
    private setupEngine;
    private setupScene;
    private configureDebugging;
    private configureCoordinateSystem;
    static toVector3(vector3: number[]): BabylonVector3;
    render(onUpdate?: CallableFunction, onRender?: CallableFunction, onFrame?: CallableFunction): Promise<void>;
    private onFrame;
    setCameraPositionInternal(vector3: BabylonVector3): void;
    setCameraPosition(vector3: number[]): void;
    setDefaultCameraPosition(vector3: number[]): void;
    setDefaultCameraTarget(vector3: number[]): void;
    onResize(): void;
    dispose(): void;
}
//# sourceMappingURL=renderer.babylon.d.ts.map