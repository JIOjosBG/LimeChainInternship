// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

contract A{
    event Log(string s);
    function foo() public virtual{
        emit Log("A");
    }
}

contract B is A{
    function foo() public override {
        emit Log("B");
    }

    function p() external{
        A.foo();
    }

}


