// This file is responsible for rendering when using Babylon. 
import * as log from 'ts-app-logger';
log.debug('renderer.babylon loaded');

// TODO these need to be imported before scene creation...but specific to scene/level impls.
import '@babylonjs/loaders/glTF';
import '@babylonjs/core/Materials/standardMaterial';
import '@babylonjs/core/Rendering/boundingBoxRenderer';
import '@babylonjs/core/Engines/Extensions/engine.dynamicTexture';

import ARenderer, { IRenderer, RendererConfig } from './a.renderer';
import { Scene as BabylonScene } from '@babylonjs/core/scene';
import { Camera } from '@babylonjs/core/Cameras/camera';
import { TargetCamera } from '@babylonjs/core/Cameras/targetCamera';
import { Engine as BabylonEngine } from '@babylonjs/core/Engines/engine';
//import { ScreenshotTools as BabylonScreenshotTools } from '@babylonjs/core/Misc/screenshotTools';
import { Vector3 as BabylonVector3 } from '@babylonjs/core/Maths/math';
//import BabylonXRRenderer from './renderer.babylon.xr';
//import '@babylonjs/inspector'; TODO aside from this not rendering properly, it breaks the headless app. look into this.
//import '@babylonjs/core/Legacy/legacy';
//import '@babylonjs/core/Debug/debugLayer';
//import { DebugLayer as BabylonDebugLayer } from '@babylonjs/core/Debug/debugLayer';
//import * as viewport from './viewport';

@log.LogClass()
export default class BabylonRenderer<T> extends ARenderer implements IRenderer {
  webGLRenderingContext?: WebGLRenderingContext | WebGL2RenderingContext;
  engine?: BabylonEngine;
  scene?: BabylonScene;
  _camera?: T; //BabylonFreeCamera;
  
  constructor(config: RendererConfig) { super(config); }

  //@log.Log()
  getScene(): BabylonScene | undefined { return this.scene; }

  public set camera(camera: T) { this._camera = camera; }
  public get camera(): T { return this._camera as T; }

  getCamera(): T { return this._camera as T; }

  @log.Log()
  init() {
    super.setupViewport();
    this.setupEngine();
    this.setupScene();

    //if (this.config.mode !== 'xr') { return; }
    //this.xrRenderer = new BabylonXRRenderer(this.engine!, this.scene!);
    // TODO await this.xrRenderer.init();
  }

  @log.Log()
  private setupEngine() {
    this.engine = new BabylonEngine(this.sceneElement!, true, {
      ...this.defaultWebGLConfig
    });
    
    // Scenes are fuzzy w/o this: https://forum.babylonjs.com/t/babylon-gui-mobile-is-all-blurry/34783/4
    this.engine.setHardwareScalingLevel(1 / window.devicePixelRatio);
    this.engine.adaptToDeviceRatio = true;
  }

  @log.Log()
  private setupScene() {
    this.scene = new BabylonScene(this.engine!);
    
    this.configureDebugging();
    this.configureCoordinateSystem();
 
    //this.camera = this.getDefaultCamera();
    //this.camera.attachControl(this.sceneElement!, true);
  }

  @log.Log()
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

  @log.Log()
  private configureCoordinateSystem() {
    //this.scene!.useRightHandedSystem = true;
  }

  //@log.Log()
  /*
  private getDefaultCamera(): BabylonFreeCamera {
    // TODO move to this
    // Create a default arc rotate camera and light.
    scene.createDefaultCameraOrLight(true, true, true);

    // TODO allow override of camera in level

    this.scene?.createDefaultCamera();

    //camera
    const camera = new BabylonArcRotateCamera(
      constants.scene.defaultCameraName, 
      0.4, 0.4, 50, 
      BabylonRenderer.toVector3(constants.scene.defaultCameraLocation), 
      this.scene
    );
    camera.wheelPrecision = 50;

    const camera = new BabylonFreeCamera(
      constants.scene.defaultCameraName, 
      BabylonRenderer.toVector3(constants.scene.defaultCameraLocation), 
      this.scene, true);
    camera.setTarget(new BabylonVector3());


    //return camera;
  }
  */

  @log.Log()
  static toVector3(vector3: number[]): BabylonVector3 {
    return new BabylonVector3(vector3[0], vector3[1], vector3[2]);
  }

  //@log.Log()
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
    if (!this.config.loop) { 
      this.scene?.registerAfterRender(() => {
        this.engine?.stopRenderLoop();
      });
    }

    this.engine?.runRenderLoop(() => {
      if (!this.config.state?.shouldRenderSceneId.get(this.config.sceneId!)) { 
        this.engine?.stopRenderLoop();

        return;
      }

      this.scene?.render();
    });
  }

  //@log.Log()
  private onFrame(_onFrame: CallableFunction, _resolve?: any) {
    // TODO this works for resize? or keep viewport as state and update in onResize?
    //const viewportDimensions = viewport.getDimensions(this.config);

    /*
    BabylonScreenshotTools.CreateScreenshot(this.engine!, this.camera!, { 
      width: viewportDimensions.width,
      height: viewportDimensions.height, 
      precision: 8 
    }, (renderData: string) => {
      onFrame(renderData);

      if (resolve) { resolve(); }
    });
    */
  }

  @log.Log()
  setCameraPositionInternal(vector3: BabylonVector3) {
    (this.camera as Camera).position = vector3;
  }

  @log.Log()
  setCameraPosition(vector3: number[]) {
    (this.camera as Camera).position = BabylonRenderer.toVector3(vector3);
  }
  
  // TODO deprecate
  @log.Log() 
  setDefaultCameraPosition(vector3: number[]) {
    (this.camera as Camera).position = BabylonRenderer.toVector3(vector3);
  }

  @log.Log() 
  setDefaultCameraTarget(vector3: number[]) {
    (this.camera as TargetCamera).setTarget(BabylonRenderer.toVector3(vector3));
  }

  // TODO not logging
  @log.Log()
  override onResize() { this.engine?.resize(true); }

  @log.Log()
  override dispose() {
    super.dispose();

    // TODO await this.xrRenderer.dispose();

    this.scene?.dispose();
    this.engine?.dispose();
  }
}
