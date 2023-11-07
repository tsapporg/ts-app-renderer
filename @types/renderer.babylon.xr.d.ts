import { Scene as BabylonScene } from '@babylonjs/core/scene';
import { Engine as BabylonEngine } from '@babylonjs/core/Engines/engine';
export default class BabylonXRRenderer {
    private engine;
    private scene;
    private webXrDefaultExp?;
    private webXRStateObserver;
    private onControllerAddedObserver?;
    private onControllerRemovedObserver?;
    private leftInputSource?;
    private leftController?;
    private rightInputSource?;
    private rightController?;
    constructor(engine: BabylonEngine, scene: BabylonScene);
    init(): Promise<void>;
    private setupControllers;
    dispose(): Promise<void>;
}
//# sourceMappingURL=renderer.babylon.xr.d.ts.map