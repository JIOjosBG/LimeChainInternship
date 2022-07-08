const { expect } = require("chai");
const { ethers } = require("hardhat");

const Library = require('../artifacts/contracts/Library.sol/Library.json')
const run = async function() {
	const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545")
	const latestBlock = await provider.getBlock("latest")
	console.log(latestBlock.hash);
    const wallet = new ethers.Wallet("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", provider);
	const balance = await wallet.getBalance();
	console.log(ethers.utils.formatEther(balance, 18))
    console.log(balance.toString())

    const library = new ethers.Contract("0xD5Fd909A81dd17e8C136e3B94f613444BDc4Faf1", Library.abi, wallet)
	//console.log(libraryContract)

    const addBook = await library.addBook("1984",2);
    await addBook.wait();

    var borrowBook= await library.borrowBook(1,{ value: ethers.utils.parseEther("0.5")});
    await borrowBook;

    
    var a= await library.getBook(1);

    // var returnBook= await library.returnCurrentBook();
    // await returnBook;
}

run()