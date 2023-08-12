// This file is responsible for defining our test level.
import * as core from 'ts-app-core';
core.logger.debug('level.test loaded');

import { IScene, ALevel } from '../src/index';
import * as THREE from 'three';
import { DirectionalLight as BabylonDirectionalLight } from '@babylonjs/core/Lights/directionalLight';
import { Color3 as BabylonColor3, Color4 as BabylonColor4, Vector3 as BabylonVector3 } from '@babylonjs/core/Maths/math';
import { Scene as BabylonScene } from '@babylonjs/core/scene';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { Axis } from '@babylonjs/core/Maths/math';
import { FreeCamera as BabylonFreeCamera } from '@babylonjs/core/Cameras/freeCamera';
import '@babylonjs/core/Materials/standardMaterial';
import TestScene from './scene.test';

@core.classLogger.LogClass()
export default class TestLevel extends ALevel {
  private boxSize = 1;

  // These are only the assets that must be loaded before creating the Filament engine. Note that many
  // other assets are fetched later in the initialization process (e.g. mesh data).
  initialAssets: string[] = [];

  private onLoad?: CallableFunction;

  pixels?: Uint8Array | string;

  constructor(scene: IScene, onLoad?: CallableFunction) { 
    super(scene); 

    this.onLoad = onLoad;
  }

  @core.classLogger.Log()
  protected override async loadBabylonLevel() {
    const directionalLight = new BabylonDirectionalLight('keyLight', new BabylonVector3(0.3, -1, -2), this.scene.getRenderer().getScene() as BabylonScene);
    directionalLight.diffuse = BabylonColor3.White();
    directionalLight.intensity = 3;

    (this.scene.getRenderer().getScene() as BabylonScene).clearColor = new BabylonColor4(0, 0, 0, 0);

    this.scene.getRenderer().setDefaultCameraPosition([0, 1, 1.8]);
    this.scene.getRenderer().setDefaultCameraTarget([0, 1.5, -5]);

    const box = MeshBuilder.CreateBox('test box', { size: this.boxSize }, this.scene.getRenderer().getScene().scene as BabylonScene);
    box.rotate(Axis.Y, -45);

    const camera = this.scene.getRenderer().getCamera() as BabylonFreeCamera;
    
    camera.setTarget(box.position);
  }
  @core.classLogger.Log() 
  protected override async afterBabylonLevelLoaded() {
    if (this.onLoad) { this.onLoad(); }
  }
  @core.classLogger.Log()
  protected override async babylonOnUpdate() {
    // Every update loop...
  }
  @core.classLogger.Log()
  protected override async babylonOnRender() {
    // Every frame render...
  }
  @core.classLogger.Log()
  protected override async babylonOnFrame(pixels: Uint8Array | string) {
    // Every frame render if you want pixels...
    this.pixels = pixels;
    //core.logger.debug(this.pixels);
  }

  @core.classLogger.Log()
  protected override async loadThreeLevel() {
    // test box
    const geometry = new THREE.BoxGeometry(this.boxSize, this.boxSize, this.boxSize);
    const material = new THREE.MeshBasicMaterial({ color: new THREE.Color() });
    const box = new THREE.Mesh(geometry, material);
    box.rotateY(-45);

    this.scene.getRenderer().setDefaultCameraPosition([0, 1, 1.8]);

    (this.scene.getRenderer().getScene() as THREE.Scene).add(box);
    (this.scene.getRenderer().getCamera() as THREE.Camera).lookAt(box.position);
  }
  @core.classLogger.Log()
  protected override async afterThreeLevelLoaded() {
    if (this.onLoad) { this.onLoad(); }
  }
  @core.classLogger.Log()
  protected override async threeOnUpdate() {
    // Every update loop...
  }
  @core.classLogger.Log()
  protected override async threeOnRender() {
    // Every frame render...
  }
  @core.classLogger.Log()
  protected override async threeOnFrame(pixels: Uint8Array | string) {
    // Every frame render if you want pixels...
    this.pixels = pixels;
    //core.logger.debug(this.pixels);
  }

  async validateSceneFrame() {
    if (!this.pixels) { throw new Error('No frame data.'); }

    (this.scene as TestScene).saveSceneFrame(this.pixels!, this.scene.getRenderer().getConfig().exportConfig);
  }
}