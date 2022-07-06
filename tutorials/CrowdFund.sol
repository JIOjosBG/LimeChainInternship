// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;
import "./ERC20.sol";

contract CrowdFund{
    uint count;
    struct Campaign{
        address creator;
        uint goal;
        uint pledged;
        uint32 startAt;
        uint32 endAt;
        bool claimed;
    }



    IERC20 public immutable token;
    mapping(uint => Campaign) campaigns;

    mapping(uint => mapping(address => uint)) pledgedAmount;

    constructor(address _tk){
        token = IERC20(_tk);
    }

    function launch(uint _goal, uint32 _startAt, uint32 _endAt) external {
        require(_startAt<_endAt,"start and end incorrect");
        require(_startAt<_endAt+90 days,"too long campaign");

        count+=1;

        campaigns[count] = Campaign({
            creator:msg.sender,
            goal: _goal,
            pledged: 0,
            startAt: _startAt,
            endAt: _endAt,
            claimed: false
        });
    }

    function cancel(uint _id) external{
        Campaign memory campaign = campaigns[_id];
        require(msg.sender==campaign.creator);
        require(block.timestamp>=campaign.startAt);

        delete campaigns[_id];
    }

    function pledge(uint _id, uint _amount) external{
        Campaign storage c = campaigns[_id];
        require(block.timestamp>c.startAt,"not started");
        require(block.timestamp<c.endAt,"ended");

        c.pledged+=_amount;
        pledgedAmount[_id][msg.sender] += _amount;
        token.transferFrom(msg.sender,address(this),_amount);

    }

    function unpledge(uint _id, uint _amount) external{
        Campaign storage c = campaigns[_id];
        require(block.timestamp>c.startAt,"not started");
        require(block.timestamp<c.endAt,"ended");

        c.pledged-=_amount;
        pledgedAmount[_id][msg.sender] -= _amount;
        token.transfer(msg.sender,_amount);
    }

    function claim(uint _id) external {
        Campaign storage c = campaigns[_id];
        require(block.timestamp>c.startAt,"not started");
        require(block.timestamp>c.endAt,"not ended");
        require(msg.sender==c.creator,"not creator");
        require(c.pledged>=c.goal,"not enogh");
        require(!c.claimed,"claimed");
        c.claimed = true;
        token.transfer(msg.sender,c.pledged);
    }

    function refund(uint _id) external {
        Campaign storage c = campaigns[_id];
        require(block.timestamp>c.startAt,"not started");
        require(block.timestamp>c.endAt,"not ended");
        require(c.pledged<c.goal,"its already collected, cant refund");

        uint bal = pledgedAmount[_id][msg.sender];
        pledgedAmount[_id][msg.sender] = 0;

        token.transfer(msg.sender,bal);



    }



}