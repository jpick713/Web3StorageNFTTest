pragma solidity >=0.5.0 <0.9.0;

/**
 * @title QuestCompleteNFT
 * @dev NFTs for completing course content on Discovery
*/

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./NFTStore.sol";
import "./ChainlinkNFT.sol";

contract QuestCompleteNFT is ERC721{

    NFTStore public masterStore;
    ChainlinkNFT public checkNFT;
    uint tokenID;
    mapping (string => mapping (address => bool)) public NFTExists; // check if NFT already minted for this quest for this address/DID
    mapping (address => mapping (string => string)) public getNFTURIsByAddress; //allows retrieval of URIs by address and quest
    mapping (address => mapping(string => Quest)) public Quests; //allows retrieval of Quest metadata in one struct. Can remove once NFT.storage is used

    struct Quest {
        address receiver;
        string quest;
        string URI;
        uint timestamp;
        bool exists;
    }


    event NFTMinted(address indexed _to, string indexed _tokenURI);

    constructor(address _masterStoreAddress) ERC721("CompletedDiscoveryQuest", "CDQ") public{
        masterStore = NFTStore(_masterStoreAddress);
        bool adminCheck = masterStore.admins(msg.sender);
        require(adminCheck, "deployer can't make NFT");
    }

    function mintToken(address _to , string memory _tokenURI, string memory questName, string memory _did) public {
        //access control logic with chainlink?
        require(masterStore.whiteList(_to), "address is not registered!");
        require(masterStore.approvedQuests(questName), "this quest is not valid");
        require(!NFTExists[questName][_to], "this address already has an NFT for this quest!");
        checkNFT.requestCeramicData(_did, questName);
        require(checkNFT.allowMint()==1, "Not all quizzes completed for quest");
        tokenID++;
        _mint(_to, tokenID);
        NFTExists[questName][_to] = true;
        getNFTURIsByAddress[_to][questName] = _tokenURI;
        Quest memory quest_to_add = Quest({
            receiver : _to,
            quest : questName,
            URI : _tokenURI,
            timestamp : block.timestamp,
            exists : true
        });
        Quests[_to][questName]= quest_to_add;
        emit NFTMinted(_to, _tokenURI);
    }
}