// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

contract Events{
    event Log(string message, uint val);

    function makeLog(string calldata m, uint v)external {
        emit Log(m,v);
    }
}