// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;
import "./ERC721.sol";


contract DutchAuction{
    event Log(uint v);
    uint public constant DURATION = 7 days;
    ERC721 public immutable nft;
    uint public immutable nftId;
    address payable public immutable seller;
    uint public immutable startingPrice;
    uint public immutable discountRate;
    uint public immutable startingAt;
    uint public immutable expiresAt;

    constructor(
        uint _startingPrice,
        uint _discountRate,
        address _nft,
        uint _nftId
    ){
        seller = payable(msg.sender);
        require(_startingPrice>0,"price <0");
        startingPrice = _startingPrice;
        discountRate = _discountRate;
        nft = ERC721(_nft);
        nftId = _nftId;
        startingAt = block.timestamp;
        expiresAt = block.timestamp+DURATION;
        require(_startingPrice-DURATION*_discountRate>=0,"discount too big");
    }

    function getPrice() public view returns (uint) {
        uint timeElapsed = block.timestamp - startingAt;
        uint discount = discountRate * timeElapsed;
        return startingPrice - discount;
    }

    function buy() external payable{
        require(block.timestamp<expiresAt,"expired");
        uint price = getPrice();
        require(msg.value>=price,"not enough eth");
        nft.transferFrom(seller,msg.sender,nftId);
        uint refund = msg.value-price;
        if(refund>0){
            payable(msg.sender).transfer(refund);
        }

        selfdestruct(seller);

    }


}