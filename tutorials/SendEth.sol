// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

contract SendEth{
    constructor() payable {}
    receive() external payable {}

    function viaTransfer(address payable destination) external payable{
        destination.transfer(123);
    }

    function viaSend(address payable destination) external payable{
        bool success = destination.send(123);
        require(success,"send failed");
    }


    function viaCall(address payable destination) external payable{
        (bool success, ) = destination.call{value: 123}("");
        require(success,"call failed");
    }

}

contract EthReceiver{
    event Log(uint amount, uint gas);

    receive() external payable{
        emit Log(msg.value,gasleft());
    }
}