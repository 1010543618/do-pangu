import yParser from 'yargs-parser';
import signale from 'signale';
import semver from 'semver';
import doPangu from './doPangu';

// Node version check
const nodeVersion = process.versions.node;
if (semver.satisfies(nodeVersion, '<6.5')) {
    signale.error(`Node version must >= 6.5, but got ${nodeVersion}`);
    process.exit(1);
}

const args = yParser(process.argv.slice(2));
const aliasMap = {
    'S': 'onlyStagedFiles', // default
    'C': 'allCachedFiles',
    'y': 'assumeyes'
};
const defaultOpts = {
    'onlyStagedFiles': true
};

let userOpts = {},
    opts = {};
for (const key in args) {
    userOpts[aliasMap[key] && !args.hasOwnProperty(aliasMap[key]) ? aliasMap[key] : key] = args[key];
}

opts = Object.assign(defaultOpts, userOpts);
doPangu(opts);