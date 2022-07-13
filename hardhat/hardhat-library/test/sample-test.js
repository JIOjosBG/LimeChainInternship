const { expect } = require("chai");
const { ethers } = require("hardhat");

//require('solidity-coverage');


describe("Basic", function () {
  it("Deploy", async function(){
    const Library = await ethers.getContractFactory("Library");
    const library = await Library.deploy();
    await library.deployed();
  });
  it("Should not return error addBook borrowBook and returnBook", async function () {

    const Library = await ethers.getContractFactory("Library");
    const library = await Library.deploy();
    await library.deployed();

    const addBook = await library.addBook("9786589711377","1984",2);
    await addBook.wait();
    
    const borrowBook = await library.borrowBook(1,{ value: ethers.utils.parseEther("0.5")});
    await borrowBook.wait();

    const returnBook = await library.returnCurrentBook();
    await returnBook.wait();

    const borrowSecondBook = await library.borrowBook(1,{ value: ethers.utils.parseEther("0.00000000000001")});
    await borrowSecondBook.wait();
  });
  it("get owner addresses", async function(){
    const Library = await ethers.getContractFactory("Library");
    const library = await Library.deploy();
    await library.deployed();

    const [_owner, addr1, addr2] = await ethers.getSigners();
    const owner = await library.owner();
    await owner;
    //console.log(owner.address);
  });
});
describe("addBook", function () {
  it("addBook once and check", async function(){
    const Library = await ethers.getContractFactory("Library");
    const library = await Library.deploy();
    await library.deployed();

    const addBook = await library.addBook("9786589711377","1984",2);
    await addBook.wait();

    const book= await library.getBook(1);
    await book;
    //console.log(book.name)


    expect(book.name).to.equal("1984");
    expect(book.copies).to.equal(2);
  });
  it("addBook same title twice", async function(){
    const Library = await ethers.getContractFactory("Library");
    const library = await Library.deploy();
    await library.deployed();

    const addBook = await library.addBook("9786589711377","1984",2);
    await addBook.wait();
    const addSecondBook = await library.addBook("9786589711377","1984",3);
    await addSecondBook.wait();

    const book= await library.getBook(1);
    await book;
    expect(book.name).to.equal("1984");
    expect(book.copies).to.equal(5);
    var error =false;
    try{
      const book2= await library.getBook(2);
      await book2;
    }catch(error){
      err=true;
      expect(error.name).to.equals("Error");
    };
    expect(err).to.equal(true);

  });

  it("addBook different titles", async function(){
    const Library = await ethers.getContractFactory("Library");
    const library = await Library.deploy();
    await library.deployed();

    const addBook = await library.addBook("9786589711377","1984",2);
    await addBook.wait();
    const addSecondBook = await library.addBook("9780151002177","Animal farm",3);
    await addSecondBook.wait();

    const book= await library.getBook(1);
    await book;
    expect(book.name).to.equal("1984");
    expect(book.copies).to.equal(2);

    const book2= await library.getBook(2);
    await book2;
    expect(book2.name).to.equal("Animal farm");
    expect(book2.copies).to.equal(3);
  });
  it("Non owner try to add book",async function(){
    const [_owner, addr1, addr2] = await ethers.getSigners();
    const Library = await ethers.getContractFactory("Library");
    const library = await Library.deploy();
    await library.deployed();

    const addBook = await library.connect(_owner).addBook("9786589711377","1984",2);
    await addBook.wait();
    var err= false;
    try{
      const addSecondBook = await library.connect(addr1).addBook("Animal farm",2);
      await addSecondBook.wait();
    }catch(error){
      err=true;
      expect(error.name).to.equals("Error");
    };
    expect(err).to.equal(true);
  });
});

describe("Borrow book", function () {
  it("Borrow 1 book", async function(){
    const Library = await ethers.getContractFactory("Library");
    const library = await Library.deploy();
    await library.deployed();

    const addBook = await library.addBook("9786589711377","1984",2);
    await addBook.wait();

    var book= await library.getBook(1);
    await book;

    expect(book.name).to.equal("1984");
    expect(book.copies).to.equal(2);

    const borrowBook = await library.borrowBook(1,{ value: ethers.utils.parseEther("0.5")});
    await borrowBook.wait();

    book= await library.getBook(1);
    await book;
    expect(book.name).to.equal("1984");
    expect(book.copies).to.equal(1);
  });

  it("Error with borrowBook for second borrowing", async function(){
    const Library = await ethers.getContractFactory("Library");
    const library = await Library.deploy();
    await library.deployed();

    const addBook = await library.addBook("9786589711377","1984",2);
    await addBook.wait();

    const borrowBook = await library.borrowBook(1,{ value: ethers.utils.parseEther("0.5")});
    await borrowBook.wait();
    var err=false;
    try {
      await library.borrowBook(1,{ value: ethers.utils.parseEther("0.5")});
    } catch(error) {
      err=true;
      expect(error.name).to.equals("Error");
    };
    expect(err).to.equal(true);
  });
  it("Multiple users trying to borrow successfuly and with error",async function(){
    const [_owner, addr1, addr2] = await ethers.getSigners();
    const Library = await ethers.getContractFactory("Library");
    const library = await Library.deploy();
    await library.deployed();

    const addBook = await library.connect(_owner).addBook("9786589711377","1984",2);
    await addBook.wait();
    var err= false;
    
    var borrowBook = await library.borrowBook(1,{ value: ethers.utils.parseEther("0.5")});
    await borrowBook.wait();
    borrowBook = await library.connect(addr1).borrowBook(1,{ value: ethers.utils.parseEther("0.5")});
    await borrowBook.wait();

    try{
      borrowBook = await library.connect(addr2).borrowBook(1,{ value: ethers.utils.parseEther("0.5")});
      await borrowBook.wait();
    }catch(error){
      err=true;
      expect(error.name).to.equals("Error");
    };
    expect(err).to.equal(true);
  });
  it("borrowNotPaying", async function(){
    const Library = await ethers.getContractFactory("Library");
    const library = await Library.deploy();
    await library.deployed();
    const addBook = await library.addBook("9786589711377","1984",2);
    await addBook.wait();

    var book= await library.getBook(1);
    await book;
    expect(book.name).to.equal("1984");
    expect(book.copies).to.equal(2);
    var err=false;
    try{
      const borrowBook = await library.borrowBook(1);
      await borrowBook.wait();
    }catch(error){
      err=true;
      expect(error.name).to.equals("Error");
    };
    expect(err).to.equal(true);
  });
});
describe("return error", function () {
  it("return 1 book after borrowed", async function(){
    const Library = await ethers.getContractFactory("Library");
    const library = await Library.deploy();
    await library.deployed();

    const addBook = await library.addBook("9786589711377","1984",2);
    await addBook.wait();

    var book= await library.getBook(1);
    await book;
    expect(book.name).to.equal("1984");
    expect(book.copies).to.equal(2);

    const borrowBook = await library.borrowBook(1,{ value: ethers.utils.parseEther("0.5")});
    await borrowBook.wait();

    book= await library.getBook(1);
    await book;
    expect(book.name).to.equal("1984");
    expect(book.copies).to.equal(1);

    const returnBook = await library.returnCurrentBook();
    await returnBook.wait();

    book= await library.getBook(1);
    await book;
    expect(book.name).to.equal("1984");
    expect(book.copies).to.equal(2);
  });


  it("Error with returnBook", async function(){
    const Library = await ethers.getContractFactory("Library");
    const library = await Library.deploy();
    await library.deployed();

    var err=false;
    try {
      const returnBook = await library.returnCurrentBook();
      await returnBook.wait();
    } catch(error) {
      err=true;
      expect(error.name).to.equals("Error");
    };
    expect(err).to.equal(true);
  });
});

describe("withdraw", function () {
  it("withdraw", async function(){
    const Library = await ethers.getContractFactory("Library");
    const library = await Library.deploy();
    await library.deployed();

    const addBook = await library.addBook("9786589711377","1984",2);
    await addBook.wait();

    var book= await library.getBook(1);
    await book;
    expect(book.name).to.equal("1984");
    expect(book.copies).to.equal(2);
    const borrowBook = await library.borrowBook(1,{ value: ethers.utils.parseEther("0.5")});
    await borrowBook.wait();

    const withdraw = await library.withdraw();
    await withdraw.wait();
  });

  it("non owner withdraw", async function(){
    const [_owner, addr1, addr2] = await ethers.getSigners();

    const Library = await ethers.getContractFactory("Library");
    const library = await Library.deploy();
    await library.deployed();

    const addBook = await library.addBook("9786589711377","1984",2);
    await addBook.wait();

    var book= await library.getBook(1);
    await book;
    expect(book.name).to.equal("1984");
    expect(book.copies).to.equal(2);
    const borrowBook = await library.borrowBook(1,{ value: ethers.utils.parseEther("0.5")});
    await borrowBook.wait();
    var err=false;
    try{
      const withdraw = await library.connect(addr1).withdraw();
      await withdraw.wait();
    }catch(error){
      err=true;
      expect(error.name).to.equals("Error");
    };
    expect(err).to.equal(true);
  });
  it("withdraw with 0 funds", async function(){
    const [_owner, addr1, addr2] = await ethers.getSigners();

    const Library = await ethers.getContractFactory("Library");
    const library = await Library.deploy();
    await library.deployed();

    var err=false;
    try{
      const withdraw = await library.withdraw();
      await withdraw.wait();
    }catch(error){
      err=true;
      expect(error.name).to.equals("Error");
    };
    expect(err).to.equal(true);
  });

});