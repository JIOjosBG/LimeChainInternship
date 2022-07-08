// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Library is Ownable {
    event addedBook(string name, uint copies);
    event addedCopies(string name,uint copies);
    error notPaying();
    error alredyBorrwing(address user);


    uint public count;
    uint public immutable PRICE=10000;
    struct Book{
        string name;
        uint copies;
    }
    constructor() Ownable() {
    }

    //user => current borrowing book index
    mapping(address => uint) public currentlyBorrowing;
    //book name => index
    mapping(string => uint) public indexes;
    //index => book
    mapping(uint => Book) public books;
    //bookIndex => previous borrowers
    mapping(uint => mapping(address=>bool)) borrowedBooks;

    function withdraw() external onlyOwner payable{
        require(address(this).balance > 0, "No eth to withdraw");
        payable(msg.sender).transfer(address(this).balance);
    }

    


    function addBook(string calldata _name, uint _copies) external onlyOwner{

        if( indexes[_name]!=0){
            books[indexes[_name]].copies+=_copies;
            emit addedCopies(_name,_copies);
            return;
        }else{
            ++count;
            books[count] = Book({name: _name, copies: _copies});
            indexes[_name] = count;
            emit addedBook(_name,_copies);
        }
    }

    function borrowBook(uint _index) external payable{
        //msg.sender    49436
        //sender        49450
        //address sender = msg.sender;

        if(msg.value<PRICE){
            revert notPaying();
        }

        if(currentlyBorrowing[msg.sender]>0){
            revert alredyBorrwing(msg.sender);
        }
        //storage b 49371   56777
        //books[]   49436   56852
        Book storage b = books[_index];
        //check if enough books
        require(b.copies>0,"zero books left");
        --b.copies;
        //note book to borrower
        currentlyBorrowing[msg.sender] = _index;
        //note borrower to book
        borrowedBooks[_index][msg.sender]=true;
        if(msg.value>PRICE){
            payable(msg.sender).transfer(msg.value-PRICE);
        }
    }

    function returnCurrentBook()external{
        uint _index = currentlyBorrowing[msg.sender];
        require(_index>0,"not borrowng");
        currentlyBorrowing[msg.sender]=0;
        ++books[_index].copies;
    }

}