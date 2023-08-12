// This file is responsible for defining our orbiting level example.
// The level is implemented in all supported renderers.
import * as core from 'ts-app-core';
core.logger.debug('level.orbiting loaded');

import { IScene, ALevel } from 'ts-app-renderer';
import * as THREE from 'three';
import { DirectionalLight as BabylonDirectionalLight } from '@babylonjs/core/Lights/directionalLight';
import { Color3 as BabylonColor3, Color4 as BabylonColor4, Vector3 as BabylonVector3 } from '@babylonjs/core/Maths/math';
import { Scene as BabylonScene } from '@babylonjs/core/scene';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { Axis, Space } from '@babylonjs/core/Maths/math';
import { FreeCamera as BabylonFreeCamera } from '@babylonjs/core/Cameras/freeCamera';
import '@babylonjs/core/Materials/standardMaterial';
import ExampleScene from './scene';
//import Duration from 'ts-time/Duration';

@core.classLogger.LogClass()
export default class ExampleOrbitingLevel extends ALevel {
  private boxSize = 1;
  private threeBox?: THREE.Mesh;
  private babylonBox?: Mesh;

  private frames: Uint8Array[] | string[] = [];

  private onLoad?: CallableFunction;

  recording = false;

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

    this.babylonBox = MeshBuilder.CreateBox('test box', { size: this.boxSize }, this.scene.getRenderer().getScene().scene as BabylonScene);
    this.babylonBox.rotate(Axis.Y, -45);

    (this.scene.getRenderer().getCamera() as BabylonFreeCamera).setTarget(this.babylonBox.position);
  }
  @core.classLogger.Log() 
  protected override async afterBabylonLevelLoaded() {
    if (this.onLoad) { this.onLoad(); }
  }
  //@core.classLogger.Log()
  protected override async babylonOnUpdate() {
    // Every update loop...
    this.babylonBox?.rotate(Axis.Y, .001 * (this.scene.getRenderer().getScene() as BabylonScene).getAnimationRatio(), Space.LOCAL);
  }
  //@core.classLogger.Log()
  protected override async babylonOnRender() {
    // Every frame render...
  }
  //@core.classLogger.Log()
  protected override async babylonOnFrame(pixels: Uint8Array | string) {
    // Every frame render if you want pixels...
    if (this.recording) { 
      // @ts-ignore
      this.frames.push(pixels);
    }
  }

  @core.classLogger.Log()
  protected override async loadFilamentLevel() {

  }
  @core.classLogger.Log() 
  protected override async afterFilamentLevelLoaded() {
    if (this.onLoad) { this.onLoad(); }
  }
  @core.classLogger.Log()
  protected override async filamentOnUpdate() {
    // Every update loop...
  }
  @core.classLogger.Log()
  protected override async filamentOnRender() {
    // Every frame render...
  }
  @core.classLogger.Log()
  protected override async filamentOnFrame(pixels: Uint8Array | string) {
    // Every frame render if you want pixels...
    if (this.recording) { 
      // @ts-ignore
      this.frames.push(pixels);
    }
  }

  @core.classLogger.Log()
  protected override async loadThreeLevel() {
    // test box
    const geometry = new THREE.BoxGeometry(this.boxSize, this.boxSize, this.boxSize);
    const material = new THREE.MeshBasicMaterial({ color: new THREE.Color() });
    this.threeBox = new THREE.Mesh(geometry, material);
    this.threeBox.rotateY(-45);

    this.scene.getRenderer().setDefaultCameraPosition([0, 1, 1.8]);

    (this.scene.getRenderer().getScene() as THREE.Scene).add(this.threeBox);
    (this.scene.getRenderer().getCamera() as THREE.Camera).lookAt(this.threeBox.position);
  }
  @core.classLogger.Log() 
  protected override async afterThreeLevelLoaded() {
    if (this.onLoad) { this.onLoad(); }
  }
  //@core.classLogger.Log()
  protected override async threeOnUpdate() {
    // Every update loop...
    this.threeBox!.rotateY(.01);
  }
  //@core.classLogger.Log()
  protected override async threeOnRender() {
    // Every frame render...
  }
  //@core.classLogger.Log()
  protected override async threeOnFrame(pixels: Uint8Array | string) {
    // Every frame render if you want pixels...
    if (this.recording) { 
      // @ts-ignore
      this.frames.push(pixels); 
    }
  }

  @core.classLogger.Log()
  async trySaveFramesAsGIF() {
    return new Promise((resolve, reject) => {
      this.recording = true;

      //core.logger.debug(Duration.ofSeconds(5).ms); TODO 
      setTimeout(() => {
        this.recording = false;
    
        (this.scene as ExampleScene).saveSceneFrames(this.frames, this.scene.getRenderer().getConfig().exportConfig)
          .then(resolve).catch(reject);
      }, 5 * 1000);
    });
  }
}