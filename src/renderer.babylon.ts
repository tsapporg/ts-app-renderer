// This file is responsible for rendering when using Babylon. 
// Reference(s): 
// * https://github.com/stackgl/headless-gl/issues/128
// * https://playground.babylonjs.com/#APIVYE#1
// * https://forum.babylonjs.com/t/engine-runrenderloop-still-called-after-stopping-disposing-it-resulting-in-an-attempt-to-read-a-null-property/26693/6
// * https://doc.babylonjs.com/features/featuresDeepDive/scene/renderToPNG
import * as core from 'ts-app-core';
core.logger.debug('renderer.babylon loaded');

import ARenderer, { IRenderer, RendererConfig } from './a.renderer';
import { Scene as BabylonScene } from '@babylonjs/core/scene';
import { FreeCamera as BabylonFreeCamera } from '@babylonjs/core/Cameras/freeCamera';
import { Engine as BabylonEngine } from '@babylonjs/core/Engines/engine';
import { ScreenshotTools as BabylonScreenshotTools } from '@babylonjs/core/Misc/screenshotTools';
import { Vector3 as BabylonVector3 } from '@babylonjs/core/Maths/math';
//import BabylonXRRenderer from './renderer.babylon.xr';
//import '@babylonjs/inspector'; TODO aside from this not rendering properly, it breaks the headless app. look into this.
//import '@babylonjs/core/Legacy/legacy';
//import '@babylonjs/core/Debug/debugLayer';
//import { DebugLayer as BabylonDebugLayer } from '@babylonjs/core/Debug/debugLayer';
import * as viewport from './viewport';
import * as constants from './constants';
import gl from 'gl';

@core.classLogger.LogClass()
export default class BabylonRenderer extends ARenderer implements IRenderer {
  webGLRenderingContext?: WebGLRenderingContext | WebGL2RenderingContext;
  engine?: BabylonEngine;
  scene?: BabylonScene;
  camera?: BabylonFreeCamera;
  
  constructor(config: RendererConfig) { super(config); }

  //@core.classLogger.Log()
  getScene(): BabylonScene | undefined { return this.scene; }
  @core.classLogger.Log()
  getCamera(): BabylonFreeCamera | undefined { return this.camera; }

  @core.classLogger.Log()
  init() {
    super.setupViewport();
    this.setupEngine();
    this.setupScene();

    //if (this.config.mode !== 'xr') { return; }
    //this.xrRenderer = new BabylonXRRenderer(this.engine!, this.scene!);
    // TODO await this.xrRenderer.init();
  }

  @core.classLogger.Log()
  private setupEngine() {
    if (this.config.headless) {
      this.createHeadlessRenderer();
    } else {
      this.engine = new BabylonEngine(this.sceneElement!, true, {
        ...this.defaultWebGLConfig
      });
    }
  }

  @core.classLogger.Log()
  private createHeadlessRenderer() {
    this.webGLRenderingContext = gl(constants.scene.headlessViewportWidth, constants.scene.headlessViewportHeight); 
    this.engine = new BabylonEngine(this.webGLRenderingContext, true, { 
      disableWebGL2Support: true, 
      ...this.defaultWebGLConfig
    });
  }

  @core.classLogger.Log()
  private setupScene() {
    this.scene = new BabylonScene(this.engine!);
    
    this.configureDebugging();
    this.configureCoordinateSystem();
 
    this.camera = this.getDefaultCamera();
    this.camera.attachControl(this.sceneElement!, true);
  }

  @core.classLogger.Log()
  private configureDebugging() {
    // TODO the inspector is totally broken style-wise.
    if (this.config.debug) { 
      /*
      this.scene?.debugLayer.show({
        embedMode: true,
        globalRoot: this.config.debug.element
      });
      */ 
    }
  }

  @core.classLogger.Log()
  private configureCoordinateSystem() {
    //this.scene!.useRightHandedSystem = true;
  }

  @core.classLogger.Log()
  private getDefaultCamera(): BabylonFreeCamera {
    const camera = new BabylonFreeCamera(
      constants.scene.defaultCameraName, 
      BabylonRenderer.toVector3(constants.scene.defaultCameraLocation), 
      this.scene, true);
    camera.setTarget(new BabylonVector3());

    return camera;
  }

  @core.classLogger.Log()
  static toVector3(vector3: number[]): BabylonVector3 {
    return new BabylonVector3(vector3[0], vector3[1], vector3[2]);
  }

  /*
  @core.classLogger.Log()
  async render(onUpdate?: CallableFunction, onRender?: CallableFunction, onFrame?: CallableFunction): Promise<void> {
    if (this.config.loop) { 
      this.renderScene(onUpdate, onRender, onFrame); 

      return;
    } 

    return new Promise((resolve) => {
      this.renderScene(onUpdate, onRender, (pixels: Uint8Array | string) => {
        if (onFrame) { onFrame(pixels, resolve); };
      });
    });
  }
  */

  @core.classLogger.Log()
  async render(onUpdate?: CallableFunction, onRender?: CallableFunction, onFrame?: CallableFunction) {
    /* TODO
    long lastTime = System.nanoTime();
    double amountOfTicks = 60.0;
    double nsBetweenTicks = 1000000000 / amountOfTicks;
    double delta = 0;
    long timer = System.currentTimeMillis();
    
    while (running) {
      long now = System.nanoTime();
      delta += (now - lastTime) / nsBetweenTicks;
      lastTime = now;
      while (delta >=1) {
        onUpdate();
        delta--;
      }
      render();
    }
    */

    if (onUpdate) { this.scene?.registerBeforeRender(() => { onUpdate(); }); }
    if (onRender) { this.scene?.registerAfterRender(() => { onRender(); }); }
    if (onFrame) { this.scene?.registerAfterRender(() => { this.onFrame(onFrame); }); }

    // Ideally we would render a single frame like so:
    //
    // if (!this.config.loop) { 
    //  this.scene?.render();
    //
    // return;
    //}
    //
    // This works to render the frame in a GUI, but when we try to grab the pixel buffer it's no dice.
    // The simplest way to handle this is to just stop the render loop after one render:
    if (!this.config.loop && !this.config.headless) { 
      this.scene?.registerAfterRender(() => {
        this.engine?.stopRenderLoop();
      });
    }
    // But there's a catch! This doesn't work in headless mode. So in headless mode, our ideal single-frame render works:
    if (!this.config.loop && this.config.headless) { 
      this.scene?.render();

      return;
    }

    this.engine?.runRenderLoop(() => {
      if (!this.config.state?.shouldRenderSceneId.get(this.config.sceneId!)) { 
        this.engine?.stopRenderLoop();

        return;
      }

      this.scene?.render();
    });
  }

  //@core.classLogger.Log()
  private onFrame(onFrame: CallableFunction, resolve?: any) {
    // TODO this works for resize? or keep viewport as state and update in onResize?
    const viewportDimensions = viewport.getDimensions(this.config);
    
    if (this.config.headless) {
      // @ts-ignore
      onFrame(viewport.getPixels(this.webGLRenderingContext!, viewportDimensions));

      if (resolve) { resolve(); }

      return;
    } 

    BabylonScreenshotTools.CreateScreenshot(this.engine!, this.camera!, { 
      width: viewportDimensions.width,
      height: viewportDimensions.height, 
      precision: 8 
    }, (renderData: string) => {
      onFrame(renderData);

      if (resolve) { resolve(); }
    });
  }
  
  @core.classLogger.Log() 
  setDefaultCameraPosition(vector3: number[]) {
    this.camera!.position = BabylonRenderer.toVector3(vector3);
  }

  @core.classLogger.Log() 
  setDefaultCameraTarget(vector3: number[]) {
    this.camera?.setTarget(BabylonRenderer.toVector3(vector3));
  }

  @core.classLogger.Log()
  override onResize() { this.engine?.resize(true); }

  @core.classLogger.Log()
  override dispose() {
    super.dispose();

    // TODO await this.xrRenderer.dispose();

    this.scene?.dispose();
    this.engine?.dispose();
  }
}
