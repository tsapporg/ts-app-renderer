// This file is responsible for rendering when using Three. 
// References:
// * https://discoverthreejs.com/book/first-steps/animation-loop/
// * https://gist.github.com/paranoidd/3553c3aeadfc8db59d4609fc51e7b2b7
// * https://threejsfundamentals.org/threejs/lessons/threejs-rendertargets.html
// * https://threejsfundamentals.org/threejs/lessons/threejs-shadows.html
import * as core from 'ts-app-core';
core.logger.debug('renderer.three loaded');

import ARenderer, { IRenderer, RendererConfig } from './a.renderer';
import * as THREE from 'three';
import * as constants from './constants';
import gl from 'gl';
import * as viewport from './viewport';
//import Stats from 'three/examples/jsm/libs/stats.module';

//const stats = Stats()
//document.body.appendChild(stats.dom)

// anim stats.update()

// TODO also support https://mrdoob.github.io/talks/khronos-2023/#0
//THREE.Object3D.DefaultUp.set(0, 0, 1);

@core.classLogger.LogClass()
export default class ThreeRenderer extends ARenderer implements IRenderer {
  webglRenderer?: THREE.WebGLRenderer;
  scene?: THREE.Scene;
  camera?: THREE.Camera;
  //stats?: Stats;

  constructor(config: RendererConfig) { super(config); }

  @core.classLogger.Log()
  getScene(): THREE.Scene | undefined { return this.scene; }
  @core.classLogger.Log()
  getCamera(): THREE.Camera | undefined { return this.camera; }

  @core.classLogger.Log()
  init() {
    super.setupViewport();
    this.setupEngine();
    this.setupScene();
  }

  @core.classLogger.Log()
  private setupEngine() {
    if (this.config.headless) {
      this.webglRenderer = this.createHeadlessRenderer();
    } else {      
      this.webglRenderer = new THREE.WebGLRenderer({ 
        canvas: this.sceneElement!, 
        ...this.defaultWebGLConfig
      });

      const viewportDimensions = viewport.getDimensions(this.config);

      //core.logger.debug('width', this.sceneElement?.style.width!, 'height', this.sceneElement?.style.height!);
      //core.logger.debug('viewportDimensions', 'width', this.config.viewportDimensions?.width, 'height',  this.config.viewportDimensions?.height);

      // TODO which is which?
      if (!this.sceneElement?.style.width || !this.sceneElement?.style.height && viewportDimensions) {
        core.logger.debug('set three webgl from scene element viewport helper');

        this.webglRenderer.setSize(viewportDimensions.width, viewportDimensions.height!);
      } else {
        core.logger.debug('set three webgl from scene element style width/height');

        this.webglRenderer.setSize(Number(this.sceneElement?.style.width!), Number(this.sceneElement?.style.height!));
      }
    }
  }

  @core.classLogger.Log()
  private createHeadlessRenderer(): THREE.WebGLRenderer {
    // THREE expects a canvas object to exist, but it doesn't actually have to work.
    const canvas = {
      width: constants.scene.headlessViewportWidth,
      height: constants.scene.headlessViewportHeight,
      // @ts-expect-error: 'event' is declared but its value is never read.
      addEventListener: (event: any) => {},
      // @ts-expect-error: 'event' is declared but its value is never read.
      removeEventListener: (event: any) => {}
    };
  
    const renderer = new THREE.WebGLRenderer({
      // @ts-expect-error: Type '{ width: number; height: number; addEventListener: (event: any) => void; removeEventListener: (event: any) => void; }' is not assignable to type 'HTMLCanvasElement | OffscreenCanvas | undefined'.
      canvas,
      ...this.defaultWebGLConfig,
      powerPreference: 'high-performance',
      context: gl(constants.scene.headlessViewportWidth, constants.scene.headlessViewportHeight, {
        ...this.defaultWebGLConfig
      })
    });
  
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default PCFShadowMap
  
    const renderTarget = new THREE.WebGLRenderTarget(constants.scene.headlessViewportWidth, constants.scene.headlessViewportHeight, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat,
      type: THREE.UnsignedByteType,
    });
  
    renderer.setRenderTarget(renderTarget);
    
    return renderer;
  }

  @core.classLogger.Log()
  private setupScene() {
    this.scene = new THREE.Scene();

    this.configureDebugging();

    this.webglRenderer?.setPixelRatio(window.devicePixelRatio * 1.5);
    this.scene.background = new THREE.Color(0x213547);
    this.camera = this.getDefaultCamera();
  }

  @core.classLogger.Log()
  private configureDebugging() {
    if (this.config.debug) {
      // TODO enable debugging
      //this.stats = Stats();

      //this.config.debug.element.appendChild(this.stats?.dom);
    }
  }

  @core.classLogger.Log()
  private getDefaultCamera(): THREE.PerspectiveCamera {
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.name = constants.scene.defaultCameraName;
    camera.position.set(constants.scene.defaultCameraLocation[0], constants.scene.defaultCameraLocation[1], constants.scene.defaultCameraLocation[2]);
    camera.lookAt(new THREE.Vector3());

    return camera;
  }

  @core.classLogger.Log()
  static toVector3(vector3: number[]): THREE.Vector3 {
    return new THREE.Vector3(vector3[0], vector3[1], vector3[2]);
  }

  @core.classLogger.Log()
  async render(onUpdate?: CallableFunction, onRender?: CallableFunction, onFrame?: CallableFunction) {
    if (onUpdate) {
      // @ts-ignore
      this.scene!.onBeforeRender = (renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera, geometry: THREE.BufferGeometry, material: THREE.Material, group: THREE.Group) => {
        onUpdate();
      }
    }

    if (onRender) {
      // @ts-ignore
      this.scene!.onAfterRender = (renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera, geometry: THREE.BufferGeometry, material: THREE.Material, group: THREE.Group) => {
        onRender();
      }
    }

    if (onFrame) { this.onFrame(onFrame); }

    if (!this.config.loop) {
      this.webglRenderer?.render(this.scene!, this.camera!);

      return;
    }
    
    this.webglRenderer?.setAnimationLoop(() => {
      if (!this.config.state?.shouldRenderSceneId.get(this.config.sceneId!)) { 
        this.webglRenderer?.setAnimationLoop(null);

        return;
      }

      this.webglRenderer?.render(this.scene!, this.camera!);

      //this.stats?.update();
    });
  }

  //@core.classLogger.Log()
  private onFrame(onFrame: CallableFunction) {
    // @ts-ignore
    this.scene!.onAfterRender = (renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera, geometry: THREE.BufferGeometry, material: THREE.Material, group: THREE.Group) => {
      const viewportDimensions = viewport.getDimensions(this.config);
        
      if (this.config.headless) { 
        onFrame(viewport.getPixels(this.webglRenderer?.getContext()!, viewportDimensions));
      } else {
        // TODO use export config if exists, image/png, image/jpg, etc.
        onFrame(this.webglRenderer?.domElement.toDataURL('image/octet-stream'));
      }
    }
  }

  @core.classLogger.Log() 
  setDefaultCameraPosition(vector3: number[]) {
    this.camera?.position.set(vector3[0], vector3[1], vector3[2]);
  }

  @core.classLogger.Log()
  setDefaultCameraTarget(vector3: number[]) {
    this.camera?.lookAt(ThreeRenderer.toVector3(vector3));
  }

  @core.classLogger.Log()
  override onResize() {
    console.log(this); // TODO failing?
    this.getDefaultCamera().aspect = window.innerWidth / window.innerHeight;
    this.getDefaultCamera().updateProjectionMatrix();

    this.webglRenderer?.setSize(window.innerWidth, window.innerHeight);
  }

  @core.classLogger.Log()
  override dispose() {}
}
