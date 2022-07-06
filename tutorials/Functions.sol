// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

contract Functions{
    uint public i = 123;
    address public addr = address(10);

    function add(uint x,uint y) external pure returns(uint){
        return x+y;
    }

    function sub(uint x,uint y) external pure returns (uint){
        return x-y;
    }

    function getData() external view returns(address,uint,uint){
        address sender = msg.sender;
        uint timestamp = block.timestamp;
        uint blockNum = block.number;

        return (sender,timestamp,blockNum);
    }
    // reads from the blockchain
    function viewFunc() external view returns (uint){
        return i;
    }
    
    //doesnt read from the blockchain
    function purFunction() external pure returns (uint){
        return 1;
    }


}