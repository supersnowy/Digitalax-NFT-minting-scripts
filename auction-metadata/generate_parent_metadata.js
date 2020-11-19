require('dotenv').config();
const fs = require('fs-extra');
const path = require('path');
const junk = require('junk');

const {pinFileToIpfs, pinJsonToIpfs} = require('./services/pinningService.js');

(async function runScript() {

  console.log('Generating metadata');

  const PARENT_ROOT_PATH = './token-data/parents';

  const parentDataFolders = fs.readdirSync(PARENT_ROOT_PATH);

  parentDataFolders.map(async (folder, i) => {
    const BASE_FOLDER = `${PARENT_ROOT_PATH}/${folder}`;

    if (junk.not(folder) && fs.lstatSync(BASE_FOLDER).isDirectory()) {
      console.log('folder', folder, i);

      const alreadyPinned = fs.existsSync(`${BASE_FOLDER}/hash.json`);

      // Check already processed this and skip if found
      if (alreadyPinned) {
        const folderMetadata = JSON.parse(fs.readFileSync(`${BASE_FOLDER}/hash.json`));
        console.log(`Skipping ${BASE_FOLDER} and already pinned to hash [${folderMetadata.hash}]`);
      } else {

        // grab the child folder
        const folderMetadata = JSON.parse(fs.readFileSync(`${BASE_FOLDER}/metadata.json`));
        console.log('folderMetadata', folderMetadata);

        let additionalMetadataAttributes = {};

        Promise.all(Object.keys(folderMetadata.files).map(async key => {
          let fileName = folderMetadata.files[key];

          const fullPath = `${BASE_FOLDER}/${fileName}`;
          const exists = fs.existsSync(fullPath);
          if (!exists) {
            throw new Error('File not found ' + fullPath);
            process.exit(-1);
          }
          console.log('Parent file found at', fullPath);

          // we want FBX files to have the file extension attached
          const requiresExtension = fullPath.includes('.fbx');

          // Push image to IPFS
          const fileHash = await pinFileToIpfs(fullPath, {requiresExtension});
          console.log(`Pinned file from [${fullPath}] to IPFS [${fileHash}]`);

          // record the additional metadata attribute
          additionalMetadataAttributes[key] = `${process.env.PINATA_GATEWAY_URL}/${fileHash}`;
        }))
          .then(async () => {
            // Generate child token metadata
            const parentNftMetadata = {
              name: folderMetadata.name,
              description: folderMetadata.description,
              external_url: 'https://www.digitalax.xyz',
              ...additionalMetadataAttributes,
              attributes: [
                ...folderMetadata.attributes
              ]
            };

            // Pin metadata
            const tokenMetadataHash = await pinJsonToIpfs(parentNftMetadata);
            console.log(`Parent NFT metadata pinned [${tokenMetadataHash}]`);

            // Write file back to child folder
            fs.writeFileSync(`${BASE_FOLDER}/hash.json`, JSON.stringify({
              hash: tokenMetadataHash,
              uri: `${process.env.PINATA_GATEWAY_URL}/${tokenMetadataHash}`
            }, null, 2));
          }).catch((e) => {
          throw new Error(e);
        });
      }
    }
  });


})();
