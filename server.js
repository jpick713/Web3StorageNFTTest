const express = require('express'); //Line 1
const app = express(); //Line 2
require('dotenv').config();
const port = process.env.SERVER_PORT || 6000;
const fs = require('fs');

app.listen(port, () => console.log(`Listening on port ${port}`)); 

// create a GET route
app.get('/welcome', (req, res) => {
    

  res.send({welcome: "Welcome to Discovery Test dApp", token : process.env.WEB3STORAGE_TOKEN}); 
});