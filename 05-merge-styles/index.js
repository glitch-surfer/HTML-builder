const { readdir } = require('fs/promises');
const fs = require('fs');
const path = require('path');
const stylesPath = path.join(__dirname, 'styles');
const bundlePath = path.join(__dirname, 'project-dist');
const bundleFile = path.join(bundlePath, 'bundle.css');

const makeBundle = (folder) => {
  fs.writeFile(
    bundleFile,
    '',
    (err) => {
      if (err) throw err;
    }
  );

  readdir(folder).then((data) => {
    data.forEach(file => {
      const pathToFile = path.join(folder, file);

      fs.stat(pathToFile, (err, stats) => {
        if (err) throw err;
        if (stats.isFile() && path.extname(pathToFile) === '.css') {
          const stream = fs.createReadStream(pathToFile, 'utf-8');
          stream.on('data', data => {
            fs.appendFile(
              bundleFile,
              data,
              (err) => {
                if (err) throw err;
              }
            );
          });
        }
      });
    });
  });
};
makeBundle(stylesPath);