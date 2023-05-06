const { copyFile, readdir } = require('fs/promises');
const fs = require('fs');
const path = require('path');
const folderPath = path.join(__dirname, 'files');

const copyFolder = (folder) => {
  fs.mkdir(`${folder}-copy`, { recursive: true }, (err) => {
    if (err) throw err;
    readdir(`${folder}-copy`).then((data) => {
      data.forEach(file => {
        fs.unlink(path.join(`${folder}-copy`, file), (err) => {
          if(err) throw err;
        });
      });
    });
  });
  
  readdir(folder).then((data) => {
    data.forEach(file => {
      const pathToFile = path.join(folder, file);

      fs.stat(pathToFile, (err, stats) => {
        if (err) throw err;
        if (stats.isFile()) {
          copyFile(pathToFile, path.join(`${folder}-copy`, file));
        } else {
          copyFolder(pathToFile);
        }
      });
    });
  });
};
copyFolder(folderPath);
