// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

contract AccessControl{
    mapping(bytes32 => mapping(address => bool)) roles;

    constructor(){
        roles[ADMIN][msg.sender] = true;
    }

    bytes32 public constant ADMIN = keccak256(abi.encodePacked("ADMIN"));
    bytes32 public constant USER = keccak256(abi.encodePacked("USER")); 


    modifier onlyAdmin(bytes32 _role){
        require(roles[_role][msg.sender],"Not authorized");
        _;
    }

    function grantRole(bytes32  _role, address _account) external onlyAdmin(ADMIN){
        roles[_role][_account] = true;
    }

    function revokeRole(bytes32  _role, address _account) external onlyAdmin(ADMIN){
        roles[_role][_account] = false;
    }


}