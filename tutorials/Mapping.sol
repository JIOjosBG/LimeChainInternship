// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

contract Mapping{
    mapping(address => uint) public balance;
    mapping(address => bool) public added;
    address[] keys;

    function set(address _key, uint _val) external {
        balance[_key] = _val;
        if(!added[_key]){
            added[_key] = true;
            keys.push(_key);
        }
    }

    function getSize() external view returns(uint){
        return keys.length;
    }

    function getBalance(uint _i) public view returns (uint){
        return balance[keys[_i]];
    }

    function totalBalance() external view returns(uint sum){
        for(uint i=0;i<keys.length;i++){
            sum+=getBalance(i);
        }
    }

}