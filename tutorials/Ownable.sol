// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;


contract Ownable{

    address public owner;
    constructor(){
        owner = msg.sender;
    }

    modifier IsOwner(){
        require(msg.sender==owner, "not owner");
        _;
    }

    function setOwner(address _newOwner) external IsOwner{
        require(_newOwner!=address(0), "invalid address");
        owner = _newOwner;
    }

    function onlyOwner() external IsOwner{

    }
    function everyone() external {

    }

}