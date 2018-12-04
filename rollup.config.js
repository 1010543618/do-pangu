const pkg = require('./package.json');

export default {
    input: "./src/index.js",
    external: Object.keys(pkg.dependencies),
    output: {
        file: "./bin/index.js",
        format: "cjs",
        sourcemap: true
    }
};