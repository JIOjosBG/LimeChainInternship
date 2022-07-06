// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

interface IERC20 {
    function tatalSuply() external view returns(uint);
    function balanceOf(address account) external view returns(uint);
    function transfer(address destination, uint amount) external returns(bool);
    function allowence(address holder,address spender) external view returns(uint);
    function approve(address spender, uint amunt) external returns(bool);
    function transferFrom(address holder, address destination, uint amount) external returns(bool);
}

contract ERC20 is IERC20{
    uint public totalSuply;
    mapping(address => uint) balance;
    mapping(address => mapping(address => uint)) allowences;
    string public name = "test";
    string public symbol = "TEST";
    uint8 public decimals = 18;

    function tatalSuply() external view override returns(uint){
        return totalSuply;
    }
    function balanceOf(address account) external view override returns(uint){
        return balance[account];
    }
    function transfer(address destination, uint amount) external override returns(bool){
        require(balance[msg.sender]>=amount,"not enogh ercs");
        balance[msg.sender]-=amount;
        balance[destination]+=amount;
        return true;
    }
    function allowence(address holder,address spender) external view override returns(uint){
        return allowences[holder][spender];
    }
    function approve(address spender, uint amount) external override returns(bool){
        allowences[msg.sender][spender] = amount;
        return true;
    }
    function transferFrom(address holder, address destination, uint amount) external override returns(bool){
        require(allowences[holder][msg.sender]>=amount,"not allowed by holder");
        require(balance[holder]>=amount,"not enougn tokens");
        balance[destination]+=amount;
        balance[holder]-=amount;
    }

    function addTokens(address destination,uint amount) external {
        balance[destination]+=amount;
    }


}