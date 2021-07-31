pragma solidity >=0.5.0 <0.9.0;

/**
 * @title QuestCompleteNFT
 * @dev NFTs for completing course content on Discovery
*/

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./NFTStore.sol";

contract QuestCompleteNFT is ERC721{

    NFTStore public masterStore;
    mapping (string => uint[]) courseIndices;
    mapping (string => uint) latestIndex;

    constructor(address _masterStoreAddress) ERC721("CompletedDiscoveryQuest", "CDQ") public{
        masterStore = NFTStore(_masterStoreAddress);
        bool adminCheck = masterStore.admins(msg.sender);
        require(adminCheck, "deployer can't make NFT");
    } 


}