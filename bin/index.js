#!/usr/bin/env node
'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var yParser = _interopDefault(require('yargs-parser'));
var signale = _interopDefault(require('signale'));
var semver = _interopDefault(require('semver'));

const getFilesTypes = {
  cachedFiles: 1,
  stagedFiles: 2,
};

function getFiles(getFileType) {
  const execSync = require('child_process').execSync;
  const path = require('path');

  const mdFiles = [];
  switch (getFileType) {
    case getFilesTypes.cachedFiles:
      execSync('git ls-files -z', {
        encoding: 'utf8',
      })
        // \0 line termination on output and do not quote filenames. See OUTPUT below for more information.
        .split(String.fromCharCode(0))
        .forEach(d => {
          /\.md$/.test(path.extname(d)) && mdFiles.push(d);
        });

      break;
    case getFilesTypes.stagedFiles:
      let skip = false;
      execSync('git status -sz', {
        encoding: 'utf8',
      })
        // When the -z option is given, pathnames are printed as is and without any quoting and lines are terminated with a NUL (ASCII 0x00) byte.
        .split(String.fromCharCode(0))
        .forEach(d => {
          if (!skip) {
            let fpath = d.substring(3);
            // 1.暂存区的文件，2.修改或增加或改名的文件，3.md文件
            switch (d[0]) {
              case 'R':
                skip = true;
              case 'M':
              case 'A':
                /\.md$/.test(path.extname(fpath)) && mdFiles.push(fpath);
                break;
            }
          } else {
            skip = false;
          }
        });
      break;
    default:
      break;
  }
  return mdFiles;
}

function panguFiles(filesPath) {
  const fs = require('fs');
  const path = require('path');
  const remark = require('remark');
  const pangu = require('remark-pangu');

  const renamedFileList = [],
    ext = '.md';
  filesPath.forEach(fpath => {
    let fname = path.basename(fpath, ext),
      fdir = path.dirname(fpath),
      fcontent = fs.readFileSync(fpath),
      vfcontent = remark()
        .use(pangu)
        .processSync(fcontent),
      vfname = String(
        remark()
          .use(pangu)
          .processSync(fname)
      ).trim(),
      vfpath = path.resolve(fdir, vfname + ext);

    fs.writeFileSync(fpath, String(vfcontent));
    if (vfname !== fname) {
      renamedFileList.push(vfpath);
      fs.renameSync(fpath, vfpath);
    }
  });
  return renamedFileList;
}

function gitAddFiles(filesPath) {
  const execSync = require('child_process').execSync;

  filesPath.length && ``;
  execSync(`git add ${filesPath.map(d => `"${d}"`).join(' ')}`, {
    encoding: 'utf8',
  });
}

var doPangu = opts => {
  const path = require('path');
  const readline = require('readline');
  const signale$$1 = require('signale');

  const root = process.cwd();

  let filesRelativePath, filesPath, renamedFilesPath;

  // 选择md文件
  console.log('待处理文件：');
  if (opts.allCachedFiles) {
    filesRelativePath = getFiles(getFilesTypes.cachedFiles);
  } else if (opts.onlyStagedFiles) {
    filesRelativePath = getFiles(getFilesTypes.stagedFiles);
  }
  filesPath = filesRelativePath.map(d => path.join(root, d));

  if (!filesRelativePath.length) {
    console.log('暂存区无 Markdown 文件');
  } else {
    console.log(filesRelativePath.join('\n'));
  }

  // 处理md文件
  const main = (function*() {
    if (opts.assumeyes) {
      renamedFilesPath = panguFiles(filesPath);
      gitAddFiles(filesPath.concat(...renamedFilesPath));
    } else {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      let ans = yield rl.question('是否修改排版[Y/n]? ', answer => main.next(answer));
      if ('Y' == ans) {
        renamedFilesPath = panguFiles(filesPath);
      } else {
        signale$$1.info('do-pangu 停止');
        process.exit(1);
      }

      ans = yield rl.question('是否将修改排版的文件添加到暂存区[Y/n]? ', answer =>
        main.next(answer)
      );
      if ('Y' == ans) {
        gitAddFiles(filesPath.concat(...renamedFilesPath));
      } else {
        signale$$1.info('do-pangu 停止');
        process.exit(1);
      }

      rl.close();
    }
  })();
  main.next();
};

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
//# sourceMappingURL=index.js.map
