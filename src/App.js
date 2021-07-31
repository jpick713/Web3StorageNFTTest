import NFTStore from './abis/NFTStore.json';
import DiscoveryMergeNFT from './abis/DiscoveryMergeNFT.json';
import QuestCompleteNFT from './abis/QuestCompleteNFT.json';
import './App.css';
//import { render } from '@testing-library/react';
//import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import parse from 'html-react-parser';
import { Web3Storage, getFilesFromPath, File} from 'web3.storage';
require('dotenv').config();

var Web3 = require('web3');

class App extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      data: null,
      accounts: null,
      storeContract: null,
      questNFTContract:null,
      discoveryMergeNFTContract:null,
      currentCID : "",
      storageToken : process.env.WEB3STORAGE_TOKEN || "",
    }

    this.storeIPFS = this.storeIPFS.bind(this);
    this.returnData = this.returnData.bind(this);
  }
  
  async componentDidMount() {
    
    await this.loadWeb3();
    await this.loadBlockchainData();
    this.callBackendAPI()
      .then(res => this.setState({ data: res.welcome }))
      .catch(err => console.log(err));
    this.setEventListeners();
  }

    // fetching the GET route from the Express server which matches the GET route from server.js
  callBackendAPI = async () => {
    const response = await fetch('/welcome');
    const body = await response.json();
         
    if (response.status !== 200) {
      throw Error(body.message)
    }
    return body;
  };
  
  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    // Network ID
    const networkId = await web3.eth.net.getId()
    const networkNFTStoreData = NFTStore.networks[networkId]
    const networkQuestNFTData = QuestCompleteNFT.networks[networkID]
    const networkDiscoveryMergeNFTData = DiscoveryMergeNFT.networks[networkID];
    
    if(networkNFTStoreData) {
      // Assign contract
      const storeContract = new web3.eth.Contract(NFTStore.abi, networkNFTStoreData.address);
      const questNFTContract = new web3.eth.Contract(QuestCompleteNFT.abi, networkQuestNFTData.address);
      const discoveryMergeNFTContract = new web3.eth.Contract(DiscoveryMergeNFT.abi, networkDiscoveryMergeNFTData.address);
      this.setState({storeContract, questNFTContract , discoveryMergeNFTContract});}
      else {
      window.alert('County contract not deployed to detected network.')
    }
  }

  setEventListeners(){
  window.ethereum.on('accountsChanged', async (accounts) => {
    this.setState({account : accounts[0]});
  });
}

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

storeIPFS = async () => {
  /*
  const hash = await SDS.students.put( `test-${this.state.counter}`, {text: `${this.state.dbText}`, studentID : `s${Math.floor(Math.random()*100) + 1}`});
  alert(hash);
  this.state.counter++;
  this.setState({dbText : ""});*/
}

returnData = async () => {
  /*
  const value = SDS.students.get(`test-${this.state.counter-1}`);
  alert(`text: ${value.text} and studentID : ${value.studentID}`);
  */
}


  render(){
    return (
      <div className = "Container">
        <div className="App">
          <header className="App-header">
          <h2>
          {this.state.data}
          </h2>
          
        <h1 className='flex-auto ma0 tr f3 fw2 montserrat aqua'>IPFS React</h1>
          </header>
        </div>
        <div>
        {this.state.currentCID}
        
        </div>
          <div className="columns">
            <div className="cols" style={{width: "5%", textAlign: "center"}}></div>
		        <div className="cols" style={{width: "20%", textAlign: "center"}}>
              <Button variant = "success" size = "lg" onClick = {this.storeIPFS}>Store Data</Button>
            </div>
            <div className="cols" style={{width: "20%", textAlign: "center"}}>
              <input type = "text" style ={{width: "100%", backgroundColor : "beige"}} value = {this.state.dbText} placeholder = "enter text to store" onChange = {(e) => {this.setState({dbText : e.target.value})}}/>

            </div>

            <div className="cols" style={{width: "20%", textAlign: "center"}}>
              <Button variant = "info" size = "lg" onClick = {this.returnData} >Get Data</Button>
            </div>
            <div className="cols" style={{width: "30%", textAlign: "center"}}>
                {parse(this.state.studentString)}
            </div>

          </div>

          <div className="columns" style={{backgroundColor : "green", color: "beige", marginTop: "2em", border:"2px solid black"}}>
            <div className="cols" style={{width: "1%"}}></div>
		        <div className="cols" style={{width: "49%", borderRight: "2px solid white"}}>
              <div className="mini-container">
                <div className = "mini-columns">
                <h4 style={{textAlign : "center", width: "100%"}}><em><u>Initiate a Deal</u></em></h4>
                </div>
                <div className="mini-columns" style = {{marginTop: "0.25em"}}>
                  <div className = "mini-cols" style={{width : "20%", textAlign : "right"}}>
                    Company Addr:&ensp;
                  </div>
                  
                </div>
                <div className="mini-columns" style = {{marginTop: "0.5em"}}>
                  <div className = "mini-cols" style={{width : "20%", textAlign : "right"}}>
                    Device IMEI for Deal:&ensp;
                  </div>
                  
                </div>
                <div className="mini-columns" style = {{marginTop: "0.5em"}}>
                  <div className = "mini-cols" style={{width : "20%", textAlign : "right"}}>
                    Deal Length:&ensp;
                  </div>
                </div>
                <div className="mini-columns" style = {{marginTop: "0.5em"}}>
                  <div className = "mini-cols" style={{width : "20%", textAlign : "right", paddingRight:"0.5em"}}>
                    Max # Successes (12 max allowed in demo):
                  </div>
                  
                </div>
                <div className="mini-columns" style = {{marginTop: "0.5em", marginBottom: "0.25em"}}>
                  
                </div>
              </div>
            </div>

            <div className="cols" style={{width: "49%"}}>
              <div className="mini-container">
                <div className="mini-columns">
                  <h4 style={{textAlign : "center", width: "100%"}}><em><u>Deals Originated by You</u></em></h4>
                </div>
                <div className = "mini-columns">
                  <div className = "mini-cols" style={{width : "1%"}}></div>
                  <div className = "mini-cols" style={{width : "96%", maxHeight: "150px", overflowY: "scroll", backgroundColor: "gainsboro"}}>
                    <Table striped bordered hover size="sm" >
                      <thead>
                        <tr>
                          <th>UUID</th>
                          <th>Company address</th>
                          <th>Company ID</th>
                        </tr>
                      </thead>
                      <tbody style={{fontSize : "93%"}}>
                        
                      </tbody>        
                    </Table>
                  </div>
                  <div className = "mini-cols" style={{width : "1%"}}></div>
                </div>
              </div>
            </div>
            <div className="cols" style={{width: "1%"}}></div>
          </div>          
      </div>
    );
  }
}

export default App;
