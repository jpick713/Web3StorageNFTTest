var NFTStore = artifacts.require("./NFTStore.sol");
var DiscoveryMergeNFT = artifacts.require("./DiscoveryMergeNFT.sol");
var QuestCompleteNFT = artifacts.require("./QuestCompleteNFT.sol");

module.exports = async(deployer, network, accounts) => {
  let deployNFTStore = await deployer.deploy(NFTStore, [accounts[0], accounts[1]]);
  const contractNFTStore = await NFTStore.deployed();
  let deployMergeNFT = await deployer.deploy(DiscoveryMergeNFT, contractNFTStore.address);
  let deployQuestCompleteNFT = await deployer.deploy(QuestCompleteNFT, contractNFTStore.address);
};