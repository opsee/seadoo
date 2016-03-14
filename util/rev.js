var git = require('git-rev');
git.long(str => {
  process.stdout.write(str);
  process.exit();
});