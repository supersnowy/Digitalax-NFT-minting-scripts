const pinataSDK = require('@pinata/sdk');
PINATA_API="0e0741759b51070e7b0e";
PINATA_SECRET="5fae8e8890f1cb2a556aba4d7c3090cab1f9e3a505de4ed2138514b7d6b59779";

const pinata = pinataSDK(PINATA_API, PINATA_SECRET);

function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

pinata
  .testAuthentication()
  .then((result) => console.log(`Successfully connected to pinata`, result));
console.log('hello');
const filters = {
    status : 'unpinned',
    pageLimit: 1000,
    pageOffset: 946
};

pinata.pinList(filters).then((async result => {
    // With this list we need to iterate through and pin each one!
    for (let i = 0; i < result.rows.length; i++) {
        const x = result.rows[i];
        if(!x.metadata.name){
            pinata.pinByHash(x.ipfs_pin_hash).then((result2 => {
                console.log(result2);
            }));
        } else {
            pinata.pinByHash(x.ipfs_pin_hash, {pinataMetadata: x.metadata}).then((result2 => {
                console.log(result2);

            }));
        }

        await sleep(2000);
        console.log(`The ${i} row is done.`);
    }
}));



pinata.pin
module.exports = pinata;
