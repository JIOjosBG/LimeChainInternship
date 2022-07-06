// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

contract Errors{
    function testRequire(uint _i) external pure {
        require(_i<=10,"i>10");
    }
    function testRevert(uint _i) external pure {
        if( _i>1){
            if(_i>5){
                if(_i>10){
                    revert("i>10");
                }
            }
        }
    }

    uint public num =123;
    function testAssert() public view {
        assert(num==123);
    }

    function foo() public{
        num+=1;
    }

    error MyError(address caller,uint i);
    function testCustomError(uint _i) external view{
        if( _i> 10){
            revert MyError(msg.sender,_i);
        }
    }
}