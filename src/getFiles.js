export const getFilesTypes = {
  cachedFiles: 1,
  stagedFiles: 2,
};

export default function(getFileType) {
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
