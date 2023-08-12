// This file is responsible for rendering when using SwissGL. 
// @ts-ignore
//https://observablehq.com/@fil/hello-swissgl
import * as core from 'ts-app-core';
core.logger.debug('renderer.swissgl loaded');

import ARenderer, { IRenderer, RendererConfig } from './a.renderer';

@core.classLogger.LogClass()
export default class WebGPURenderer extends ARenderer implements IRenderer {
  //webglRenderer?: THREE.WebGLRenderer;
  //scene?: THREE.Scene;
  //camera?: THREE.Camera;

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
      
    }
  }

  @core.classLogger.Log()
  private createHeadlessRenderer() {
    
  }

  @core.classLogger.Log()
  private setupScene() {
    
  }

  @core.classLogger.Log() // @ts-ignore
  private getDefaultCamera() {
    
  }

  @core.classLogger.Log() // @ts-ignore
  static toVector3(vector3: number[]) {
    
  }

  @core.classLogger.Log()
  async render(tick?: CallableFunction, render?: CallableFunction) {
    if (this.config.loop) { this.renderSceneLoop(tick, render); } else { await this.renderSceneOnce(); }
  }

  @core.classLogger.Log()
  private renderSceneLoop(tick?: CallableFunction, render?: CallableFunction) {
    const renderLoop = () => { 
      if (!this.config.state?.shouldRenderSceneId.get(this.config.sceneId!)) { return; }

      requestAnimationFrame(renderLoop);

      //this.webglRenderer?.render(this.scene!, this.camera!);

      if (tick) { tick(); }
      if (render) { render(); }
    }

    renderLoop();
  }
  
  @core.classLogger.Log()
  private async renderSceneOnce(tick?: CallableFunction, render?: CallableFunction) {
    //this.webglRenderer?.render(this.scene!, this.camera!);

    if (tick) { tick(); }
    if (render) { render(); }
  }

  @core.classLogger.Log() // @ts-ignore
  setDefaultCameraPosition(vector3: number[]) {
    
  }

  @core.classLogger.Log() // @ts-ignore
  setDefaultCameraTarget(vector3: number[]) {
    
  }

  @core.classLogger.Log()
  override onResize() {}

  @core.classLogger.Log()
  override dispose() {}
}

/*
import { mat4, vec3 } from 'gl-matrix';
import { makeSample, SampleInit } from '../../components/SampleLayout';

import {
  cubeVertexArray,
  cubeVertexSize,
  cubeUVOffset,
  cubePositionOffset,
  cubeVertexCount,
} from '../../meshes/cube';

import basicVertWGSL from '../../shaders/basic.vert.wgsl';
import sampleTextureMixColorWGSL from './sampleTextureMixColor.frag.wgsl';

const init: SampleInit = async ({ canvas, pageState }) => {
  const adapter = await navigator.gpu.requestAdapter();
  const device = await adapter.requestDevice();

  if (!pageState.active) return;
  const context = canvas.getContext('swissgl') as GPUCanvasContext;

  const devicePixelRatio = window.devicePixelRatio || 1;
  canvas.width = canvas.clientWidth * devicePixelRatio;
  canvas.height = canvas.clientHeight * devicePixelRatio;
  const presentationFormat = navigator.gpu.getPreferredCanvasFormat();

  context.configure({
    device,
    format: presentationFormat,
    alphaMode: 'opaque',
  });

  // Create a vertex buffer from the cube data.
  const verticesBuffer = device.createBuffer({
    size: cubeVertexArray.byteLength,
    usage: GPUBufferUsage.VERTEX,
    mappedAtCreation: true,
  });
  new Float32Array(verticesBuffer.getMappedRange()).set(cubeVertexArray);
  verticesBuffer.unmap();

  const pipeline = device.createRenderPipeline({
    layout: 'auto',
    vertex: {
      module: device.createShaderModule({
        code: basicVertWGSL,
      }),
      entryPoint: 'main',
      buffers: [
        {
          arrayStride: cubeVertexSize,
          attributes: [
            {
              // position
              shaderLocation: 0,
              offset: cubePositionOffset,
              format: 'float32x4',
            },
            {
              // uv
              shaderLocation: 1,
              offset: cubeUVOffset,
              format: 'float32x2',
            },
          ],
        },
      ],
    },
    fragment: {
      module: device.createShaderModule({
        code: sampleTextureMixColorWGSL,
      }),
      entryPoint: 'main',
      targets: [
        {
          format: presentationFormat,
        },
      ],
    },
    primitive: {
      topology: 'triangle-list',

      // Backface culling since the cube is solid piece of geometry.
      // Faces pointing away from the camera will be occluded by faces
      // pointing toward the camera.
      cullMode: 'back',
    },

    // Enable depth testing so that the fragment closest to the camera
    // is rendered in front.
    depthStencil: {
      depthWriteEnabled: true,
      depthCompare: 'less',
      format: 'depth24plus',
    },
  });

  const depthTexture = device.createTexture({
    size: [canvas.width, canvas.height],
    format: 'depth24plus',
    usage: GPUTextureUsage.RENDER_ATTACHMENT,
  });

  const uniformBufferSize = 4 * 16; // 4x4 matrix
  const uniformBuffer = device.createBuffer({
    size: uniformBufferSize,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  // Fetch the image and upload it into a GPUTexture.
  let cubeTexture: GPUTexture;
  {
    const img = document.createElement('img');
    img.src = new URL(
      '../../../assets/img/Di-3d.png',
      import.meta.url
    ).toString();
    await img.decode();
    const imageBitmap = await createImageBitmap(img);

    cubeTexture = device.createTexture({
      size: [imageBitmap.width, imageBitmap.height, 1],
      format: 'rgba8unorm',
      usage:
        GPUTextureUsage.TEXTURE_BINDING |
        GPUTextureUsage.COPY_DST |
        GPUTextureUsage.RENDER_ATTACHMENT,
    });
    device.queue.copyExternalImageToTexture(
      { source: imageBitmap },
      { texture: cubeTexture },
      [imageBitmap.width, imageBitmap.height]
    );
  }

  // Create a sampler with linear filtering for smooth interpolation.
  const sampler = device.createSampler({
    magFilter: 'linear',
    minFilter: 'linear',
  });

  const uniformBindGroup = device.createBindGroup({
    layout: pipeline.getBindGroupLayout(0),
    entries: [
      {
        binding: 0,
        resource: {
          buffer: uniformBuffer,
        },
      },
      {
        binding: 1,
        resource: sampler,
      },
      {
        binding: 2,
        resource: cubeTexture.createView(),
      },
    ],
  });

  const renderPassDescriptor: GPURenderPassDescriptor = {
    colorAttachments: [
      {
        view: undefined, // Assigned later

        clearValue: { r: 0.5, g: 0.5, b: 0.5, a: 1.0 },
        loadOp: 'clear',
        storeOp: 'store',
      },
    ],
    depthStencilAttachment: {
      view: depthTexture.createView(),

      depthClearValue: 1.0,
      depthLoadOp: 'clear',
      depthStoreOp: 'store',
    },
  };

  const aspect = canvas.width / canvas.height;
  const projectionMatrix = mat4.create();
  mat4.perspective(projectionMatrix, (2 * Math.PI) / 5, aspect, 1, 100.0);

  function getTransformationMatrix() {
    const viewMatrix = mat4.create();
    mat4.translate(viewMatrix, viewMatrix, vec3.fromValues(0, 0, -4));
    const now = Date.now() / 1000;
    mat4.rotate(
      viewMatrix,
      viewMatrix,
      1,
      vec3.fromValues(Math.sin(now), Math.cos(now), 0)
    );

    const modelViewProjectionMatrix = mat4.create();
    mat4.multiply(modelViewProjectionMatrix, projectionMatrix, viewMatrix);

    return modelViewProjectionMatrix as Float32Array;
  }

  function frame() {
    // Sample is no longer the active page.
    if (!pageState.active) return;

    const transformationMatrix = getTransformationMatrix();
    device.queue.writeBuffer(
      uniformBuffer,
      0,
      transformationMatrix.buffer,
      transformationMatrix.byteOffset,
      transformationMatrix.byteLength
    );
    renderPassDescriptor.colorAttachments[0].view = context
      .getCurrentTexture()
      .createView();

    const commandEncoder = device.createCommandEncoder();
    const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
    passEncoder.setPipeline(pipeline);
    passEncoder.setBindGroup(0, uniformBindGroup);
    passEncoder.setVertexBuffer(0, verticesBuffer);
    passEncoder.draw(cubeVertexCount, 1, 0, 0);
    passEncoder.end();
    device.queue.submit([commandEncoder.finish()]);

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
};

const TexturedCube: () => JSX.Element = () =>
  makeSample({
    name: 'Textured Cube',
    description: 'This example shows how to bind and sample textures.',
    init,
    sources: [
      {
        name: __filename.substring(__dirname.length + 1),
        contents: __SOURCE__,
      },
      {
        name: '../../shaders/basic.vert.wgsl',
        contents: basicVertWGSL,
        editable: true,
      },
      {
        name: './sampleTextureMixColor.frag.wgsl',
        contents: sampleTextureMixColorWGSL,
        editable: true,
      },
      {
        name: '../../meshes/cube.ts',
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        contents: require('!!raw-loader!../../meshes/cube.ts').default,
      },
    ],
    filename: __filename,
  });

export default TexturedCube;
*/