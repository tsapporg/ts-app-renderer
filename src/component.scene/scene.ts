// This file is responsible for defining our example scene.
// This example doesn't override any defaults.
import * as core from 'ts-app-core';
core.logger.debug('scene loaded');

import * as renderer from 'ts-app-renderer';
import * as constants from '../constants';
import HeadlessScenePNGExporter from '../scene.exporter.png.headless';
import HeadlessSceneGIFExporter from '../scene.exporter.gif.headless';
import ScenePNGExporter from '../scene.exporter.png';
import SceneGIFExporter from '../scene.exporter.gif';

@core.classLogger.LogClass()
export default class ExampleScene extends renderer.AScene {
  constructor(config: renderer.RendererConfig) { super(config); }

  @core.classLogger.Log()
  async saveSceneFrame(data: Uint8Array | string, exportConfig?: renderer.RendererExportConfig): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.config.headless) {
        const pngExporter = new HeadlessScenePNGExporter(this.getExportConfig(exportConfig), data as Uint8Array);
        pngExporter.export().then(resolve).catch(reject);
      } else {
        console.log('data', data);

        const pngExporter = new ScenePNGExporter(data as string);
        pngExporter.export().then(resolve).catch(reject);
      }
    });
  }

  // Export config can be passed either in renderer config or to the save methods - prioritize one.
  @core.classLogger.Log()
  private getExportConfig(exportConfig?: renderer.RendererExportConfig): renderer.RendererExportConfig {
    if (this.config.headless) {
      if (!this.config.exportConfig && !exportConfig) { throw new Error(constants.strings.noExportConfigFoundError); }
    

      let activeExportConfig = this.config.exportConfig;
      if (!activeExportConfig) { activeExportConfig = exportConfig; }
      if (activeExportConfig?.outputFormat !== 'png') { throw new Error(constants.strings.outputFormatNotSupported); }

      return activeExportConfig;
    }

    throw new Error(constants.strings.unsupported);
  }

  @core.classLogger.Log()
  async saveSceneFrames(data: Uint8Array[] | string[], exportConfig?: renderer.RendererExportConfig): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.config.headless) {
        const gifExporter = new HeadlessSceneGIFExporter(this.getExportConfig(exportConfig), data as Uint8Array[]);
        gifExporter.export().then(resolve).catch(reject);
      } else {
        console.log('data[]', data);

        const gifExporter = new SceneGIFExporter(data as string[]);
        gifExporter.export().then(resolve).catch(reject);
      }
    });
  }
}