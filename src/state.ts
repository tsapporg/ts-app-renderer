// This file is responsible for managing renderer state.
import * as core from 'ts-app-core';
core.logger.debug('state loaded');

import { EventBus } from 'ts-bus';

@core.classLogger.LogClass()
export class RendererState {
  eventBus = new EventBus();

  @core.classLogger.Log()
  async loadOrInit() {
    return;
  }

  // TODO maybe not needed?
  // Used to stop rendering scenes that are no longer visible in the SPA.
  shouldRenderSceneId: Map<string, boolean> = new Map<string, boolean>();
}

export default RendererState;