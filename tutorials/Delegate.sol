// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

contract C{
    event Log(address source,uint amount);
    function send(address payable dest1,address payable dest2,uint amount) external{
        payable(dest1).transfer(amount/2);
        payable(dest2).transfer(amount/2);
        emit Log(msg.sender,amount);
    }
}



contract Sender{
    constructor() payable{}
    function getBalance() external view returns(uint){
        return address(this).balance;
    }
    function send(address c, address payable dest1,address dest2,uint amount) external{
        (bool success, bytes memory data) = c.delegatecall(abi.encodeWithSelector(C.send.selector,dest1,dest2,amount));
    }
}


contract Receiver{
    receive() external payable{}
    function getBalance() external view returns(uint){
        return address(this).balance;
    }
}
