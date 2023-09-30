const babylonVersion = '5.48.0',
  threeVersion = '0.150.1'; 

const npmPackage: any = {
  name: 'ts-app-renderer',
  version: '0.0.0',
  private: false,
  license: 'MIT',
  type: 'module',
  exports: {
    '.': './src/index.ts'
  },
  types: './src/index.ts',
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
  }
}

export default { npmPackage }