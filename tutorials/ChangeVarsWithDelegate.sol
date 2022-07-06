// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;


contract Deployed{
    uint data1;
    string data2;
    address data3;

    function set(address u,uint d1,string calldata d2,address d3) external {
        (bool success, bytes memory data) = u.delegatecall(abi.encodeWithSelector(Updated.set.selector,d1,d2,d3));
    }


    function getData() external view returns(uint,string memory ,address){
        return (data1,data2,data3);
    }

}

contract Updated{
    uint data1;
    string data2;
    address data3;
    uint myModifier;

    function setModifier(uint m) external {
        myModifier=m;
    }

    function getModifier() external view returns(uint){
        return myModifier;
    }

    function set(uint d1,string calldata d2,address d3) external {
        data1=d1*123;
        data2=d2;
        data3=d3;
    }
}

