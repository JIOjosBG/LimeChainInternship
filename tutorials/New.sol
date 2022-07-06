// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

contract Account{
    address public bank;
    address public owner;

    constructor(address o) payable {
        bank = msg.sender;
        owner = o;
    }
}


contract AccounFactory{
    Account[] public accounts;
    function createAccount(address o) external payable{
        Account account = new Account{value:111}(o);
        accounts.push(account);
    }
}