const babylonVersion = '5.48.0';

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
  publishConfig: {
    main: './dist/index.mjs',
    types: './dist/index.d.ts'
  },
  dependencies: {
    // App:
    'ts-app-logger': '../ts-app-logger',

    // Renderers:
    '@babylonjs/core': babylonVersion,
    '@babylonjs/loaders': babylonVersion,
    '@babylonjs/materials': babylonVersion,
    '@babylonjs/post-processes': babylonVersion,
    '@babylonjs/procedural-textures': babylonVersion,
    '@babylonjs/serializers': babylonVersion,
    '@babylonjs/gui': babylonVersion,
    '@babylonjs/inspector': babylonVersion
  },
  devDependencies: {}
}

export default { npmPackage }