pragma solidity >=0.5.0 <0.9.0;

/**
 * @title ChainlinkNFT
 * @dev Contract for calling chainlink when verifying NFT Mint requests
*/

import "@chainlink/contracts/src/v0.6/ChainlinkClient.sol";

contract ChainlinkNFT is ChainlinkClient {
    address private oracle;
    bytes32 private jobId;
    uint256 private fee;
    string private baseURI;
    uint public allowMint; 

    /**
     * Network: Matic Mumbai Testnet
     * Oracle: 0x58bbdbfb6fca3129b91f0dbe372098123b38b5e9
     * Job ID: da20aae0e4c843f6949e5cb3f7cfe8c4
     * LINK address: 0x326C977E6efc84E512bB9C30f76E30c160eD06FB
     * Fee: 0.01 LINK
     */
    
    constructor(string _baseURI) public {
    	setChainlinkToken(0x326C977E6efc84E512bB9C30f76E30c160eD06FB);
        oracle = 0x58bbdbfb6fca3129b91f0dbe372098123b38b5e9;
        jobId = "da20aae0e4c843f6949e5cb3f7cfe8c4"; 
        fee = 10 ** 16; // 0.01 LINK
        baseURI = _baseURI;
    }

    function setBaseURI(string memory _newBase) Ownable{
        baseURI = _newBase;

    }

    function requestCeramicData(string _did, string _questName) public returns (bytes32 _requestId){
        string memory paramString = string(abi.encodePacked("?did=", _did, "&quest=", _questName));
    	Chainlink.Request memory req = buildChainlinkRequest(jobId, address(this), this.fulfillCeramicData.selector);
    	req.add("get", baseURI); //this is API endpoint for server.js or for demo ceramic api
    	req.add("queryparams", "");
        req.add("path", "questComplete");

        return sendChainlinkRequestTo(oracle, req, fee);
    }

    /**
     * Callback function
     */
    function fulfillCeramicData(bytes32 _requestId, uint256 _questComplete) public recordChainlinkFulfillment(_requestId) {
    	allowMint = _questComplete;
    }
}