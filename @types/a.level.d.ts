import { ILevel, IScene } from './a.scene';
export default abstract class ALevel implements ILevel {
    loading: boolean;
    protected scene: IScene;
    constructor(scene: IScene);
    load(): Promise<void>;
    private beforeLevelLoaded;
    protected beforeBabylonLevelLoaded(): Promise<void>;
    private loadLevel;
    protected loadBabylonLevel(): Promise<void>;
    private afterLevelLoaded;
    protected afterBabylonLevelLoaded(): Promise<void>;
    private onUpdate;
    protected babylonOnUpdate(): Promise<void>;
    private onRender;
    protected babylonOnRender(): Promise<void>;
    private onFrame;
    protected babylonOnFrame(pixels: Uint8Array | string): Promise<void>;
}
//# sourceMappingURL=a.level.d.ts.map