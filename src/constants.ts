// This file is responsible for defining package constants.
import * as core from 'ts-app-core';
core.logger.debug('constants loaded');

export module scene { 
  export const defaultCameraName = 'Default Camera';
  export const defaultCameraLocation = [0, 0, -10];
  export const headlessViewportWidth = 800; //1024;
  export const headlessViewportHeight = 600; //768;
}

export module strings {
  export const notImplementedError = 'Not implemented.';
}