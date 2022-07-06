// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

contract Loops{
    function loop() external pure{
        for(int i=0;i<10;i++){
            if(i%2==0){
                continue;
            }
        }

        uint j=0;
        while(j<10){
            j++;
        }
    }

    function sum(uint _n) external pure returns(uint){
        uint s;
        for(uint i=0;i<=_n;i++){
            s+=i;
        }
        return s;
    }

}