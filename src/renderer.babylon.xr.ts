// @ts-nocheck
// This file is responsible for XR rendering when using Babylon. 
// Reference(s): 
// * https://doc.babylonjs.com/features/featuresDeepDive/webXR/webXRExperienceHelpers
// * https://github.com/kaliatech/webxr-tests-3
// * https://github.com/aws-amplify/amplify-js/tree/main/packages/xr/src
import * as log from 'ts-app-logger';
log.debug('renderer.babylon.xr loaded');

import { Scene as BabylonScene } from '@babylonjs/core/scene';
import { Engine as BabylonEngine } from '@babylonjs/core/Engines/engine';
import { WebXRDefaultExperience } from '@babylonjs/core/XR/webXRDefaultExperience';
//import { WebXRFeatureName } from '@babylonjs/core/XR/webXRFeaturesManager';
import { Nullable } from '@babylonjs/core/types';
import { Observer } from '@babylonjs/core/Misc/observable';
import { WebXRState } from '@babylonjs/core/XR/webXRTypes';
import { WebXRInputSource } from '@babylonjs/core/XR/webXRInputSource';
import { WebXRAbstractMotionController } from '@babylonjs/core/XR/motionController/webXRAbstractMotionController';

@log.LogClass()
export default class BabylonXRRenderer { //IXRRenderer {
  private engine: BabylonEngine;
  private scene: BabylonScene;

  private webXrDefaultExp?: WebXRDefaultExperience;
  private webXRStateObserver: Nullable<Observer<WebXRState>> = null;
  private onControllerAddedObserver?: Nullable<Observer<WebXRInputSource>> = null;
  private onControllerRemovedObserver?: Nullable<Observer<WebXRInputSource>> = null;
  private leftInputSource?: WebXRInputSource;
  private leftController?: WebXRAbstractMotionController;
  private rightInputSource?: WebXRInputSource;
  private rightController?: WebXRAbstractMotionController;

  constructor(engine: BabylonEngine, scene: BabylonScene) { 
    this.engine = engine;
    this.scene = scene;
  }

  @log.Log()
  async init() {
    this.webXrDefaultExp = await WebXRDefaultExperience.CreateAsync(this.scene, {
      optionalFeatures: true
    });
    
    this.webXRStateObserver = this.webXrDefaultExp.baseExperience.onStateChangedObservable.add((state: WebXRState) => {
      //console.log('webXrOnStateChange', WebXRState[state])
      //this.appBus.publish(WebXRStateChangedEvent({ state }))
    });

    this.setupControllers();
  }

  private setupControllers() {
    this.onControllerAddedObserver = this.webXrDefaultExp?.input.onControllerAddedObservable.add(
      (controller: WebXRInputSource) => {
        // Hands are also controllers. Do they get meshes?
        const isHand = controller.inputSource.hand;
        if (isHand) { return };

        controller.onMotionControllerInitObservable.add((motionController: WebXRAbstractMotionController) => {
          const isLeft = motionController.handedness === 'left';

          controller.onMeshLoadedObservable.add(() => {
            if (isLeft) {
              this.leftInputSource = controller;
              this.leftController = motionController;
            } else {
              this.rightInputSource = controller;
              this.rightController = motionController;
            }

            /*
            this.appBus.publish(
              ControllersChangedEvent({ leftController: this.leftController, rightController: this.rightController }),
            )
            */
          })
        })
      },
    )

    this.onControllerRemovedObserver = this.webXrDefaultExp?.input.onControllerRemovedObservable.add(
      (controller: WebXRInputSource) => {
        if (controller === this.leftInputSource) {
          this.leftInputSource = undefined;
          this.leftController = undefined;
        } else if (controller === this.rightInputSource) {
          this.rightInputSource = undefined;
          this.rightController = undefined;
        } else {
          console.error('Unxpected input source removal.');
        }

        /*
        this.appBus.publish(
          ControllersChangedEvent({ leftController: this.leftController, rightController: this.rightController }),
        )
        */
      },
    )
  }

  @log.Log()
  async dispose() {
    if (this.webXrDefaultExp) {
      await this.webXrDefaultExp.baseExperience.exitXRAsync();
      
      this.webXrDefaultExp.baseExperience.onStateChangedObservable.remove(this.webXRStateObserver);
      if (this.onControllerAddedObserver) { this.webXrDefaultExp.input.onControllerAddedObservable.remove(this.onControllerAddedObserver); }
      if (this.onControllerRemovedObserver) { this.webXrDefaultExp.input.onControllerRemovedObservable.remove(this.onControllerRemovedObserver); }
    }

    if (this.leftInputSource) {
      this.leftInputSource.onMotionControllerInitObservable.clear();
      this.leftInputSource.onMeshLoadedObservable.clear();
    }

    if (this.rightInputSource) {
      this.rightInputSource.onMotionControllerInitObservable.clear();
      this.rightInputSource.onMeshLoadedObservable.clear();
    }

    // Must exit XR before calling dispose on engine.
    if (this.webXrDefaultExp) {
      await this.webXrDefaultExp.baseExperience.exitXRAsync();
    }
  }
}