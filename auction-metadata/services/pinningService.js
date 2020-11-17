const fs = require('fs-extra');
const path = require('path');
const junk = require('junk');

const pinataProvider = require('../providers/pinata');
const PinataIpfsService = require('./PinataIpfsService');
const {syncHashToSubgraph} = require('./theGraphSyncService');

const ipfsService = new PinataIpfsService(pinataProvider);

module.exports = {
  pinFileToIpfs: async function (file, subgraphPin = false) {

    console.log(`Uploading file to Pinata`);
    const readableStreamForFile = fs.createReadStream(file);
    const fileResult = await ipfsService.pushFileToPinata(readableStreamForFile);

    if (subgraphPin) {
      console.log('\nPinning to subgraphs node');
      await syncHashToSubgraph({
        fileList: [fileResult.result.IpfsHash]
      });
    }

    console.log('Done!');
    return fileResult.result.IpfsHash;
  },

  pinJsonToIpfs: async function (metadata, subgraphPin = false) {
    const result = await ipfsService.pushJsonToPinata(metadata);
    console.log(`You can find the metadata at: ${result.pinataIpfsUrl}`);

    if (subgraphPin) {
      console.log('\nPinning to subgraphs node');
      await syncHashToSubgraph({
        fileList: [result.result.IpfsHash]
      });
    }

    console.log('Done!');
    return result.result.IpfsHash;
  }
};
