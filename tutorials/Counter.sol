// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

contract Counter{
    uint public c;

    function count() external view returns(uint){
        return c;
    }
    function inc() external {
        c+=1;
    }

    function dec() external {
        c-=1;
    }
}