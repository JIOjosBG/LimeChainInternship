// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;
import "./ERC721.sol";


contract English{
    event Log(string m,uint v);
    ERC721 public immutable nft;
    uint public immutable nftId;
    address payable public immutable seller;


    uint32 public endAt;
    bool public started;
    bool public ended;

    uint startingBid;
    address payable public bidder;
    uint public bid;
    mapping(address=>uint) public bids;


    constructor(
        address _nft,
        uint _nftId,
        uint _startingBid
    ){
        seller = payable(msg.sender);
        require(_startingBid>0,"price <0");
        startingBid = _startingBid;
        bid = _startingBid;
        nft = ERC721(_nft);
        nftId = _nftId;
        
    }

    function start() external{
        require(!started,"started");
        require(msg.sender==seller,"not authorized");

        started = true;
        endAt = uint32(block.timestamp+60);
        nft.transferFrom(seller,address(this),nftId);

        emit Log("started",0);
    }

    function getPrice() public view returns (uint) {
        return bid;
    }

    function makeABid() external payable{
        require(started,"not started");
        require(msg.value>bid,"not enough eth");
        require(block.timestamp<endAt);
        
        if(bidder!=address(0)){
            bids[bidder]+=bid;
        }

        bid = msg.value;
        bidder = payable(msg.sender);
        
        emit Log("bid",msg.value);
    }

    function withdraw() external{
        uint val = bids[msg.sender];
        bids[msg.sender] = 0;
        payable(msg.sender).transfer(val);
        emit Log("Withdraw",val);
    }

    function end()external {
        require(started,"started");
        require(!ended,"ended");
        require(block.timestamp>=endAt,"not ended");

        ended=true;
        if(bidder!=address(0)){
            nft.transferFrom(address(this),bidder,nftId);
            seller.transfer(bid);
        }else{
            nft.transferFrom(address(this),bidder,nftId);
        }

        emit Log("ended",bid);
    }

}