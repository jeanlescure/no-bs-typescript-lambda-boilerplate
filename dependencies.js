const fs = require('fs');

const pkg = require('./package.json');

const depsPkg = {};

Object.keys(pkg).filter((k) => k !== 'devDependencies').forEach((k) => {
  depsPkg[k] = pkg[k];
});

fs.writeFileSync('dist/package.json', JSON.stringify(depsPkg, null, 2));
