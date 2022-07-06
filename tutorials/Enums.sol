// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

contract Enums{
    enum Status{
        None,
        Sent,
        Delivered,
        Seen
    }

    Status message;
    function get() external  view returns (Status){
        return message;
    }

    function set(Status _s) public {
        message = _s;
    }

    function send() external {
        set(Status.Sent);
    }

    function read() external{
        set(Status.Seen);
    }
}