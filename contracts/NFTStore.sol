pragma solidity >=0.5.0 <0.9.0;

/**
 * @title NFTStore
 * @dev Store NFTs and other information for ease of access to a front-end and querying

*/



contract NFTStore {
        mapping (address => bool) public admins;


        constructor(address[] memory _admins) public{
            for (uint i = 0; i<_admins.length; i++){
                admins[_admins[i]] = true;
            }
        }
}