require('dotenv').config();
const fs = require('fs-extra');
const junk = require('junk');
const _ = require('lodash');
const walkSync = require('walk-sync');

(async function runScript() {

  console.log('Normalising fbx file names');

  const PARENT_ROOT_PATH = './token-data/parents';

  const parentDataFolders = fs.readdirSync(PARENT_ROOT_PATH);

  parentDataFolders.map(async (folder, i) => {
    const BASE_FOLDER = `${PARENT_ROOT_PATH}/${folder}`;

    if (junk.not(folder) && fs.lstatSync(BASE_FOLDER).isDirectory()) {

      // grab the child folder
      const folderMetadata = JSON.parse(fs.readFileSync(`${BASE_FOLDER}/metadata.json`));
      if (folderMetadata.animation_url) {
        throw new Error('animation_url found in ' + BASE_FOLDER);
      }

      const paths = walkSync(BASE_FOLDER, {globs: ['*.fbx']});
      paths.forEach((fbxPath) => {
        console.log(`Normalising ` + fbxPath);
        fs.renameSync(
          `${__dirname}/${BASE_FOLDER}/${fbxPath}`,
          `${__dirname}/${BASE_FOLDER}/master.fbx`
        );
      });
    }
  });


})();
