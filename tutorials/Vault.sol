// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;
import "./ERC20.sol";

contract Vault{
    mapping(address=>uint) public balances;
    ERC20 immutable token;
    uint totalSuply;

    constructor(address _token){
        token = ERC20(_token);
    }

    function mint(address to,uint _amount) private {
        totalSuply+=_amount;
        balances[to]+=_amount;
    }

    function burn(address from,uint _amount) private{
        totalSuply-=_amount;
        balances[from]-=_amount;
    }

    function deposit(uint _amount) external{
        uint shares;
        if(totalSuply==0){
            shares=_amount;
        }else{
            shares = (_amount*totalSuply)/token.balanceOf(address(this));
        }
        mint(msg.sender,shares);
        token.transferFrom(msg.sender,address(this),_amount);
    }

    function withdraw(uint _shares) external{
        uint amount = (_shares*token.balanceOf(address(this)))/totalSuply;
        burn(msg.sender,amount);
    }

}