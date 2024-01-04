// This file is responsible for defining our shared (abstract) scene logic.
// You can think of scenes as setting up virtual worlds (not Nintendo worlds) where:
// * scenes define the how
// * levels define the what
import * as log from 'ts-app-logger';
log.debug('a.scene loaded');

import { RendererConfig, IRenderer } from './a.renderer';
import BabylonRenderer from './renderer.babylon';
import { Scene as BabylonScene } from '@babylonjs/core/scene';
import '@babylonjs/core/Loading/loadingScreen';
import { UniversalCamera } from '@babylonjs/core/Cameras/universalCamera';
import { DirectionalLight } from '@babylonjs/core/Lights/directionalLight';
import { Color3 as BabylonColor3, Vector3 as BabylonVector3 } from '@babylonjs/core/Maths/math';
import '@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent';
import { ShadowGenerator as BabylonShadowGenerator } from '@babylonjs/core/Lights/Shadows/shadowGenerator';

export default abstract class AScene implements IScene {
  initialized: boolean = false;
  config: RendererConfig;
  renderer: IRenderer;

  shadowGenerator?: BabylonShadowGenerator;

  constructor(config: RendererConfig) { 
    this.config = config;

    if (!this.config.sceneId) { this.config.sceneId = Date.now().toString(); }

    this.renderer = new BabylonRenderer<UniversalCamera>(this.config);
  }

  //@log.Log()
  getRenderer(): IRenderer { return this.renderer; }

  //@log.Log()
  cast<T>(): T { return this.renderer.getScene() as T; }

  //@log.Log()
  async init() {
    if (this.initialized) { return; }; // New level loaded. Currently does nothing after first level loaded.
    
    this.renderer.init();

    if (this.config.rendererLibrary === 'three') {
      this.initThreeScene();
    } else {
      this.initBabylonScene();
    }

    this.initialized = true;
  }

  //@log.Log()
  protected initBabylonScene() {
    this.configureBabylonShadows();

    if (this.config.disableCameraRotation) {
      this.disableBabylonCameraRotation();
    }

    if (this.config.disableCameraZoom) {
      this.disableBabylonCameraZoom();
    }
  }
  //@log.Log()
  protected initThreeScene() {

  }

  //@log.Log()
  private configureBabylonShadows() {
    const shadowLight = new DirectionalLight('shadowLight', new BabylonVector3(0.8, -2, -1), this.renderer.getScene() as BabylonScene);
    shadowLight.diffuse = new BabylonColor3(1, 0.9, 0.62);
    shadowLight.intensity = 2;

    this.shadowGenerator = new BabylonShadowGenerator(2048, shadowLight);
    this.shadowGenerator.useBlurExponentialShadowMap = true;
    this.shadowGenerator.blurKernel = 8;
    
    (this.renderer.getScene() as BabylonScene).meshes.forEach(mesh => { this.shadowGenerator?.addShadowCaster(mesh); });
  }

  //@log.Log() // TODO
  protected disableBabylonCameraRotation() {
    //const camera = this.getRenderer().getCamera() as BabylonFreeCamera;
    //const cameraState = { x: camera.alpha, y: camera.beta };

    const scene = this.renderer.getScene() as BabylonScene;
    
    scene.registerBeforeRender(() => {
      //camera.alpha = cameraState.x;
      //camera.beta = cameraState.y;
    });
  }

  //@log.Log() // TODO
  protected disableBabylonCameraZoom() {
    /*
    //const camera = this.getRenderer().getCamera() as BabylonFreeCamera;
    camera.lowerRadiusLimit = camera.radius;
    camera.upperRadiusLimit = camera.radius;
    */
  }

  //@log.Log()
  async render(onUpdate?: CallableFunction, onRender?: CallableFunction, onFrame?: CallableFunction) {  await this.renderer.render(onUpdate, onRender, onFrame); }

  //@log.Log() 
  async unload() {
    if (this.config.rendererLibrary === 'three') {
      this.threeOnDestroy();
    } else {
      this.babylonOnDestroy();
    }
  }

  //@log.Log()
  protected async babylonOnDestroy() {
    (this.renderer.getScene() as BabylonScene).dispose();
  }
  //@log.Log()
  protected async threeOnDestroy() {}
}

// Scenes define how we render and common things to render.
export interface IScene {
  cast<T>(): T;
  getRenderer(): IRenderer;
  init(): Promise<void>;
  render(onUpdate?: CallableFunction, onRender?: CallableFunction, onFrame?: CallableFunction): Promise<void>;
  unload?(): Promise<void>;
}

// Levels define swappable logic.
export interface ILevel {
  load(): Promise<void>;
  //unload?(): Promise<void>;
}