

const Library = require('../artifacts/contracts/Library.sol/Library.json')


const run = async function() {
	const provider = new hre.ethers.providers.InfuraProvider("ropsten", "40c2813049e44ec79cb4d7e0d18de173")
	
	const latestBlock = await provider.getBlock("latest")
	console.log(latestBlock.hash);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
	const balance = await wallet.getBalance();
	console.log(ethers.utils.formatEther(balance, 18))
    console.log(balance.toString())

    const library = new ethers.Contract("0xD5Fd909A81dd17e8C136e3B94f613444BDc4Faf1", Library.abi, wallet)
	//console.log(libraryContract)

    // const addBook = await library.addBook("1984",2);
    // await addBook.wait();

    // var borrowBook= await library.borrowBook(1,{ value: ethers.utils.parseEther("0.5")});
    // await borrowBook;
    var a= await library.getBook(1);
    await a;
    console.log(a.copies);
    
    // var returnBook= await library.returnCurrentBook();
    // await returnBook;

    // try{
    //     var a= await library.getBook(1);
    //     await a;
    //     console.log(a.copies);
    //     var returnBook= await library.returnCurrentBook();
    //     await returnBook;
    // }catch(error){
    //     console.log(error.name);
    // }
}

run();