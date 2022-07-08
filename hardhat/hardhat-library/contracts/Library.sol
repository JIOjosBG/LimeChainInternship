// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Library is Ownable {
    event addedBook(string name, uint256 copies);
    event addedCopies(string name, uint256 copies);
    error notPaying();
    error alredyBorrwing(address user);

    uint256 public count;
    uint256 public immutable PRICE = 10000;
    struct Book {
        string name;
        uint256 copies;
    }

    constructor() Ownable() {}

    //user => current borrowing book index
    mapping(address => uint256) public currentlyBorrowing;
    //book name => index
    mapping(string => uint256) public indexes;
    //index => book
    mapping(uint256 => Book) public books;
    //bookIndex => previous borrowers
    mapping(uint256 => mapping(address => bool)) borrowedBooks;

    function withdraw() external payable onlyOwner {
        require(address(this).balance > 0, "No eth to withdraw");
        payable(msg.sender).transfer(address(this).balance);
    }

    function getBook(uint256 _i) external view returns (Book memory) {
        require(_i <= count, "not in range");
        return books[_i];
    }

    function addBook(string calldata _name, uint256 _copies)
        external
        onlyOwner
    {
        if (indexes[_name] != 0) {
            books[indexes[_name]].copies += _copies;
            emit addedCopies(_name, _copies);
            return;
        } else {
            ++count;
            books[count] = Book({name: _name, copies: _copies});
            indexes[_name] = count;
            emit addedBook(_name, _copies);
        }
    }

    function borrowBook(uint256 _index) external payable {
        //msg.sender    49436
        //sender        49450
        //address sender = msg.sender;
        if (currentlyBorrowing[msg.sender] > 0) {
            revert alredyBorrwing(msg.sender);
        }
        Book storage b = books[_index];

        require(b.copies > 0, "zero books left");

        if (msg.value < PRICE) {
            revert notPaying();
        } else if (msg.value > PRICE) {
            payable(msg.sender).transfer(msg.value - PRICE);
        }

        //storage b 49371   56777
        //books[]   49436   56852

        --b.copies;
        //note book to borrower
        currentlyBorrowing[msg.sender] = _index;
        //note borrower to book
        borrowedBooks[_index][msg.sender] = true;
    }

    function returnCurrentBook() external {
        uint256 _index = currentlyBorrowing[msg.sender];
        require(_index > 0, "not borrowng");
        currentlyBorrowing[msg.sender] = 0;
        ++books[_index].copies;
    }
}
