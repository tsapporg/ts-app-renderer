// This file is responsible for exporting scene renders (WebGL pixel buffers) to PNGs in a headless environnment.
import * as core from 'ts-app-core';
core.logger.debug('scene.exporter.png.headless loaded');

import { RendererExportConfig } from 'ts-app-renderer';
import { viewport } from 'ts-app-renderer';

@core.classLogger.LogClass()
export default class HeadlessScenePNGExporter {
  exportConfig: RendererExportConfig;
  activeViewportDimensions: viewport.Dimensions;
  pixels: Uint8Array;
  
  constructor(exportConfig: RendererExportConfig, pixels: Uint8Array, viewportDimensions?: viewport.Dimensions) {
    this.exportConfig = exportConfig;
    this.pixels = pixels;

    if (viewportDimensions) { this.activeViewportDimensions = viewportDimensions; } else { this.activeViewportDimensions = viewport.defaultViewportDimensions; }
  }

  @core.classLogger.Log()
  async export(): Promise<void> {
    const renderPath = this.exportConfig.filesystem.resolvePath(this.exportConfig.outputDir, `${this.exportConfig.sceneName}.png`);

    // TODO frame should be a class with viewport dimensions that can be overridden
    const buffer = viewport.pixelsAsPNG(this.pixels, this.activeViewportDimensions);

    return new Promise((resolve, reject) => {
      try {
        this.exportConfig.filesystem.writeFile(renderPath!, buffer);

        return resolve();
      } catch (error) {
        return reject(error);
      }
    });
  }
}