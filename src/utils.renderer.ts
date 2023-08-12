// This file is responsible for...
import * as core from 'ts-app-core';
core.logger.debug('utils.renderer loaded');

// We only know the renderer at runtime so we are constantly determining logic based on our renderer.
// In practice you'll probably only be using 1 of these libraries so this will not be an issue.
export const fnForRenderer = async (rendererLibrary: string, fns: Map<string, CallableFunction>) => {
  if (!fns.has(rendererLibrary)) { throw new Error('TODO programmer error'); }

  const fn = fns.get(rendererLibrary)!;

  await fn();
}