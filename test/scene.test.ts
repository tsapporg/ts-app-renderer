// This file is responsible for defining our test scene.
import * as core from 'ts-app-core';
core.logger.debug('scene.test loaded');

import { RendererConfig, RendererExportConfig, AScene } from '../src/index';

@core.classLogger.LogClass()
export default class TestScene extends AScene {
  constructor(config: RendererConfig) { super(config); }

  @core.classLogger.Log() // @ts-ignore
  async saveSceneFrame(data: Uint8Array | string, exportConfig?: RendererExportConfig): Promise<void> {
    core.logger.debug('exportConfig', exportConfig);
    //core.logger.debug(data);
  }

  @core.classLogger.Log() // @ts-ignore
  async saveSceneFrames(data: Uint8Array[] | string[], exportConfig?: RendererExportConfig): Promise<void> {
    core.logger.debug('exportConfig', exportConfig);
    //core.logger.debug(data);
  }
}