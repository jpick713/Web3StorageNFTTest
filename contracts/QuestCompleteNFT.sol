pragma solidity >=0.5.0 <0.9.0;

/**
 * @title QuestCompleteNFT
 * @dev NFTs for completing course content on Discovery
*/

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
//import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "./NFTStore.sol";
import "./ChainlinkNFT.sol";

contract QuestCompleteNFT is ERC721{

    NFTStore public masterStore;
    ChainlinkNFT public checkNFT;
    uint tokenID;
    mapping (string => mapping (address => bool)) public NFTExists; // check if NFT already minted for this quest for this address/DID
    mapping (address => mapping (string => string)) public getNFTURIsByAddress; //allows retrieval of URIs by address and quest
    mapping (string => uint) public tokensMinted;
    mapping (string => uint) public rarityThreshold;
    mapping (string => uint[2]) public rarityPercentages;
    mapping (address => mapping(string => Quest)) public Quests; //allows retrieval of Quest metadata in one struct. Can remove once NFT.storage is used

    struct Quest {
        address receiver;
        string quest;
        string URI;
        uint timestamp;
        bool exists;
    }


    event NFTMinted(address indexed _to, string indexed _tokenURI);

    modifier onlyAdmin(){
        require (masterStore.admins(msg.sender), "Must be admin for this action");
        _;
    }

    modifier questExist(string memory _quest){
        require(masterStore.approvedQuests(_quest), "Not a valid quest");
        _;
    }

    constructor(address _masterStoreAddress, address _checkNFTAddress) ERC721("CompletedDiscoveryQuest", "CDQ") public{
        masterStore = NFTStore(_masterStoreAddress);
        bool adminCheck = masterStore.admins(msg.sender);
        require(adminCheck, "deployer can't make NFT");
        checkNFT = ChainlinkNFT(_checkNFTAddress);
    }

    function mintToken(address _to , string memory _tokenURI, string memory questName, string memory _did) public {
        //access control logic with chainlink?
        require(masterStore.whiteList(_to), "address is not registered!");
        require(masterStore.approvedQuests(questName), "this quest is not valid");
        require(!NFTExists[questName][_to], "this address already has an NFT for this quest!");
        checkNFT.requestCeramicData(_did, questName);
        uint checkInt = checkNFT.allowMint();
        require(checkInt==1, "Not all quizzes completed for quest");
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

    function setRarityThreshold(string memory _quest, uint _threshold) public onlyAdmin questExist(_quest){
        require(_threshold >0);
        rarityThreshold[_quest] = _threshold;

    }

    function setRarityPercentages(string memory _quest, uint[2] memory _percentages) public onlyAdmin questExist(_quest){
        require(_percentages[0] >0 && _percentages[1]>0 && _percentages[0] <101 && _percentages[1]<101);
        rarityPercentages[_quest] = _percentages;

    }
}