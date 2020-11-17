require('dotenv').config();
const fs = require('fs-extra');
const path = require('path');
const junk = require('junk');

const {pinFileToIpfs} = require('./services/pinningService.js');

(async function runScript() {

  console.log('Generating metadata');

  const CHILDREN_ROOT_PATH = './token-data/children';

  const childrenDataFolders = fs.readdirSync(CHILDREN_ROOT_PATH);

  childrenDataFolders.map(async (folder, i) => {
    if (junk.not(folder)) {
      console.log('folder', folder, i);

      // grab the child folder
      const folderMetadata = JSON.parse(fs.readFileSync(`${CHILDREN_ROOT_PATH}/${folder}/metadata.json`));
      console.log('folderMetadata', folderMetadata);

      // grab the child master token URI image
      const fullPath = `${CHILDREN_ROOT_PATH}/${folder}/${folderMetadata.files.image}`;
      const exists = fs.exists(fullPath);
      if(!exists) {
        throw new Error("Image not found " + fullPath);
      }
      console.log('ChildImage found at', fullPath);

      // Push image to IPFS
      const imageHash = await pinFileToIpfs(fullPath);
      console.log(`Pinned image from [${fullPath}] to IPFS [${imageHash}]`);

      // FIXME
      // pushing images to IPFS
      // construct JSON
      // pushing metadata to IPFS + Subgraph
      // hash

    }
  });


})();
