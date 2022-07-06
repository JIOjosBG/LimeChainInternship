// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract TestMultiCall{
    event Log(address caller);
    function f1() external returns(uint,uint){
        emit Log(msg.sender);
        return(1,block.timestamp);
    }
    function f2() external returns(uint,uint){
        emit Log(msg.sender);
        return(2,block.timestamp);
    }

    function getData1() external pure returns(bytes memory){
        return abi.encodeWithSelector(this.f1.selector);
    }

    function getData2() external pure returns(bytes memory){
        return abi.encodeWithSelector(this.f2.selector);
    }
}

contract MultiCall {
    function multiCall(address[] calldata targets,bytes[] calldata data) external view returns(bytes[] memory){
        require(targets.length == data.length, "taarget.length!=data.length");
        bytes[] memory results = new bytes[](data.length);
        for(uint i ;i<targets.length;i++){
            (bool success, bytes memory result) = targets[i].staticcall(data[i]);
            require(success,"failed");
            results[i]=result;
        }
        return results;
    }
}




contract DelegateMultiCall {
    function delegateMultiCall(address[] calldata targets,bytes[] calldata data) external returns(bytes[] memory){
        require(targets.length == data.length, "taarget.length!=data.length");
        bytes[] memory results = new bytes[](data.length);
        for(uint i ;i<targets.length;i++){
            (bool success, bytes memory result) = targets[i].delegatecall(data[i]);
            require(success,"failed");
            results[i]=result;
        }
        return results;
    }
}
