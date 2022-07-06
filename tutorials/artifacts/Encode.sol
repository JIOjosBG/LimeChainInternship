// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

contract Encode{

    function encodePacked(string memory t1,string memory t2) external pure returns(bytes32){
        return keccak256(abi.encodePacked(t1,t2));
    }
    function encode(string memory t1,string memory t2) external pure returns(bytes32){
        return keccak256(abi.encode(t1,t2));
    }
}