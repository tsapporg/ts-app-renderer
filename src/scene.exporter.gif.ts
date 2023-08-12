// This file is responsible for exporting scene renders (WebGL pixel buffers) to GIFs.
import * as core from 'ts-app-core';
core.logger.debug('scene.exporter.gif loaded');

import * as renderer from 'ts-app-renderer';
import * as asyncUtils from '../../ts-app-website/src/utils.async';

@core.classLogger.LogClass()
export default class SceneGIFExporter {
  activeViewportDimensions: renderer.viewport.Dimensions;
  frames: string[];
  
  constructor(frames: string[], viewportDimensions?: renderer.viewport.Dimensions) {
    this.frames = frames;

    if (viewportDimensions) { this.activeViewportDimensions = viewportDimensions; } else { this.activeViewportDimensions = renderer.viewport.defaultViewportDimensions; }
  }

  @core.classLogger.Log()
  async export(): Promise<void> {
    // @ts-ignore
    const gif = new window.GIF({ workers: 2, quality: 10 });

    core.logger.debug('adding frames to gif');

    await asyncUtils.forEach(this.frames, async (frame: string) => {
      const imageData = await this.convertURIToImageData(frame);

      gif.addFrame(imageData, { delay: 16 }); // TODO dynamic fps rate. 60fps static ...so difference between frames should be 1/60 of a second (in ms). 1/60 * 1000 (ms).
    });
     
    gif.on('finished', (blob: Blob) => {
      core.logger.debug('gif creation finished');

      const a = document.createElement('a');
      a.download = `scene.${new Date().getTime()}.gif`;
      a.href = URL.createObjectURL(blob);
      // See: https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes#JavaScript_access
      a.dataset.downloadurl = ['application/octet-stream', a.download, a.href].join(':');
      a.click();
    });
    
    core.logger.debug('gif creation started');

    gif.render();
  }

  private async convertURIToImageData(URI: string): Promise<ImageData> {
    return new Promise(function(resolve, reject) { 
      if (URI == null) { return reject('URI null'); } // TODO constants

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      const image = new Image();

      image.addEventListener('load', function() {
        canvas.width = image.width;
        canvas.height = image.height;

        context?.drawImage(image, 0, 0, canvas.width, canvas.height);
        
        resolve(context!.getImageData(0, 0, canvas.width, canvas.height));
      }, false);

      image.src = URI;
    });
  }
}