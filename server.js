const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;
const {exec} = require('child_process');
const fs = require('fs');
const EC = require('elliptic').ec;
const keccak256 = require('js-sha3').keccak256;
/*const { Web3Storage, getFilesFromPath, File} = require('web3.storage');


makeFileObjects = () => {
  // You can create File objects from a Buffer of binary data
  // see: https://nodejs.org/api/buffer.html
  // Here we're just storing a JSON object, but you can store images,
  // audio, or whatever you want!
  const obj = { hello: 'world' }
  const buffer = Buffer.from(JSON.stringify(obj));

  const files = [
    new File(['contents-of-file-1'], 'plain-utf8.txt'),
    new File([buffer], 'hello.json')
  ]
  return files
}

 storeFiles = async (files) => {
  const client = makeStorageClient()
  const cid = await client.put(files)
  console.log('stored files with cid:', cid)
  return cid
}

retrieveFiles = async (cid) => {
  const client = makeStorageClient()
  const res = await client.get(cid)
  console.log(`Got a response! [${res.status}] ${res.statusText}`)
  if (!res.ok) {
    throw new Error(`failed to get ${cid} - [${res.status}] ${res.statusText}`)
  }

  // unpack File objects from the response
  const files = await res.files()
  for (const file of files) {
    console.log(`${file.cid} -- ${file.path} -- ${file.size}`)
  }
}
*/
//const IPFS = require('ipfs');
//const OrbitDB = require('orbit-db');





// This displays message that the server running and listening to specified port
app.listen(port, () => console.log(`Listening on port ${port}`));

// create a GET route
app.get('/welcome/', (req, res) => { 

  //const dbVars = await getIPFSInfo();
    
  res.send({ welcome: 'Welcome to Discovery Data Test dApp!', token : process.env.WEB3STORAGE_TOKEN || ""}); 
});

app.get('/get_address', (req, res) => {
    
    
    res.send({currentAddr : ""});
    
});



app.get('/ipfs_info', (req, res) => {
  var data = Json.parse(fs.readFileSync('./ipfs/config'));
    /*fs.writeFile('./pebble-simulator/privKeyVerify', req.query.PrivKey, function (err) {
        if (err) return console.log(err);
      });
    
    var data = fs.readFileSync('./pebble-simulator/simulatorVerify.sh').toString().split("\n");
    data[6] = `TargetMax=${req.query.TargetMax}`;
    data[7] = `TargetMin=${req.query.TargetMin}`;
    data[61] = `START=${req.query.Start}`;
    data[62] = `DELTA=${req.query.Delta}`;
    var text = data.join("\n");
    fs.writeFile('./pebble-simulator/simulatorVerify.sh', text, function (err) {
        if (err) return console.log(err);
      });*/
    
    res.send({Identity : data.Identity.PeerID});  
})


/*
getIPFSInfo = async () => {
  const ipfsOptions = { repo: './ipfs', };
  const ipfs = await IPFS.create(ipfsOptions);
  const orbitdb = await OrbitDB.createInstance(ipfs);
  const db = await orbitdb.keyvalue('test-database');
  await db.load();
  return {retIPFS : ipfs , retDB : db}
}*/



