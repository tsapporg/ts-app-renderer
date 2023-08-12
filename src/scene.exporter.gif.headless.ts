// This file is responsible for exporting scene renders (WebGL pixel buffers) to GIFs in a headless environnment.
import * as core from 'ts-app-core';
core.logger.debug('scene.exporter.gif.headless loaded');

import { RendererExportConfig } from 'ts-app-renderer';
import * as renderer from 'ts-app-renderer';
import * as asyncUtils from '../../ts-app-website/src/utils.async';

@core.classLogger.LogClass()
export default class HeadlessSceneGIFExporter {
  exportConfig: RendererExportConfig;
  activeViewportDimensions: renderer.viewport.Dimensions;
  frames: Uint8Array[];
  
  constructor(exportConfig: RendererExportConfig, frames: Uint8Array[], viewportDimensions?: renderer.viewport.Dimensions) {
    this.exportConfig = exportConfig;
    this.frames = frames;

    if (viewportDimensions) { this.activeViewportDimensions = viewportDimensions; } else { this.activeViewportDimensions = renderer.viewport.defaultViewportDimensions; }
  }

  @core.classLogger.Log()
  async export(): Promise<void> {
    const renderPath = this.exportConfig.filesystem.resolvePath(this.exportConfig.outputDir, `${this.exportConfig.sceneName}.gif`);

    // TODO frame should be a class with viewport dimensions that can be overridden
    const buffers = this.frames.map(pixels => renderer.viewport.pixelsAsPNG(pixels, this.activeViewportDimensions));

    // @ts-ignore
    const gif = new window.GIF({ workers: 2, quality: 10 });

    core.logger.debug('adding frames to gif');

    await asyncUtils.forEach(this.frames, async (frame: Uint8Array) => {
      //const imageData = await this.convertURIToImageData(frame);

      gif.addFrame(frame);

      //gif.addFrame(imageData, { delay: 16 }); // TODO dynamic fps rate. 60fps static ...so difference between frames should be 1/60 of a second (in ms). 1/60 * 1000 (ms).
    });
    
    core.logger.debug('gif creation started');

    // TODO gif makkers
    return new Promise((resolve, reject) => {
      gif.on('finished', (blob: Blob) => {
        core.logger.debug('gif creation finished', blob);
  
        try {
          this.exportConfig.filesystem.writeFile(renderPath!, buffers[0]); // TODO this is not right
  
          return resolve();
        } catch (error) {
          return reject(error);
        }
      });

      gif.render();
    });
  }
}