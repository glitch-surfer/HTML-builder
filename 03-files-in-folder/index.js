const fs = require('fs');
const { readdir } = require('fs/promises');
const path = require('path');
const secretFolderPath = path.join(__dirname, 'secret-folder');

readdir(secretFolderPath).then((data) => {
  data.forEach( file => {
    const pathToFile = path.join(secretFolderPath, file);
    const parsedFile = path.parse(pathToFile);

    fs.stat(pathToFile, (err, stats) => {
      if(err) throw err;
      if(stats.isFile()) {
        console.log(` ${parsedFile.name} | ${parsedFile.ext} | ${stats.size} байт`);
      }
    });
  });
});