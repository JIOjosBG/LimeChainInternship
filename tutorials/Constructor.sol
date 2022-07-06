// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;



contract C{
    address public owner;
    uint public asd;

    constructor(uint _x){
        owner=msg.sender;
        asd=_x;
    }
}