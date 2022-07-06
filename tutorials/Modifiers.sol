// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;


contract Modifiers{
    uint public counter;
    bool public paused;

    modifier checkIfPaused{
        require(!paused,"paused");
        _;
    }

    modifier sandwich() {
        counter+=1;
        _;
        counter*=2;

    }

    function togglePause() external {
        paused = !paused;
    }

    function inc(uint i) external checkIfPaused{
        counter+=i;
    }

    function dec(uint i) external checkIfPaused{
        counter-=i;
    }

    function foo(uint i) external sandwich checkIfPaused{
            counter=i;
    }

}