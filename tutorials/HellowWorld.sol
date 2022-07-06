// SPDX-License-Identifier: MIT

pragma solidity 0.8.7;

contract HellowWorld{
    string public myString = "Hellow world!";
    bool public b = true;
    uint public u = 123;
    int public i = -123;
    int public minInt = type(int).min;
    int public maxInt = type(int).max;
    address public addr = 0x3fD54D99efAE01c478831Ba2Cd0611cE5FCBAbb0;
    bytes32 public b32 = 0x00112233445566778899aabbccddeeff0123456789abcdef0123456789abcdef;
}