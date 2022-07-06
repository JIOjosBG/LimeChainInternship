// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

contract CallTest{
    function getX(address c) external view returns(uint){
        return Test(c).getX();
    }
    function setX(Test c,uint _x) external {
        c.setX(_x);
    }

    function pay(Test c) external payable returns(uint){
        return c.pay{value:msg.value}();
    }

}


contract Test{
    uint x;
    function getX() external view returns(uint){
        return x;
    }

    function setX(uint _x) external{
        x=_x;
    }

    function pay() external payable returns(uint){
        return msg.value;
    }

}