const { expect } = require("chai");
const { ethers } = require("hardhat");

//require('solidity-coverage');


describe("Basic erc20", function () {
  it("Deploy", async function(){
    const Library = await ethers.getContractFactory("Library");
    const library = await Library.deploy();
    await library.deployed();
  });

  it("get LIB", async function(){

    const [_owner, addr1, addr2] = await ethers.getSigners();
    const Library = await ethers.getContractFactory("Library");
    const library = await Library.deploy();
    await library.deployed();

    const getLIB = await library.buyLIB({ value: ethers.utils.parseEther("0.1")});
    await getLIB.wait();

    const Token = await ethers.getContractFactory("LIB");
    const token = await Token.attach(
      library.token()
    );
    expect(await token.balanceOf(_owner.address)).to.equal(ethers.utils.parseEther("0.1"));
  });
  it("get LIB no ETH err", async function(){

    const [_owner, addr1, addr2] = await ethers.getSigners();
    const Library = await ethers.getContractFactory("Library");
    const library = await Library.deploy();
    await library.deployed();
    let err=false;
    try{
      const getLIB = await library.buyLIB();
      await getLIB.wait();
    }catch(e){
      err=true;
    }
    expect(err).to.equal(true);

  });

  it("get allowance for LIB", async function(){
    const [_owner, addr1, addr2] = await ethers.getSigners();
    const Library = await ethers.getContractFactory("Library");
    const library = await Library.deploy();
    await library.deployed();
    const price  = await library.PRICE();

    const Token = await ethers.getContractFactory("LIB");
    const token = await Token.attach(
      library.token()
    );
    token.connect(_owner).increaseAllowance(library.address,price);
    const allowance = await token.allowance(_owner.address,library.address);

    expect(allowance).to.equal(price);
  });

  it("get LIB frmo library", async function(){
    const [_owner, addr1, addr2] = await ethers.getSigners();
    const Library = await ethers.getContractFactory("Library");
    const library = await Library.deploy();
    await library.deployed();
    const price  = await library.PRICE();
    const buyLIB = await library.buyLIB({ value: price});
    await buyLIB.wait();

    const Token = await ethers.getContractFactory("LIB");
    const token = await Token.attach(
      library.token()
    );
    const balance = await token.balanceOf(_owner.address);
    expect(balance).to.equal(price);
  });
});

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
    const Token = await ethers.getContractFactory("LIB");
    const token = await Token.attach(
      library.token()
    );
    const addBook = await library.addBook("9786589711377","1984",2);
    await addBook.wait();
    const getLIB = await library.buyLIB({ value: ethers.utils.parseEther("0.1")});
    await getLIB.wait();
    await token.approve(await library.address,await library.PRICE())
    const borrowBook = await library.borrowBook(1);
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

    const Token = await ethers.getContractFactory("LIB");
    const token = await Token.attach(
      library.token()
    );
    const getLIB = await library.buyLIB({ value: ethers.utils.parseEther("0.1")});
    await getLIB.wait();

    token.approve(library.address,await library.PRICE());

    const addBook = await library.addBook("9786589711377","1984",2);
    await addBook.wait();

    var book= await library.getBook(1);
    await book;

    expect(book.name).to.equal("1984");
    expect(book.copies).to.equal(2);

    const borrowBook = await library.borrowBook(1);
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
    const Token = await ethers.getContractFactory("LIB");
    const token = await Token.attach(
      library.token()
    );
    const getLIB = await library.buyLIB({ value: ethers.utils.parseEther("0.1")});
    await getLIB.wait();

    token.approve(library.address,await library.PRICE());

    const addBook = await library.addBook("9786589711377","1984",2);
    await addBook.wait();

    const borrowBook = await library.borrowBook(1);
    await borrowBook.wait();
    var err=false;
    try {
      await library.borrowBook(1);
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

    const Token = await ethers.getContractFactory("LIB");
    const token = await Token.attach(
      library.token()
    );
    const getLIB = await library.buyLIB({ value: ethers.utils.parseEther("0.1")});
    await getLIB.wait();

    token.approve(library.address,await library.PRICE());

    const getLIB2 = await library.connect(addr1).buyLIB({ value: ethers.utils.parseEther("0.1")});
    await getLIB2.wait();

    token.connect(addr1).approve(library.address,await library.PRICE());

    const addBook = await library.connect(_owner).addBook("9786589711377","1984",2);
    await addBook.wait();
    var err= false;
    
    var borrowBook = await library.borrowBook(1);
    await borrowBook.wait();
    borrowBook = await library.connect(addr1).borrowBook(1);
    await borrowBook.wait();

    try{
      borrowBook = await library.connect(addr2).borrowBook(1);
      await borrowBook.wait();
    }catch(error){
      err=true;
      expect(error.name).to.equals("Error");
    };
    expect(err).to.equal(true);
  });
  it("borrow no LIB", async function(){
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
  it("Borrow no allowance", async function(){
    const Library = await ethers.getContractFactory("Library");
    const library = await Library.deploy();
    await library.deployed();

    const Token = await ethers.getContractFactory("LIB");
    const token = await Token.attach(
      library.token()
    );
    const getLIB = await library.buyLIB({ value: ethers.utils.parseEther("0.1")});
    await getLIB.wait();

    // token.approve(library.address,await library.PRICE());

    const addBook = await library.addBook("9786589711377","1984",2);
    await addBook.wait();

    var book= await library.getBook(1);
    await book;

    expect(book.name).to.equal("1984");
    expect(book.copies).to.equal(2);
    let err = false;
    try{
      const borrowBook = await library.borrowBook(1);
      await borrowBook.wait();
    }catch(e){
      err=true;
    }
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
    const Token = await ethers.getContractFactory("LIB");
    const token = await Token.attach(
      library.token()
    );

    const getLIB = await library.buyLIB({ value: ethers.utils.parseEther("0.1")});
    await getLIB.wait();
    await token.approve(await library.address,await library.PRICE())


    var book= await library.getBook(1);
    await book;
    expect(book.name).to.equal("1984");
    expect(book.copies).to.equal(2);

    const borrowBook = await library.borrowBook(1);
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

    const [_owner, addr1, addr2] = await ethers.getSigners();
    const Library = await ethers.getContractFactory("Library");
    const library = await Library.deploy();
    await library.deployed();

    const addBook = await library.addBook("9786589711377","1984",2);
    await addBook.wait();

    const Token = await ethers.getContractFactory("LIB");
    const token = await Token.attach(
      library.token()
    );

    const getLIB = await library.buyLIB({ value: ethers.utils.parseEther("0.5")});
    await getLIB.wait();
    await token.approve(await library.address,await library.PRICE())


    var book= await library.getBook(1);
    await book;
    expect(book.name).to.equal("1984");
    expect(book.copies).to.equal(2);
    const borrowBook = await library.borrowBook(1);
    await borrowBook.wait();
    const old_balance= await _owner.getBalance();
    const withdraw = await library.withdraw();
    await withdraw.wait();
    const new_balance= await _owner.getBalance();
    // console.log(old_balance);
    // console.log(new_balance);
    expect(await token.balanceOf(library.address)).equal(0);

    expect(false).equal(new_balance<old_balance);
  });

  it("non owner withdraw", async function(){
    

    const [_owner, addr1, addr2] = await ethers.getSigners();

    const Library = await ethers.getContractFactory("Library");
    const library = await Library.deploy();
    await library.deployed();

    const addBook = await library.addBook("9786589711377","1984",2);
    await addBook.wait();

    const Token = await ethers.getContractFactory("LIB");
    const token = await Token.attach(
      library.token()
    );

    const getLIB = await library.buyLIB({ value: ethers.utils.parseEther("0.5")});
    await getLIB.wait();
    await token.approve(await library.address,await library.PRICE())

    var book= await library.getBook(1);
    await book;
    expect(book.name).to.equal("1984");
    expect(book.copies).to.equal(2);
    const borrowBook = await library.borrowBook(1);
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