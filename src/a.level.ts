// This file is responsible for defining our shared (abstract) level logic.
// You can think of levels as groups of logic and assets.
import * as log from 'ts-app-logger';
log.debug('a.level loaded');

import { ILevel, IScene } from './a.scene';
import { fnForRenderer } from './utils.renderer';
//import { Scene as BabylonScene } from '@babylonjs/core/scene';

export default abstract class ALevel implements ILevel {
  loading: boolean = true;

  protected scene: IScene;

  constructor(scene: IScene) { this.scene = scene; }

  //@log.Log() 
  async load() {
    await this.scene.init();

    await this.beforeLevelLoaded();
    await this.loadLevel();
    await this.afterLevelLoaded();

    await this.scene.render(() => { this.onUpdate(); }, () => { this.onRender(); }, (pixels: Uint8Array | string) => { this.onFrame(pixels); });
  }

  //@log.Log() 
  private async beforeLevelLoaded() {
    const fnsForRenderer = new Map<string, CallableFunction>();
    fnsForRenderer.set('babylon', () => { this.beforeBabylonLevelLoaded(); });

    await fnForRenderer(this.scene.getRenderer().getConfig().rendererLibrary, fnsForRenderer);
  }

  //@log.Log()
  protected async beforeBabylonLevelLoaded() {

  }

  //@log.Log() 
  private async loadLevel() {
    const fnsForRenderer = new Map<string, CallableFunction>();
    fnsForRenderer.set('babylon', () => { this.loadBabylonLevel(); });

    await fnForRenderer(this.scene.getRenderer().getConfig().rendererLibrary, fnsForRenderer);
  }

  //@log.Log()
  protected async loadBabylonLevel() {}

  //@log.Log()
  private async afterLevelLoaded() {
    const fnsForRenderer = new Map<string, CallableFunction>();
    fnsForRenderer.set('babylon', () => { this.afterBabylonLevelLoaded(); });

    await fnForRenderer(this.scene.getRenderer().getConfig().rendererLibrary, fnsForRenderer);
  }

  //@log.Log()
  protected async afterBabylonLevelLoaded() {}

  // Apply updates to level.
  //@log.Log() 
  private async onUpdate() {
    const fnsForRenderer = new Map<string, CallableFunction>();
    fnsForRenderer.set('babylon', () => { this.babylonOnUpdate(); });

    await fnForRenderer(this.scene.getRenderer().getConfig().rendererLibrary, fnsForRenderer);
  }
  
  //@log.Log()
  protected async babylonOnUpdate() {}

  // After updates applied to level, reflect in rendering.
  //@log.Log()
  private async onRender() {
    const fnsForRenderer = new Map<string, CallableFunction>();
    fnsForRenderer.set('babylon', () => { this.babylonOnRender(); });

    await fnForRenderer(this.scene.getRenderer().getConfig().rendererLibrary, fnsForRenderer);
  }

  //@log.Log()
  protected async babylonOnRender() {}

  // After updates applied to level, get frame.
  //@log.Log()
  private async onFrame(pixels: Uint8Array | string) {
    const fnsForRenderer = new Map<string, CallableFunction>();
    fnsForRenderer.set('babylon', () => { this.babylonOnFrame(pixels); });

    await fnForRenderer(this.scene.getRenderer().getConfig().rendererLibrary, fnsForRenderer);
  }

  //@log.Log()
  // @ts-expect-error: 'pixels' is declared but its value is never read.
  protected async babylonOnFrame(pixels: Uint8Array | string) {}

  /*
  //@log.Log() 
  async unload() {
    const fnsForRenderer = new Map<string, CallableFunction>();
    fnsForRenderer.set('babylon', () => { this.babylonOnDestroy(); });

    await fnForRenderer(this.scene.getRenderer().getConfig().rendererLibrary, fnsForRenderer);
  }

  //@log.Log()
  protected async babylonOnDestroy() {
    this.scene.cast<BabylonScene>().dispose();
  }
  */
}