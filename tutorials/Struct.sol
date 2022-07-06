// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

contract Struct{
    struct Car{
        string model;
        uint year;
        address owner;
    }

    Car public c1 = Car("Tesla", 2020, msg.sender);
    Car public c2 = Car({year: 2022, model:"Tesla", owner: msg.sender});
}