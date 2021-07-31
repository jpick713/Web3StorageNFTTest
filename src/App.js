import NFTStore from './abis/NFTStore.json';
import DiscoveryMergeNFT from './abis/DiscoveryMergeNFT.json';
import QuestCompleteNFT from './abis/QuestCompleteNFT.json';
import './App.css';
import { render } from '@testing-library/react';
import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import parse from 'html-react-parser';


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
      storageToken : "",
      dbText : "",
      quest_1_Text : "",
      quest_2_Text : "",
      quest_3_Text : ""

    }

    this.storeIPFS = this.storeIPFS.bind(this);
    this.returnData = this.returnData.bind(this);
  }
  
  async componentDidMount() {
    
    await this.loadWeb3();
    await this.loadBlockchainData();
    this.callBackendAPI()
      .then(res => this.setState({ data: res.welcome, storageToken : res.token }))
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
    const networkQuestNFTData = QuestCompleteNFT.networks[networkId]
    const networkDiscoveryMergeNFTData = DiscoveryMergeNFT.networks[networkId];
    
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
          
        
          </header>
        </div>
        <div>
        {this.state.currentCID}
        
        </div>
          <div className="columns">
            <div className="cols" style={{width: "5%", textAlign: "center"}}></div>
		        <div className="cols" style={{width: "20%", textAlign: "center"}}>
              <Button variant = "success" size = "lg" onClick = {this.storeIPFS}>Save Quest Data</Button>
            </div>
            
            <div className="cols" style={{width: "20%", textAlign: "center"}}>
              <Button variant = "info" size = "lg" onClick = {this.returnData} >Get Quest Data</Button>
            </div>
            <div className="cols" style={{width: "20%", textAlign: "center"}}>
              web3Storage API Key:

            </div>
            <div className="cols" style={{width: "30%", maxWidth: "250px", overflowX: "scroll", textAlign: "center"}}>
                {this.state.storageToken}
            </div>

          </div>

          <div className="columns" style={{backgroundColor : "green", color: "beige", marginTop: "2em", border:"2px solid black"}}>
            <div className="cols" style={{width: "1%"}}></div>
		        <div className="cols" style={{width: "49%", borderRight: "2px solid white"}}>
              <div className="mini-container">
                <div className = "mini-columns">
                <h4 style={{textAlign : "center", width: "100%"}}><em><u>Polygon Quest</u></em></h4>
                </div>
                <div className="mini-columns" style = {{marginTop: "0.25em"}}>
                  <div className = "mini-cols" style={{width : "50%", textAlign : "right", paddingRight:"0.5em"}}>
                    Quest_1 - type "Polygon-1" exactly:
                  </div>
                  <div className = "mini-cols" style={{width : "50%", textAlign : "center"}}>
                    <input type = "text" style ={{width: "98%", backgroundColor : "beige"}} value = {this.state.quest_1_Text} placeholder = "enter text for quest 1" onChange = {(e) => {this.setState({quest_1_Text : e.target.value})}}/> 
                  </div>
                  
                </div>
                <div className="mini-columns" style = {{marginTop: "0.5em"}}>
                  <div className = "mini-cols" style={{width : "50%", textAlign : "right", paddingRight:"0.5em"}}>
                  Quest_2 - type "Polygon-2" exactly:
                  </div>
                  <div className = "mini-cols" style={{width : "50%", textAlign : "center"}}>
                    <input type = "text" style ={{width: "98%", backgroundColor : "beige"}} value = {this.state.quest_2_Text} placeholder = "enter text for quest 2" onChange = {(e) => {this.setState({quest_2_Text : e.target.value})}}/> 
                  </div>
                </div>
                <div className="mini-columns" style = {{marginTop: "0.5em"}}>
                  <div className = "mini-cols" style={{width : "50%", textAlign : "right", paddingRight:"0.5em"}}>
                  Quest_3 - type "Polygon-3" exactly:
                  </div>
                  <div className = "mini-cols" style={{width : "50%", textAlign : "center"}}>
                    <input type = "text" style ={{width: "98%", backgroundColor : "beige"}} value = {this.state.quest_3_Text} placeholder = "enter text for quest 3" onChange = {(e) => {this.setState({quest_3_Text : e.target.value})}}/> 
                  </div>
                </div>
                
                <div className="mini-columns" style = {{marginTop: "0.5em", marginBottom: "0.25em"}}>
                  
                </div>
              </div>
            </div>

            <div className="cols" style={{width: "49%"}}>
              <div className="mini-container">
                <div className="mini-columns">
                  <h4 style={{textAlign : "center", width: "100%"}}><em><u>Quests Completed by You</u></em></h4>
                </div>
                <div className = "mini-columns">
                  <div className = "mini-cols" style={{width : "1%"}}></div>
                  <div className = "mini-cols" style={{width : "96%", maxHeight: "150px", overflowY: "scroll", backgroundColor: "gainsboro"}}>
                    <Table striped bordered hover size="sm" >
                      <thead>
                        <tr>
                          <th>Quest</th>
                          <th>Token URI</th>
                          <th>Date Completed</th>
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
