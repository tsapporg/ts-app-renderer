// This file is responsible for rendering when using Filament. 
import * as core from 'ts-app-core';
core.logger.debug('renderer.filament loaded');

import ARenderer, { IRenderer, RendererConfig } from './a.renderer';
import * as Filament from 'filament';
import * as constants from './constants';

@core.classLogger.LogClass()
export default class FilamentRenderer extends ARenderer implements IRenderer {
  engine?: Filament.Engine;
  renderer?: Filament.Renderer;
  scene?: Filament.Scene;
  camera?: Filament.Camera;
  swapChain?: Filament.SwapChain; // TODO?
  view?: Filament.View;
  textureSampler?: Filament.TextureSampler;

  constructor(config: RendererConfig) { super(config); }

  @core.classLogger.Log()
  getScene(): undefined { return; }
  @core.classLogger.Log()
  getCamera(): undefined { return; }

  @core.classLogger.Log()
  init() {
    super.setupViewport();
    this.setupEngine();
    this.setupScene();
  }

  @core.classLogger.Log()
  private setupEngine() {
    if (this.config.headless) {
      this.createHeadlessRenderer();
    } else {
      this.engine = Filament.Engine.create(this.config.sceneElement!);
      this.scene = this.engine.createScene();
      this.swapChain = this.engine.createSwapChain();
      this.renderer = this.engine.createRenderer();

      this.textureSampler = new Filament.TextureSampler(
        Filament.MinFilter.LINEAR_MIPMAP_LINEAR, Filament.MagFilter.LINEAR,
        Filament.WrapMode.REPEAT
      );

      this.camera = this.getDefaultCamera();

      this.view = this.engine.createView();
      this.view.setCamera(this.camera!);
      this.view.setScene(this.scene);
    }
  }

  @core.classLogger.Log()
  private createHeadlessRenderer() {
    throw new Error(constants.strings.notImplementedError);
  }

  @core.classLogger.Log()
  private setupScene() {
    
  }

  @core.classLogger.Log()
  private getDefaultCamera(): Filament.Camera {
    const cameraEntity = Filament.EntityManager.get().create();

    if (!cameraEntity) { throw new Error('missing cam'); } // TODO constants
    
    return this.engine?.createCamera(cameraEntity)!;
  }

  @core.classLogger.Log() // @ts-ignore
  static toVector3(vector3: number[]) {
    
  }

  @core.classLogger.Log()
  async render(onUpdate?: CallableFunction, onRender?: CallableFunction) {
    if (this.config.loop) { this.renderSceneLoop(onUpdate, onRender); } else { await this.renderSceneOnce(); }
  }

  @core.classLogger.Log()
  private renderSceneLoop(onUpdate?: CallableFunction, onRender?: CallableFunction, onFrame?: CallableFunction) {
    const _renderFrame = () => {
      this.renderFrame(onUpdate, onRender, onFrame);
     
      window.requestAnimationFrame(_renderFrame);
    }

    window.requestAnimationFrame(_renderFrame);
  }

  @core.classLogger.Log()
  private renderFrame(onUpdate?: CallableFunction, onRender?: CallableFunction, onFrame?: CallableFunction) {
    if (onUpdate) { onUpdate(); }
    
    this.renderer?.render(this.swapChain!, this.view!);

    if (onRender) { onRender(); }
    if (onFrame) { onFrame(); }
  }
  
  @core.classLogger.Log()
  private async renderSceneOnce(onUpdate?: CallableFunction, onRender?: CallableFunction, onFrame?: CallableFunction) {
    const _renderFrame = () => {
      this.renderFrame(onUpdate, onRender, onFrame);
     
      window.requestAnimationFrame(_renderFrame);
    }

    window.requestAnimationFrame(_renderFrame);
  }

  @core.classLogger.Log() // @ts-ignore
  setDefaultCameraPosition(vector3: number[]) {
    
  }

  @core.classLogger.Log() // @ts-ignore
  setDefaultCameraTarget(vector3: number[]) {
    
  }

  @core.classLogger.Log()
  override onResize() {
    const dpr = window.devicePixelRatio;
    
    const width = this.config.sceneElement!.width = window.innerWidth * dpr;
    const height = this.config.sceneElement!.height = window.innerHeight * dpr;
    
    this.view?.setViewport([0, 0, width, height]);

    const aspect = width / height;
    const Fov = Filament.Camera$Fov;
    const fov = aspect < 1 ? Fov.HORIZONTAL : Fov.VERTICAL;
    
    this.camera?.setProjectionFov(45, aspect, 1.0, 20000.0, fov);
  }

  @core.classLogger.Log()
  override dispose() {}
}

/*
<!DOCTYPE html>
<html lang="en">
<head>
<title>FlightHelmet</title>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1">
<link href="favicon.png" rel="icon" type="image/x-icon" />
<style>
html, body { height: 100%; }
body       { margin: 0; overflow: hidden; }
#container { position: relative; height: 100%; }
canvas     { position: absolute; width: 100%; height: 100%; }
#messages  { position: absolute; width: 100%; height: 100%; padding-left: 10px; color:blue; pointer-events: none; }
</style>
</head>
<body>
<div id="container">
    <canvas></canvas>
    <pre id="messages"></pre>
</div>
<script src="filament.js"></script>
<script src="gl-matrix-min.js"></script>
<script src="gltumble.min.js"></script>
<script>

const env = 'default_env';
const ibl_url = `${env}/${env}_ibl.ktx`;
const sky_url = `${env}/${env}_skybox.ktx`;
const mesh_url = 'FlightHelmet.gltf';

Filament.init([mesh_url, ibl_url, sky_url], () => {
    window.gltfio = Filament.gltfio;
    window.Fov = Filament.Camera$Fov;
    window.LightType = Filament.LightManager$Type;
    window.IndirectLight = Filament.IndirectLight;
    window.app = new App(document.getElementsByTagName('canvas')[0]);
});

class App {
    constructor(canvas) {
        this.canvas = canvas;
        const engine = this.engine = Filament.Engine.create(this.canvas);
        const scene = this.scene = engine.createScene();
        this.trackball = new Trackball(canvas, {startSpin: 0.035});

        const messages = document.getElementById('messages');

        canvas.addEventListener('pointerdown', evt => {
            const x = evt.clientX;
            const y = this.canvas.getBoundingClientRect().height - 1 - evt.clientY;
            const dpr = window.devicePixelRatio;
            this.view.pick(x * dpr, y * dpr, (results) => {
                const name = this.asset.getName(results.renderable);
                messages.innerText = name ? ('Picked ' + name) : '';
            });
        });

        const indirectLight = this.ibl = engine.createIblFromKtx1(ibl_url);
        this.scene.setIndirectLight(indirectLight);

        const iblDirection = IndirectLight.getDirectionEstimate(indirectLight.shfloats);
        const iblColor = IndirectLight.getColorEstimate(indirectLight.shfloats, iblDirection);
        const iblIntensity = 20000;

        indirectLight.setIntensity(iblIntensity);

        // Rotate the IBL so that a bright light is behind the helmet, to show off bloom.
        const mat = [];
        const radians = 3.14;
        mat3.fromRotation(mat, radians, [0, 1, 0]);
        indirectLight.setRotation(mat);

        const skybox = engine.createSkyFromKtx1(sky_url);
        this.scene.setSkybox(skybox);

        const sunlight = Filament.EntityManager.get().create();
        Filament.LightManager.Builder(LightType.SUN)
            .color(iblColor.slice(0, 3))
            .intensity(iblColor[3] * iblIntensity)
            .direction(iblDirection)
            .sunAngularRadius(1.9)
            .castShadows(true)
            .sunHaloSize(10.0)
            .sunHaloFalloff(80.0)
            .build(engine, sunlight);
        this.scene.addEntity(sunlight);

        const loader = this.loader = engine.createAssetLoader();

        this.allowRefresh = false;
        const asset = this.asset = loader.createAsset(mesh_url);
        this.assetRoot = this.asset.getRoot();

        // Crudely indicate progress by printing the URI of each resource as it is loaded.
        const onFetched = (uri) => messages.innerText += `Downloaded ${uri}\n`;

        const onDone = () => {
            this.allowRefresh = true;

            // Clear the progress indication messages.
            messages.innerText = "";
        };
        asset.loadResources(onDone, onFetched);

        const cameraEntity = Filament.EntityManager.get().create();
        this.camera = engine.createCamera(cameraEntity);

        const colorGrading = Filament.ColorGrading.Builder()
            .toneMapping(Filament.ColorGrading$ToneMapping.ACES_LEGACY)
            .build(engine);

        this.swapChain = engine.createSwapChain();
        this.renderer = engine.createRenderer();
        this.view = engine.createView();
        this.view.setVignetteOptions({ midPoint: 0.8, enabled: true });

        this.view.setBloomOptions({ strength: 0.2, enabled: true });

        this.view.setCamera(this.camera);
        this.view.setScene(this.scene);
        this.view.setColorGrading(colorGrading);
        this.resize();
        this.render = this.render.bind(this);
        this.resize = this.resize.bind(this);
        this.refresh = this.refresh.bind(this);
        window.addEventListener('resize', this.resize);
        window.addEventListener('dblclick', this.refresh);
        window.requestAnimationFrame(this.render);
    }

    // Test for memory leaks by destroying and recreating the asset.
    refresh() {
        if (!this.allowRefresh) {
            console.warn('Refresh not allowed while the model is still loading.');
            return;
        }
        console.info('Refreshing...');
        this.allowRefresh = false;
        this.scene.removeEntities(this.asset.getEntities());
        this.loader.destroyAsset(this.asset);
        this.asset = this.loader.createAsset(mesh_url);
        const onDone = () => { this.allowRefresh = true; }
        this.asset.loadResources(onDone);
    }

    render() {
        // Spin the model according to the trackball controller.
        const tcm = this.engine.getTransformManager();
        const inst = tcm.getInstance(this.assetRoot);
        tcm.setTransform(inst, this.trackball.getMatrix());
        inst.delete();

        // Gradually add renderables to the scene as their textures become ready.
        let entity;
        const popRenderable = () => {
            entity = this.asset.popRenderable();
            return entity.getId() != 0;
        }
        while (popRenderable()) {
            this.scene.addEntity(entity);
            entity.delete();
        }
        entity.delete();

        // Render the scene and request the next animation frame.
        if (this.renderer.beginFrame(this.swapChain)) {
            this.renderer.renderView(this.view);
            this.renderer.endFrame();
        }
        this.engine.execute();

        window.requestAnimationFrame(this.render);
    }

    resize() {
        const dpr = window.devicePixelRatio;
        const width = this.canvas.width = window.innerWidth * dpr;
        const height = this.canvas.height = window.innerHeight * dpr;
        this.view.setViewport([0, 0, width, height]);
        const y = -0.125, eye = [0, y, 2], center = [0, y, 0], up = [0, 1, 0];
        this.camera.lookAt(eye, center, up);
        const aspect = width / height;
        const fov = aspect < 1 ? Fov.HORIZONTAL : Fov.VERTICAL;
        this.camera.setProjectionFov(30, aspect, 1.0, 10.0, fov);
    }
}
</script>
</body>
</html>
*/