class PinataIpfsService {

  constructor(pinata) {
    this.pinata = pinata;
  }

  async pushFileToPinata(filestream, wrapWithDirectory = false) {
    const result = wrapWithDirectory
      ? await this.pinata.pinFileToIPFS(filestream)
      : await this.pinata.pinFileToIPFS(filestream, {
        pinataOptions: {
          wrapWithDirectory: wrapWithDirectory
        }
      });
    return {
      result,
      pinataIpfsUrl: `${process.env.PINATA_GATEWAY_URL}/${result.IpfsHash}`
    };
  }

  async pushJsonToPinata(json) {
    const result = await this.pinata.pinJSONToIPFS(json);
    return {
      result,
      pinataIpfsUrl: `${process.env.PINATA_GATEWAY_URL}/${result.IpfsHash}`
    };
  }
}

module.exports = PinataIpfsService;
