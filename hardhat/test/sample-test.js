const { expect } = require("chai");
const { ethers } = require("hardhat");

//require('solidity-coverage');


describe("Library", function () {
  it("Deploy", async function(){
    const Library = await ethers.getContractFactory("Library");
    const library = await Library.deploy();
    await library.deployed();
  });
  it("Should not return error addBook borrowBook and returnBook", async function () {

    const Library = await ethers.getContractFactory("Library");
    const library = await Library.deploy();
    await library.deployed();

    const addBook = await library.addBook("1984",2);
    await addBook.wait();
    
    const borrowBook = await library.borrowBook(1,{ value: ethers.utils.parseEther("0.5")});
    await borrowBook.wait();

    const returnBook = await library.returnCurrentBook();
    await returnBook.wait();
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

  it("addBook once and check", async function(){
    const Library = await ethers.getContractFactory("Library");
    const library = await Library.deploy();
    await library.deployed();

    const addBook = await library.addBook("1984",2);
    await addBook.wait();

    const book= await library.books(1);
    await book;
    //console.log(book.name)


    expect(book.name).to.equal("1984");
    expect(book.copies).to.equal(2);
  });

  it("addBook same title twice", async function(){
    const Library = await ethers.getContractFactory("Library");
    const library = await Library.deploy();
    await library.deployed();

    const addBook = await library.addBook("1984",2);
    await addBook.wait();
    const addSecondBook = await library.addBook("1984",3);
    await addSecondBook.wait();

    const book= await library.books(1);
    await book;
    expect(book.name).to.equal("1984");
    expect(book.copies).to.equal(5);

    const book2= await library.books(2);
    await book2;
    expect(book2.name).to.equal("");
    expect(book2.copies).to.equal(0);
  });

  it("addBook different titles", async function(){
    const Library = await ethers.getContractFactory("Library");
    const library = await Library.deploy();
    await library.deployed();

    const addBook = await library.addBook("1984",2);
    await addBook.wait();
    const addSecondBook = await library.addBook("Animal farm",3);
    await addSecondBook.wait();

    const book= await library.books(1);
    await book;
    expect(book.name).to.equal("1984");
    expect(book.copies).to.equal(2);

    const book2= await library.books(2);
    await book2;
    expect(book2.name).to.equal("Animal farm");
    expect(book2.copies).to.equal(3);
  });

  it("borrowBook", async function(){
    const Library = await ethers.getContractFactory("Library");
    const library = await Library.deploy();
    await library.deployed();

    const addBook = await library.addBook("1984",2);
    await addBook.wait();

    var book= await library.books(1);
    await book;
    expect(book.name).to.equal("1984");
    expect(book.copies).to.equal(2);

    const borrowBook = await library.borrowBook(1,{ value: ethers.utils.parseEther("0.5")});
    await borrowBook.wait();

    book= await library.books(1);
    await book;
    expect(book.name).to.equal("1984");
    expect(book.copies).to.equal(1);
  });

  it("returnBook", async function(){
    const Library = await ethers.getContractFactory("Library");
    const library = await Library.deploy();
    await library.deployed();

    const addBook = await library.addBook("1984",2);
    await addBook.wait();

    var book= await library.books(1);
    await book;
    expect(book.name).to.equal("1984");
    expect(book.copies).to.equal(2);

    const borrowBook = await library.borrowBook(1,{ value: ethers.utils.parseEther("0.5")});
    await borrowBook.wait();

    book= await library.books(1);
    await book;
    expect(book.name).to.equal("1984");
    expect(book.copies).to.equal(1);

    const returnBook = await library.returnCurrentBook();
    await returnBook.wait();

    book= await library.books(1);
    await book;
    expect(book.name).to.equal("1984");
    expect(book.copies).to.equal(2);
  });

  it("Error with borrowBook for second borrowing", async function(){
    const Library = await ethers.getContractFactory("Library");
    const library = await Library.deploy();
    await library.deployed();

    const addBook = await library.addBook("1984",2);
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

  it("Non owner try to add book",async function(){
    const [_owner, addr1, addr2] = await ethers.getSigners();
    const Library = await ethers.getContractFactory("Library");
    const library = await Library.deploy();
    await library.deployed();

    const addBook = await library.connect(_owner).addBook("1984",2);
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
  it("Multiple users trying to borrow",async function(){
    const [_owner, addr1, addr2] = await ethers.getSigners();
    const Library = await ethers.getContractFactory("Library");
    const library = await Library.deploy();
    await library.deployed();

    const addBook = await library.connect(_owner).addBook("1984",2);
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
  it("borrowBook erro for not paying", async function(){
    const Library = await ethers.getContractFactory("Library");
    const library = await Library.deploy();
    await library.deployed();

    const addBook = await library.addBook("1984",2);
    await addBook.wait();

    var book= await library.books(1);
    await book;
    expect(book.name).to.equal("1984");
    expect(book.copies).to.equal(2);
    const borrowBook = await library.borrowBook(1,{ value: ethers.utils.parseEther("0.5")});
    await borrowBook.wait();

    const withdraw = await library.withdraw();
    await withdraw.wait();

  });


  it("withdraw", async function(){
    const Library = await ethers.getContractFactory("Library");
    const library = await Library.deploy();
    await library.deployed();
    const addBook = await library.addBook("1984",2);
    await addBook.wait();

    var book= await library.books(1);
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
