### Auction NFT Metadata scripts

* Install dependencies `yarn`
* Create `.env` file with properties from `.env.example` 

### How to use these minting scripts ... ?

You will need node 10+ to run the scripts, and need to have access to the `pinata` setup keys, add these to a file called `.env` e.g.
```
PINATA_API=<API KEY>
PINATA_SECRET=<API SECRET>
PINATA_GATEWAY_URL=https://gateway.pinata.cloud/ipfs
```

Inside `./token-data` all child and parent NFT metadata's are held and generated

Two scripts exist, they can be run the following and are idempotent:
1. `cd auction-metadata`
2. `node ./generate_children_metadata.js` - generates all child metadata
3. `node ./generate_parent_metadata.js` - generates all parent metadata

N.B: no actually assets are stored in this repo due to file size limitations, only the raw JSON and generated IPFS hashes are stored in here.

#### Child metadata

1. Create a folder inside `/token-data/children/` with the name of the child
2. Create the `metadata.json` and fill it in accordingly
    - see `child_metadata_template.json` for template
3. Place the correct image assets inside the same template and ensure names align with the files defined in the `json` file
4. Run `node ./generate_children_metadata.js`
    - this will generate all IPFS data and produce a file in  `/token-data/children/{CHILD_NAME}/hash.json`
    - inside `hash.json` is the populated and stored IPFS hash and URI
    - this can now be referred by scripts in the [digitalax-contracts](https://github.com/DIGITALAX/digitalax-contracts) project
5. You can run the script over and over again and it will skip directories which have a `hash.json` file

#### Parent metadata

1. Create a folder inside `/token-data/parents/` with the name of the child
2. Create the `metadata.json` and fill it in accordingly
    - see `parent_metadata_template.json` for template
3. Place the correct image assets inside the same template and ensure names align with the files defined in the `json` file
    - Ensure the `fbx` file, is called `master.fbx`
4. Run `node ./generate_parent_metadata.js`
    - this will generate all IPFS data and produce a file in  `/token-data/children/{PARENT_NAME}/hash.json`
    - inside `hash.json` is the populated and stored IPFS hash and URI
    - this can now be referred by scripts in the [digitalax-contracts](https://github.com/DIGITALAX/digitalax-contracts) project
5. You can run the script over and over again and it will skip directories which have a `hash.json` file
