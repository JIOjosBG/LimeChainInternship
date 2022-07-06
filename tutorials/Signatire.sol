// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

contract VerifySig{
    function verify(address _signer, string memory s, bytes memory _sig)external pure returns(bool){
        bytes32 msgHash = getMessageHash(s);
        bytes32 ethSignMsgHash = getEthSignedMessageHash(msgHash);
        
        return recover(ethSignMsgHash,_sig) == _signer;
    }

    function getMessageHash(string memory _message) public pure returns(bytes32){
        return keccak256(abi.encodePacked(_message));
    }

    function getEthSignedMessageHash(bytes32 _messageHash) public pure returns(bytes32){
        return keccak256(abi.encodePacked("\x19Etherium Signed Message:\n32",
        _messageHash));
    }
    function recover(bytes32 _ethSignedMessageHack, bytes memory _signature) public pure returns(address){
        (bytes32 r,bytes32 s,uint8 v) = _split(_signature);
        return ecrecover(_ethSignedMessageHack,v,r,s);
    }

    function _split(bytes memory _sig) internal pure returns(bytes32 r, bytes32 s, uint8 v){
        require(_sig.length==65,"invalid signature");
        assembly{
            r:= mload(add(_sig,32))
            s:= mload(add(_sig,64))
            v:= byte(0,add(_sig,96))   
        }
    }
}