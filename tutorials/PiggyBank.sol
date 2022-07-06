// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

contract PiggyBank{
    event Deposit(address sender, uint amount);
    event Withdraw(address recieved, uint amount);
    address owner = msg.sender;
    // add
    // withdraw

    function deposit() external payable{
        emit Deposit(msg.sender,msg.value);
    }

    function withdraw() external {
        require(msg.sender == owner);
        emit Withdraw(msg.sender,address(this).balance);
        selfdestruct(payable(owner));
    }


}