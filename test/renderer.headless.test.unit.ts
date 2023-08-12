import * as core from 'ts-app-core';
core.log.configure();
core.logger.debug('renderer.test.unit.headless loaded');

import test from 'node:test';
import assert from 'node:assert';

import { RendererConfig } from '../src/index';
import TestScene from './scene.test';
import TestLevel from './level.test';

test('test headless babylon renderer single frame', async (_test) => {
  const rendererConfig: RendererConfig = {
    rendererLibrary: 'babylon',
    sceneElementID: 'scene',
    headless: true, 
    loop: false
  };

  core.logger.debug('rendererConfig', JSON.stringify(rendererConfig));

  const scene = new TestScene(rendererConfig);

  const testLevelLoadedDeferred = new Deferred();
  const testLevel = new TestLevel(scene, async () => { 
    testLevelLoadedDeferred.resolve();
  });
  await testLevel.load(); // Renders once.
  await scene.saveSceneFrame(testLevel.pixels!, rendererConfig.exportConfig);

  //await testLevel.validateSceneFrame();

  const anotherLevelLoadedDeferred = new Deferred();
  const anotherTestLevel = new TestLevel(scene, async () => { 
    anotherLevelLoadedDeferred.resolve();
  });
  await anotherTestLevel.load(); // Renders once.
  await scene.saveSceneFrame(anotherTestLevel.pixels!, rendererConfig.exportConfig);

  //await anotherTestLevel.validateSceneFrame();

  await testLevelLoadedDeferred.promise;
  await anotherLevelLoadedDeferred.promise;

  assert.strictEqual(testLevelLoadedDeferred.resolved, true);
  assert.strictEqual(anotherLevelLoadedDeferred.resolved, true);
});

class Deferred {
  promise: Promise<void>;
  private _resolve: any;
  private _reject: any;
  resolved: boolean = false;
  rejected: boolean = false;

  constructor() {
    this.promise = new Promise((resolve, reject)=> {
      this._reject = reject
      this._resolve = resolve
    });
  }

  resolve(): any {
    this.resolved = true;
    return this._resolve();
  }

  reject(): any {
    this.rejected = true;
    return this._reject();
  }
}