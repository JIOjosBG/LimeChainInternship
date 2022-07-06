// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

contract MultiSigWallet{
    mapping(address => bool) isOwner;
    address[] owners;
    struct Transaction{
        address destination;
        uint value;
        bytes data;
        bool executed;
    }
    Transaction[] transactons;
    uint required;

    mapping(uint => mapping(address => bool)) approved;

    constructor(address[] memory _owners, uint _required){
        require(_owners.length>0,"no owners");
        for(uint i=0;i<_owners.length;i++){
            address owner = _owners[i];
            require(_owners[i]!=address(0),"invalid address");
            require(!isOwner[owner],"already owner");
            isOwner[owner]=true;
            owners.push(owner);
        }
        required=_required;
    }

    receive() external payable{}
    modifier onlyOwner(){
        require(isOwner[msg.sender]);
        _;
    }
    function submit(address _destination,uint _amount, bytes calldata _data) onlyOwner external{
        Transaction memory t = Transaction(_destination,_amount,_data,false);
        transactons.push(t);
    }

    function approve(uint txId)external onlyOwner{
        require(txId<transactons.length);
        require(!transactons[txId].executed,"avready executed");
        approved[txId][msg.sender]=true;
    }
    function revoke(uint txId) external onlyOwner{
        require(txId<transactons.length,"invalid index");
        require(!transactons[txId].executed,"avready executed");

        approved[txId][msg.sender] = true;

    }
    function getApprovedCount(uint txId) public view returns(uint count) {
        require(txId<transactons.length);
        for(uint i=0;i<owners.length;i++){
            if(approved[txId][owners[i]]){
                count++;
            }
        }
    }

    function execute(uint txId) external returns(bool){
        require(txId<transactons.length,"invalid index");
        require(!transactons[txId].executed,"already executed");
        if(getApprovedCount(txId)>required){
            (bool success, ) = transactons[txId].destination.call{value: transactons[txId].value}(transactons[txId].data);
            require(success,"failed");
        }
        return true;
    }

}