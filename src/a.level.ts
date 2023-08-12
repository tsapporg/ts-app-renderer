// This file is responsible for defining our shared (abstract) level logic.
// You can think of levels as groups of logic and assets.
import * as core from 'ts-app-core';
core.logger.debug('a.level loaded');

import { ILevel, IScene } from './a.scene';
import { fnForRenderer } from './utils.renderer';

export default abstract class ALevel implements ILevel {
  loading: boolean = true;

  protected scene: IScene;

  constructor(scene: IScene) { this.scene = scene; }

  @core.classLogger.Log() 
  async load() {
    await this.scene.init();

    await this.beforeLevelLoaded();
    await this.loadLevel();
    await this.afterLevelLoaded();

    await this.scene.render(() => { this.onUpdate(); }, () => { this.onRender(); }, (pixels: Uint8Array | string) => { this.onFrame(pixels); });
  }

  @core.classLogger.Log() 
  private async beforeLevelLoaded() {
    const fnsForRenderer = new Map<string, CallableFunction>();
    fnsForRenderer.set('babylon', () => { this.beforeBabylonLevelLoaded(); });
    fnsForRenderer.set('filament', () => { this.beforeFilamentLevelLoaded(); });
    fnsForRenderer.set('three', () => { this.beforeThreeLevelLoaded(); });
    //fnsForRenderer.set('swissgl', this.beforeSwissGLLevelLoaded);

    await fnForRenderer(this.scene.getRenderer().getConfig().rendererLibrary, fnsForRenderer);
  }

  @core.classLogger.Log()
  protected async beforeThreeLevelLoaded() {

  }
  @core.classLogger.Log()
  protected async beforeFilamentLevelLoaded() {

  }
  @core.classLogger.Log()
  protected async beforeBabylonLevelLoaded() {

  }

  @core.classLogger.Log() 
  private async loadLevel() {
    const fnsForRenderer = new Map<string, CallableFunction>();
    fnsForRenderer.set('babylon', () => { this.loadBabylonLevel(); });
    fnsForRenderer.set('filament', () => { this.loadFilamentLevel(); });
    fnsForRenderer.set('three', () => { this.loadThreeLevel(); });
    //fnsForRenderer.set('swissgl', this.loadSwissGLLevel);

    await fnForRenderer(this.scene.getRenderer().getConfig().rendererLibrary, fnsForRenderer);
  }

  @core.classLogger.Log()
  protected async loadThreeLevel() {}
  @core.classLogger.Log()
  protected async loadFilamentLevel() {}
  @core.classLogger.Log()
  protected async loadBabylonLevel() {}

  @core.classLogger.Log()
  private async afterLevelLoaded() {
    const fnsForRenderer = new Map<string, CallableFunction>();
    fnsForRenderer.set('babylon', () => { this.afterBabylonLevelLoaded(); });
    fnsForRenderer.set('filament', () => { this.afterFilamentLevelLoaded(); });
    fnsForRenderer.set('three', () => { this.afterThreeLevelLoaded(); });
    //fnsForRenderer.set('swissgl', this.afterWebGPULevelLoaded);

    await fnForRenderer(this.scene.getRenderer().getConfig().rendererLibrary, fnsForRenderer);
  }

  @core.classLogger.Log()
  protected async afterThreeLevelLoaded() {}
  @core.classLogger.Log()
  protected async afterFilamentLevelLoaded() {}
  @core.classLogger.Log()
  protected async afterBabylonLevelLoaded() {}

  // Apply updates to level.
  //@core.classLogger.Log() 
  private async onUpdate() {
    const fnsForRenderer = new Map<string, CallableFunction>();
    fnsForRenderer.set('babylon', () => { this.babylonOnUpdate(); });
    fnsForRenderer.set('filament', () => { this.filamentOnUpdate(); });
    //fnsForRenderer.set('swissgl', this.swissGLOnUpdate);
    fnsForRenderer.set('three', () => { this.threeOnUpdate(); });

    await fnForRenderer(this.scene.getRenderer().getConfig().rendererLibrary, fnsForRenderer);
  }
  
  //@core.classLogger.Log()
  protected async babylonOnUpdate() {}
  //@core.classLogger.Log()
  protected async filamentOnUpdate() {}
  //@core.classLogger.Log()
  protected async threeOnUpdate() {}

  // After updates applied to level, reflect in rendering.
  //@core.classLogger.Log()
  private async onRender() {
    const fnsForRenderer = new Map<string, CallableFunction>();
    fnsForRenderer.set('babylon', () => { this.babylonOnRender(); });
    fnsForRenderer.set('filament', () => { this.filamentOnRender(); });
    //fnsForRenderer.set('swissgl', this.swissGLRender);
    fnsForRenderer.set('three', () => { this.threeOnRender(); });

    await fnForRenderer(this.scene.getRenderer().getConfig().rendererLibrary, fnsForRenderer);
  }

  //@core.classLogger.Log()
  protected async babylonOnRender() {}
  //@core.classLogger.Log()
  protected async filamentOnRender() {}
  //@core.classLogger.Log()
  protected async threeOnRender() {}

  // After updates applied to level, get frame.
  //@core.classLogger.Log()
  private async onFrame(pixels: Uint8Array | string) {
    const fnsForRenderer = new Map<string, CallableFunction>();
    fnsForRenderer.set('babylon', () => { this.babylonOnFrame(pixels); });
    fnsForRenderer.set('filament', () => { this.filamentOnFrame(pixels) });
    ////fnsForRenderer.set('swissgl', () => { this.swissGLOnFrame(pixels); });
    fnsForRenderer.set('three', () => { this.threeOnFrame(pixels); });

    await fnForRenderer(this.scene.getRenderer().getConfig().rendererLibrary, fnsForRenderer);
  }

  //@core.classLogger.Log()
  // @ts-expect-error: 'pixels' is declared but its value is never read.
  protected async babylonOnFrame(pixels: Uint8Array | string) {}
  //@core.classLogger.Log()
  // @ts-expect-error: 'pixels' is declared but its value is never read.
  protected async filamentOnFrame(pixels: Uint8Array | string) {}
  //@core.classLogger.Log()
  // @ts-expect-error: 'pixels' is declared but its value is never read.
  protected async threeOnFrame(pixels: Uint8Array | string) {}
}