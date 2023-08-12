// This file is responsible for defining our shared (abstract) scene logic.
// You can think of scenes as setting up virtual worlds (not Nintendo worlds) where:
// * scenes define the how
// * levels define the what
import * as core from 'ts-app-core';
core.logger.debug('a.scene loaded');

import { RendererConfig, IRenderer } from './a.renderer';
import BabylonRenderer from './renderer.babylon';
import ThreeRenderer from './renderer.three';
import { Scene as BabylonScene } from '@babylonjs/core/scene';
import '@babylonjs/core/Loading/loadingScreen';
//import { FreeCamera as BabylonFreeCamera } from '@babylonjs/core/Cameras/freeCamera';
import { DirectionalLight as BabylonDirectionalLight } from '@babylonjs/core/Lights/directionalLight';
import { Color3 as BabylonColor3, Vector3 as BabylonVector3 } from '@babylonjs/core/Maths/math';
import '@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent';
import { ShadowGenerator as BabylonShadowGenerator } from '@babylonjs/core/Lights/Shadows/shadowGenerator';
import FilamentRenderer from './renderer.filament';
import WebGPURenderer from './renderer.swissgl';

export default abstract class AScene implements IScene {
  initialized: boolean = false;
  config: RendererConfig;
  renderer: IRenderer;

  shadowGenerator?: BabylonShadowGenerator;

  constructor(config: RendererConfig) { 
    this.config = config;

    if (!this.config.sceneId) { this.config.sceneId = Date.now().toString(); }

    if (this.config.rendererLibrary === 'three') {
      this.renderer = new ThreeRenderer(this.config);
    } else if (this.config.rendererLibrary === 'swissgl') {
      this.renderer = new WebGPURenderer(this.config);
    } else if (this.config.rendererLibrary === 'filament') {
      this.renderer = new FilamentRenderer(this.config);
    } else {
      this.renderer = new BabylonRenderer(this.config);
    }
  }

  //@core.classLogger.Log()
  getRenderer(): IRenderer { return this.renderer; }

  @core.classLogger.Log()
  async init() {
    if (this.initialized) { return; }; // New level loaded. Currently does nothing after first level loaded.
    
    this.renderer.init();

    if (this.config.rendererLibrary === 'three') {
      this.initThreeScene();
    } else if (this.config.rendererLibrary === 'swissgl') {
      this.initSwissGLScene();
    } else if (this.config.rendererLibrary === 'filament') {
      this.initFilamentScene();
    } else {
      this.initBabylonScene();
    }

    this.initialized = true;
  }

  @core.classLogger.Log()
  protected initBabylonScene() {
    this.configureBabylonShadows();

    if (this.config.disableCameraRotation) {
      this.disableBabylonCameraRotation();
    }

    if (this.config.disableCameraZoom) {
      this.disableBabylonCameraZoom();
    }
  }
  @core.classLogger.Log()
  protected initFilamentScene() {

  }
  @core.classLogger.Log()
  protected initSwissGLScene() {

  }
  @core.classLogger.Log()
  protected initThreeScene() {

  }

  @core.classLogger.Log()
  private configureBabylonShadows() {
    const shadowLight = new BabylonDirectionalLight('shadowLight', new BabylonVector3(0.8, -2, -1), this.renderer.getScene() as BabylonScene);
    shadowLight.diffuse = new BabylonColor3(1, 0.9, 0.62);
    shadowLight.intensity = 2;

    this.shadowGenerator = new BabylonShadowGenerator(2048, shadowLight);
    this.shadowGenerator.useBlurExponentialShadowMap = true;
    this.shadowGenerator.blurKernel = 8;
    
    (this.renderer.getScene() as BabylonScene).meshes.forEach(mesh => { this.shadowGenerator?.addShadowCaster(mesh); });
  }

  @core.classLogger.Log() // TODO
  protected disableBabylonCameraRotation() {
    //const camera = this.getRenderer().getCamera() as BabylonFreeCamera;
    //const cameraState = { x: camera.alpha, y: camera.beta };

    const scene =  this.renderer.getScene() as BabylonScene;
    
    scene.registerBeforeRender(() => {
      //camera.alpha = cameraState.x;
      //camera.beta = cameraState.y;
    });
  }

  @core.classLogger.Log() // TODO
  protected disableBabylonCameraZoom() {
    /*
    //const camera = this.getRenderer().getCamera() as BabylonFreeCamera;
    camera.lowerRadiusLimit = camera.radius;
    camera.upperRadiusLimit = camera.radius;
    */
  }

  //@core.classLogger.Log()
  async render(onUpdate?: CallableFunction, onRender?: CallableFunction, onFrame?: CallableFunction) {  await this.renderer.render(onUpdate, onRender, onFrame); }
}

// Scenes define how we render and common things to render.
export interface IScene {
  getRenderer(): IRenderer;
  init(): Promise<void>;
  render(onUpdate?: CallableFunction, onRender?: CallableFunction, onFrame?: CallableFunction): Promise<void>;
}

// Levels define what we render.
export interface ILevel {
  load(): Promise<void>;
}