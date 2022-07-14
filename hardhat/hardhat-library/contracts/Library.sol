// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./LIB.sol";

contract Library is Ownable {
    event addedBook(string isbn, uint256 copies);
    event addedCopies(string isbn, uint256 copies);
    error notPaying();
    error alredyBorrwing(address user);
    LIB public immutable token;
    uint256 public count;
    uint256 public immutable PRICE = 10000000000000000;
    struct Book {
        string isbn;
        string name;
        uint256 copies;
        address[] borrowed;
    }

    constructor() Ownable() {
        token = new LIB();
    }

    //user => current borrowing book index
    mapping(address => uint256) public currentlyBorrowing;
    //book name => index
    mapping(string => uint256) public indexes;
    //index => book
    mapping(uint256 => Book) public books;

    function getBook(uint256 _i) external view returns (Book memory) {
        require(_i <= count, "not in range");
        return books[_i];
    }

    function addBook(
        string calldata _isbn,
        string calldata _name,
        uint256 _copies
    ) external onlyOwner {
        if (indexes[_isbn] != 0) {
            books[indexes[_isbn]].copies += _copies;
            emit addedCopies(_isbn, _copies);
            return;
        } else {
            ++count;
            books[count] = Book(_isbn, _name, _copies, new address[](0));
            indexes[_isbn] = count;
            emit addedBook(_isbn, _copies);
        }
    }

    function buyLIB() external payable {
        require(msg.value > 0, ">0 wei required");
        token.mint(msg.sender, msg.value);
    }

    function borrowBook(uint256 _index) external {
        require(token.balanceOf(msg.sender) >= PRICE, "not enough LIB");
        if (currentlyBorrowing[msg.sender] > 0) {
            revert alredyBorrwing(msg.sender);
        }
        Book storage b = books[_index];
        require(b.copies > 0, "zero books left");

        // bool success =
        token.transferFrom(msg.sender, address(this), PRICE);
        // require(success, "not given allowance or not enough LIB");
        // require(success,"somethin is wrong");
        // require(success,"something is wrong");
        //storage b 49371   56777
        //books[]   49436   56852

        --b.copies;
        // book to borrower
        currentlyBorrowing[msg.sender] = _index;
        // borrower to book
        books[_index].borrowed.push(msg.sender);
    }

    function returnCurrentBook() external {
        uint256 _index = currentlyBorrowing[msg.sender];
        require(_index > 0, "not borrowng");
        currentlyBorrowing[msg.sender] = 0;
        ++books[_index].copies;
    }

    function withdraw() external payable onlyOwner {
        uint256 amount = token.balanceOf(address(this));
        require(amount > 0, "no tokens here");
        token.burn(amount);
        payable(owner()).transfer(address(this).balance);
    }
}
