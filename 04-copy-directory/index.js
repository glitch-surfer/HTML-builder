const { copyFile, readdir } = require('fs/promises');
const fsProm = require('fs/promises');
const fs = require('fs');
const path = require('path');
const folderPath = path.join(__dirname, 'files');
//previous solution
/* const copyFolder = (folder) => {
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
}; */

const makeDir = async (folder) => {
  await fsProm.rm(folder, { recursive: true, force: true });
  await fsProm.mkdir(folder, { recursive: true });
};

const copyFolder = async (folderPath) => {
  const newFolder = `${folderPath}-copy`;
  await makeDir(newFolder);

  const folderData = await readdir(folderPath);
  for (const file of folderData) {
    const pathToFile = path.join(folderPath, file);
    fs.stat(pathToFile, (err, stats) => {
      if (err) throw err;
      if (stats.isFile()) {
        copyFile(pathToFile, path.join(newFolder, file));
      } //no need recursive function in this task
      /* else {
        copyFolder(path.join(newFolder, file), pathToFile);
      } */
    });
  }
};

copyFolder(folderPath);
