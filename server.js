const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;
const {exec} = require('child_process');
const fs = require('fs');
const EC = require('elliptic').ec;
const keccak256 = require('js-sha3').keccak256;


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



