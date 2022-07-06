// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

contract Test{

    event Log(string a);
    uint x=100000;
    function getX() external payable returns(uint){
        return x;
    }

    function setX(uint _x) external{
        x=_x;
    }

    fallback() external{
        emit Log("fallback");
    }

}


contract CallTest{
    event Log(uint a);
    constructor() payable{}
    function getX(address c) external returns(uint){
        (bool success, bytes memory data ) = c.call{value:111}(abi.encodeWithSignature("getX()"));
        require(success,"Failed");
        uint r;
        assembly {
            r := mload(add(data, 0x20))
        }
        emit Log(r);
        return r;
    } 

    function setX(address c,uint _x) external{
        (bool success,) = c.call(abi.encodeWithSignature("setX(uint256)",_x));
        require(success,"ASD");
    }

    function notExisting(address c) external {
        (bool success,)  = c.call(abi.encodeWithSignature("something()",123));
        require(success,"Failed");
    }
}