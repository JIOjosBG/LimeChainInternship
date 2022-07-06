// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

contract Arrays{
    //dynamic size
    uint[] public arr = [1,2,3,4,5,6];
    //fixed size
    uint[3] public arr2 = [1,2,3];

    function orderRemove(uint i) public {
        assert(i<arr.length);
        for(;i<arr.length-1;i++){
            arr[i]=arr[i+1];
        }
        arr.pop();
    }

    function swapRemove(uint i) public {
        arr[i]=arr[arr.length-1];
        arr.pop();
    }
    
}