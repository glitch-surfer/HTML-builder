const fsProm = require('fs/promises');
const fs = require('fs');
const path = require('path');
const { open, readdir, copyFile } = require('fs/promises');

const stylesPath = path.join(__dirname, 'styles');
const bundlePath = path.join(__dirname, 'project-dist');
const bundleFile = path.join(bundlePath, 'style.css');

//make direction
const makeDir = async (folder) => {
  await fsProm.rm(folder, { recursive: true, force: true });
  await fsProm.mkdir(folder, { recursive: true });
};


//make css bundle
const makeCssBundle = async (bundleFolder, assetsFolder) => {
  await fsProm.writeFile(bundleFile, '');
  const folderData = await readdir(assetsFolder);

  for (const file of folderData) {
    const pathToFile = path.join(assetsFolder, file);
    fs.stat(pathToFile, (err, stats) => {
      if (err) throw err;
      if (stats.isFile() && path.extname(pathToFile) === '.css') {
        const stream = fs.createReadStream(pathToFile, 'utf-8', (err) => {
          if (err) throw err;
        });
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
  }
};
// copy assets folder

const assetsPath = path.join(__dirname, 'assets');
const copiedAssetsPath = path.join(bundlePath, 'assets');



const copyFolder = async (bundleFolder, assetsFolder) => {
  await makeDir(bundleFolder);

  const folderData = await readdir(assetsFolder);

  for (const file of folderData) {
    const pathToFile = path.join(assetsFolder, file);
    fs.stat(pathToFile, (err, stats) => {
      if (err) throw err;
      if (stats.isFile()) {
        copyFile(pathToFile, path.join(bundleFolder, file));
      } else {
        copyFolder(path.join(bundleFolder, file), pathToFile);
      }
    });
  }
};
//maleBundleHtml 


const htmlTemplate = path.join(__dirname, 'template.html');
const componentsFolder = path.join(__dirname, 'components');


const changeStr = async (templateStr) => {
  const componentsData = await readdir(componentsFolder);
  let finalStr;
  for (const component of componentsData) {
    const tagName = component.split('.')[0];
    const componentFilePath = await open(path.join(componentsFolder, component));
    const componentFile = (await componentFilePath.readFile()).toString();
    const regexp = new RegExp(`{{${tagName}}}`);
    finalStr = finalStr ? finalStr.replace(regexp, componentFile) : templateStr.replace(regexp, componentFile);
  }
  return finalStr;
};

const makeHtmlBundle = async (template, componentsFolder, bundlePath) => {
  const bundleFile = path.join(bundlePath, 'index.html');
  

  const file = await open(template);
  const templateStr = (await file.readFile()).toString();
  const finalStr = await changeStr(templateStr);
  await fsProm.writeFile(bundleFile, finalStr);
};

const finalBundle = async () => {
  await makeDir(bundlePath);
  await makeCssBundle(bundlePath, stylesPath);
  await copyFolder(copiedAssetsPath, assetsPath);
  await makeHtmlBundle(htmlTemplate, componentsFolder, bundlePath);
};
finalBundle();

