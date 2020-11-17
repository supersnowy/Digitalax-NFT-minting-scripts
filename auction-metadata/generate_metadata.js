require('dotenv').config();
const fs = require('fs-extra');
const path = require('path');
const junk = require('junk');

const pinToIpfs = require('./services/pinningService.js');

(async function runScript() {

  console.log('Generating metadata');

  const CHILDREN_ROOT_PATH = './token-data/children';

  const childrenDataFolders = fs.readdirSync(CHILDREN_ROOT_PATH);

  childrenDataFolders.forEach((folder, i) => {
    if (junk.not(folder)) {
      console.log('folder', folder, i);

      // grab the child folder
      const folderMetadata = JSON.parse(fs.readFileSync(`${CHILDREN_ROOT_PATH}/${folder}/metadata.json`));
      console.log('folderMetadata', folderMetadata);

      // grab the child master token URI image
      const childImage = fs.readFileSync(`${CHILDREN_ROOT_PATH}/${folder}/${folderMetadata.files.image}`);
      console.log('ChildImage size', childImage.length); // TODO validate > 0 ?

      // FIXME
      // pushing images to IPFS
      // construct JSON
      // pushing metadata to IPFS + Subgraph
      // hash

    }
  });


})();
