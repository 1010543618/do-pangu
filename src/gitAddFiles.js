export default function(filesPath) {
  const execSync = require('child_process').execSync;

  filesPath.length && ``;
  execSync(`git add ${filesPath.map(d => `"${d}"`).join(' ')}`, {
    encoding: 'utf8',
  });
}
