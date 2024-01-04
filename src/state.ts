// This file is responsible for managing renderer state.
import * as log from 'ts-app-logger';
log.debug('state loaded');

//@log.LogClass()
export class RendererState {
  //@log.Log()
  async loadOrInit() {
    return;
  }

  // TODO maybe not needed?
  // Used to stop rendering scenes that are no longer visible in the SPA.
  shouldRenderSceneId: Map<string, boolean> = new Map<string, boolean>();
}

export default RendererState;