// This file is responsible for exporting scene renders (WebGL pixel buffers) to PNGs in a browser environnment.
import * as core from 'ts-app-core';
core.logger.debug('scene.exporter.png loaded');

@core.classLogger.LogClass()
export default class ScenePNGExporter {
  frame: string;
  
  constructor(frame: string) {
    this.frame = frame;
  }

  @core.classLogger.Log()
  async export(): Promise<void> {
    const a = document.createElement('a');
    a.href = this.frame;
    a.download = `scene.${new Date().getTime()}.png`; // TODO same as headless
    a.click();
  }
}