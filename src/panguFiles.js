export default function(filesPath) {
  const fs = require('fs');
  const path = require('path');
  const remark = require('remark');
  const remarkPangu = require('remark-pangu');
  const pangu = require('pangu');

  const renamedFileList = [],
    ext = '.md';
  filesPath.forEach(fpath => {
    let fname = path.basename(fpath, ext),
      fdir = path.dirname(fpath),
      fcontent = fs.readFileSync(fpath),
      vfcontent = remark()
        .use(remarkPangu)
        .processSync(fcontent),
      vfname = pangu.spacing(fname).trim(),
      vfpath = path.resolve(fdir, vfname + ext);

    fs.writeFileSync(fpath, String(vfcontent));
    if (vfname !== fname) {
      renamedFileList.push(vfpath);
      fs.renameSync(fpath, vfpath);
    }
  });
  return renamedFileList;
}
