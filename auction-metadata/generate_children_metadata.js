require('dotenv').config();
const fs = require('fs-extra');
const junk = require('junk');

const {pinFileToIpfs, pinJsonToIpfs} = require('./services/pinningService.js');

const wait = async () => {
  return new Promise((resolve) => {
    setTimeout(resolve, 4000);
  });
};

(async function runScript() {

  await wait();

  console.log('Generating metadata');

  const CHILDREN_ROOT_PATH = './token-data/children';

  const childrenDataFolders = fs.readdirSync(CHILDREN_ROOT_PATH);

  childrenDataFolders.map(async (folder, i) => {
    const BASE_FOLDER = `${CHILDREN_ROOT_PATH}/${folder}`;

    if (junk.not(folder) && fs.lstatSync(BASE_FOLDER).isDirectory()) {
      console.log('folder', folder, i);

      const alreadyPinned = fs.existsSync(`${CHILDREN_ROOT_PATH}/hash.json`);

      // Check already processed this and skip if found
      if (alreadyPinned) {
        const folderMetadata = JSON.parse(fs.readFileSync(`${BASE_FOLDER}/hash.json`));
        console.log(`Skipping ${BASE_FOLDER} and already pinned to hash [${folderMetadata.hash}]`);
      } else {

        // grab the child folder
        const folderMetadata = JSON.parse(fs.readFileSync(`${BASE_FOLDER}/metadata.json`));
        console.log('folderMetadata', folderMetadata);

        // grab the child master token URI image
        const fullPath = `${BASE_FOLDER}/${folderMetadata.files.image}`;
        const exists = fs.existsSync(fullPath);
        if (!exists) {
          throw new Error('Image not found ' + fullPath);
        }
        console.log('ChildImage found at', fullPath);

        // Push image to IPFS
        const imageHash = await pinFileToIpfs(fullPath);
        console.log(`Pinned image from [${fullPath}] to IPFS [${imageHash}]`);

        // Generate child token metadata
        const childNftMetadata = {
          name: folderMetadata.name,
          description: folderMetadata.description,
          image: `${process.env.PINATA_GATEWAY_URL}/${imageHash}`,
          external_url: 'https://www.digitalax.xyz',
          attributes: [
            ...folderMetadata.attributes
          ]
        };

        // Pin metadata
        const tokenMetadataHash = await pinJsonToIpfs(childNftMetadata);
        console.log(`Child NFT metadata pinned [${tokenMetadataHash}]`);

        // Write file back to child folder
        fs.writeFileSync(`${CHILDREN_ROOT_PATH}/hash.json`, JSON.stringify({
          hash: tokenMetadataHash,
          uri: `${process.env.PINATA_GATEWAY_URL}/${tokenMetadataHash}`
        }, null, 2));

      }
    }
  });


})();
