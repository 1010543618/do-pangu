const pkg = require('./package.json');

export default {
    input: "./src/index.js",
    external: Object.keys(pkg.dependencies),
    output: {
        file: "./bin/index",
        format: "cjs",
        banner: '#!/usr/bin/env node',
        sourcemap: true
    }
};