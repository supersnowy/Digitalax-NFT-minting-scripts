const fs = require('fs-extra');
const pinataProvider = require('../providers/pinata');
const PinataIpfsService = require('./PinataIpfsService');
const {syncHashToSubgraph} = require('./theGraphSyncService');

const ipfsService = new PinataIpfsService(pinataProvider);

module.exports = {
  pinFileToIpfs: async function (file, options = {}) {

    const requiresExtension = options.requiresExtension || false;
    const pinToSubgraph = options.pinToSubgraph || false;

    console.log(`Uploading file to Pinata [${file}]`);
    const readableStreamForFile = fs.createReadStream(file);

    const fileResult = await ipfsService.pushFileToPinata(readableStreamForFile, requiresExtension);

    if (pinToSubgraph) {
      console.log('\nPinning to subgraphs node');
      await syncHashToSubgraph({
        fileList: [fileResult.result.IpfsHash]
      });
    }

    console.log(`Done [${fileResult.result.IpfsHash}]!`);
    return fileResult.result.IpfsHash;
  },

  pinJsonToIpfs: async function (metadata, pinToSubgraph = false) {
    const result = await ipfsService.pushJsonToPinata(metadata);
    console.log(`You can find the metadata at: ${result.pinataIpfsUrl}`);

    if (pinToSubgraph) {
      console.log('\nPinning to subgraphs node');
      await syncHashToSubgraph({
        fileList: [result.result.IpfsHash]
      });
    }

    console.log('Done!');
    return result.result.IpfsHash;
  }
};
