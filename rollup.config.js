const pkg = require('./package.json');

export default {
  input: './src/index.js',
  external: Object.keys(pkg.dependencies),
  output: {
    banner: '#!/usr/bin/env node',
    file: './bin/index.js',
    format: 'cjs',
    sourcemap: true,
  },
};
