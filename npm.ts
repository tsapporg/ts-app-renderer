const babylonVersion = '5.48.0', // Sumerian hosts requires '4.2.0' version and we need '5.38.0'.
  threeVersion = '0.150.1'; // Sumerian hosts requires '0.127.0' version and we need '0.144.0'.

const npmPackage: any = {
  name: 'ts-app-renderer',
  version: '0.0.0',
  description: 'spatial-web-starter application renderer',
  private: false,
  license: 'MIT',
  type: 'module',
  exports: {
    '.': './src/index.ts'
  },
  types: './src/index.ts',
  /*
  publishConfig: {
    exports: {
      '.': './dist/index.js'
    },
    types: './dist/index.d.ts'
  },
  */
  dependencies: {
    // App:
    'ts-app-logger': '../ts-app-logger',
    'ts-app-filesystem': '../ts-app-filesystem',

    // Cross-component communication:
    //'event.es6': '1.3.5',
    'ts-bus': '2.3.1',

    // Renderers (used in examples):
    'three': threeVersion,
    '@types/three': '0.149.0',
    
    '@babylonjs/core': babylonVersion,
    '@babylonjs/loaders': babylonVersion,
    '@babylonjs/materials': babylonVersion,
    '@babylonjs/post-processes': babylonVersion,
    '@babylonjs/procedural-textures': babylonVersion,
    '@babylonjs/serializers': babylonVersion,
    '@babylonjs/gui': babylonVersion,
    '@babylonjs/inspector': babylonVersion,
    'filament': '1.31.3',
    'gltumble': '1.0.1',
    'gl-matrix': '3.4.3',
    '@webgpu/types': '0.1.26'
  },
  devDependencies: {
    'typescript': '4.8.4',
    '@types/node': '18.11.18', //TODO 18.2.1?
    'ts-node': '10.9.1',

    // Cross-platform build support:
    'shx': '0.3.4', // Used to invoke cross-platform build commands.
    'del': '5.0.0', // Used for cross-platform rm.
    'cross-env': '5.2.1' // Used to set cross-platform env variables.
  }
}

export default { npmPackage }