// TODO https://stackoverflow.com/questions/46816898/how-do-i-implement-typescript-webdriverio-for-the-spectronclient but for tauri and using nodejs built-in tests

/*
import test from 'node:test';
import assert from 'node:assert';
import * config from '../../../config/aws.config.infra';
import * as env from '../env';

test.beforeEach((_test) => {});

test('test headless babylon renderer single frame', (_test) => {
  const rendererConfig: RendererConfig = {
    rendererLibrary: 'babylon',
    //sceneElementID: 'scene',
    headless: true, 
    loop: false
  };

  core.logger.debug('rendererConfig', JSON.stringify(rendererConfig));

  const scene = new TestScene(rendererConfig);

  let levelLoaded = false;

  const level = new TestLevel(scene);
  await level.load(async () => { levelLoaded = true; }); // Renders once.

  await scene.saveSceneFrame(level.pixels!, rendererConfig.exportConfig);

  let anotherLevelLoaded = false;

  const anotherTestLevel = new AnotherTestLevel(scene);
  await anotherTestLevel.load(async () => { anotherLevelLoaded = true; }); // Renders once.

  await scene.saveSceneFrame(anotherTestLevel.pixels!, rendererConfig.exportConfig);

  _test.is(levelLoaded, true);
  _test.is(anotherLevelLoaded, true);
});
*/