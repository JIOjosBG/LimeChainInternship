// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract Library{
    event addedBook(string name, uint copies);
    event addedCopies(string name,uint copies);
    error alredyBorrwing(address user);

    address immutable public owner;
    uint public count;

    struct Book{
        string name;
        uint copies;
    }
    constructor(){
        owner = msg.sender;
    }

    //user => current borrowing book index
    mapping(address => uint) public currentlyBorrowing;
    //book name => index
    mapping(string => uint) public indexes;
    //index => book
    mapping(uint => Book) public books;
    //bookIndex => previous borrowers
    mapping(uint => mapping(address=>bool)) borrowedBooks;
    modifier onlyAdmin(){
        require(msg.sender == owner,"not owner");
        _;
    }
    function addBook(string calldata _name, uint _copies) external onlyAdmin{

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

    function borrowBook(uint _index) external {
        //msg.sender    49436
        //sender        49450
        //address sender = msg.sender;
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
    }

    function returnCurrentBook()external{
        uint _index = currentlyBorrowing[msg.sender];
        require(_index>0,"not borrowng");
        currentlyBorrowing[msg.sender]=0;
        ++books[_index].copies;
    }

}