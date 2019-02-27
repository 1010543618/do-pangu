import { default as getFiles, getFilesTypes } from './getFiles';
import panguFiles from './panguFiles';
import gitAddFiles from './gitAddFiles';

export default opts => {
  const path = require('path');
  const readline = require('readline');
  const signale = require('signale');

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
        signale.info('do-pangu 停止');
        process.exit(1);
      }

      ans = yield rl.question('是否将修改排版的文件添加到暂存区[Y/n]? ', answer =>
        main.next(answer)
      );
      if ('Y' == ans) {
        gitAddFiles(filesPath.concat(...renamedFilesPath));
      } else {
        signale.info('do-pangu 停止');
        process.exit(1);
      }

      rl.close();
    }
  })();
  main.next();
};
