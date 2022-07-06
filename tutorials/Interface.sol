// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

interface ICounter{
    function count() external view returns(uint);
    function inc() external;
}

contract CallInterface{
    uint public count;
    function test(address _counter) external{
        ICounter(_counter).inc(); 
        ICounter(_counter).count;
    }

    function getFromTest(address _counter) external view returns(uint){
        return ICounter(_counter).count();
    }
}