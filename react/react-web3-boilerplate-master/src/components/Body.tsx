import React, { Component } from 'react'
// import Button from './Button';
// import Column from './Column';
// import styled from 'styled-components';
import { Circles } from 'react-loader-spinner'
import { Container, Row, Col, Form } from 'react-bootstrap'
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

import { ethers,utils } from "ethers";

// import Column from './Column';



// const Wrapper = styled.section`
//   # width:100%;
//   background: papayawhip;
// `;
const bookStyle = {
  width: '100%',
  // backgroundColor: "#eeffee",
}
const availableBook = {
  backgroundColor: "#28eb9b",
  borderColor: '#28eb9b'
}
const unavailableBook = {
  backgroundColor: "#ff7f3c",
  borderColor: '#ff7f3c'
}

const controlButton = {
  backgroundColor: "#d5db5d",
  borderColor: '#d5db5d'
}



class Body extends Component<any, any> {
  public myTimer: NodeJS.Timeout;
  constructor(props: any) {
    super(props);
    this.state = {library: props.library, provider:props.provider, userAddress:props.address, lib: props.lib, contract: props.getContract(), getContract: props.getContract, user: props.user, token: props.tokenContract };
    this.init()
  }
  public componentDidMount = () => {
    this.myTimer = setInterval(() => {
      this.update();
    }, 1000)
  }



  public getContract = async () => {
    this.setState({ contract: await this.state.getContract() });
    // return this.state.contract;
    
  }

  public getBookCount = async () => {
    const c = await this.state.contract.count();
    this.setState({ bookCount: parseInt(c._hex, 16) });

    // return b.copies._hex;
  }

  public getPricePerBorrow = async () => {
    const price = await this.state.contract.PRICE();
    this.setState({ price: parseInt(price._hex, 16) })
  }
  public loadBooks = async () => {
    await this.getBookCount();
    const books: any[] = new Array();
    for (let i = 0; i < this.state.bookCount; i++) {
      books[i] = await (this.state.contract.getBook(i + 1));
    }
    this.setState({ books })
  }
  public checkIfHasToReturn = async () => {
    const hasToReturn = await this.state.contract.currentlyBorrowing(this.state.user);
    this.setState({ hasToReturn: parseInt(hasToReturn._hex, 16) });
  }

  // uint256 _index,
  // uint256 value,
  // uint256 deadline,
  // uint8 v,
  // bytes32 r,
  // bytes32 s

  public borrowBook = async (i: number) => {
    const preparedSignature = await this.onAttemptToApprove();
    const {v,r,s,deadline} = preparedSignature;
    
    
    const borrow = await this.state.contract.borrowBook(i, utils.parseEther('0.01'), deadline, v, r, s);
    await borrow;
    await this.update();
  }

  public checkIfOwner = async () => {
    const owner = await this.state.contract.owner();
    const isOwner = owner.toUpperCase() === this.state.user.toUpperCase()
    this.setState({ owner, isOwner })
  }

  public getCurrentBook = async () => {
    const currentBookIndex = await this.state.contract.currentlyBorrowing(this.state.user);
    const currentBook = await this.state.contract.getBook(currentBookIndex);
    this.setState({ currentBook })
  }
  public init = async () => {
    await this.getContract();
    await this.update();
  }
  
  public getBalances = async () => {
    // const libraryBalance = await this.state.lib.getBalance(this.state.contract.address);
    // await this.setState({ libraryBalance: parseInt(libraryBalance._hex, 16) })
    // const ethValue = ethers.utils.formatEther(1000000000000);


    const libraryBalance = (await this.state.token.balanceOf(this.state.contract.address))._hex;
    const userBalance =  (await this.state.token.balanceOf(this.state.userAddress))._hex;
    await this.setState({ libraryBalance: ethers.utils.formatEther(libraryBalance) });
    // const balance = typeof await this.state.provider.get;

    // await this.setState({ libraryETHBalance: balance });

    await this.setState({ userBalance: ethers.utils.formatEther(userBalance) });
    
  }

  public update = async () => {
    await this.getBookCount();
    await this.loadBooks();
    await this.checkIfHasToReturn();
    await this.checkIfOwner();
    await this.getCurrentBook();
    await this.getBalances();
    await this.getPricePerBorrow();
  }

  public returnBook = async () => {
    const ret = await this.state.contract.returnCurrentBook();
    await ret;
    await this.update();
  }

  public addBook = async (isbn: string, name: string, c: number) => {
    const add = await this.state.contract.addBook(isbn, name, c);
    await add;
    this.update()
  }

  public handleChange(event: any) {
    this.setState({ bookName: event.target.value });
  }
  public withdraw = async () => {
    await this.state.contract.withdraw();
  }

  public buyLIB = async () => {
    await this.state.contract.buyLIB({ value: utils.parseEther(this.state.libToBuy) });
    // await this.state.token.approve(await this.state.contract.address,await this.state.contract.PRICE());
  }
  public togglePopup = () => {
    this.setState({isOpen:!this.state.isOpen});
  }
  public giveAllowance = async () =>{
    await this.state.token.approve(await this.state.contract.address,"10000000000000000");
  }

  // public signMessage = async () => {
  //   const messageToSign = "watafak"
  //   const signer = this.state.library.getSigner();
  //   const messageHash = utils.solidityKeccak256(['string'], [messageToSign])
  //   const arrayfiedHash = utils.arrayify(messageHash);
  //   const signedMessage = await signer.signMessage(arrayfiedHash);
  //   return signedMessage;

  // }

  public async onAttemptToApprove() {
		const { token, userAddress, library } = this.state;
		
		const nonce = (await token.nonces(userAddress)); // Our Token Contract Nonces
    const deadline = + new Date() + 60 * 60; // Permit with deadline which the permit is valid
    const wrapValue = utils.parseEther('0.01'); // Value to approve for the spender to use
		
		const EIP712Domain = [ // array of objects -> properties from the contract and the types of them ircwithPermit
      { name: 'name', type: 'string' },
      { name: 'version', type: 'string' },
      { name: 'verifyingContract', type: 'address' }
    ];

    const domain = {
        name: await token.name(),
        version: '1',
        verifyingContract: token.address
    };

    const Permit = [ // array of objects -> properties from erc20withpermit
        { name: 'owner', type: 'address' },
        { name: 'spender', type: 'address' },
        { name: 'value', type: 'uint256' },
        { name: 'nonce', type: 'uint256' },
        { name: 'deadline', type: 'uint256' }
    ];

    const message = {
        owner: userAddress,
        spender: this.state.contract.address,
        value: wrapValue.toString(),
        nonce: nonce.toHexString(),
        deadline
    };

    const data = JSON.stringify({
        types: {
            EIP712Domain,
            Permit
        },
        domain,
        primaryType: 'Permit',
        message
    })

    const signatureLike = await library.send('eth_signTypedData_v4', [userAddress, data]);
    const signature = await utils.splitSignature(signatureLike)

    const preparedSignature = {
        v: signature.v,
        r: signature.r,
        s: signature.s,
        deadline
    }

    return preparedSignature
}



  public render() {
    return (

      <Container>
        {/* <Row>
          <Col>
              <Button onClick={this.signMessage}>
                sign message
              </Button>
          </Col>
        </Row> */}
        <Row>
          <Col>
          <Form>
              <Form.Control
                type="number"
                placeholder="amount"
                value={this.state.libToBuy}
                onChange={(e) => this.setState({ libToBuy: e.target.value })}
              />

              <Button style={{ ...controlButton }} onClick={() => {
                this.buyLIB()
                this.setState({ libToBuy: ""})
              }}>
                BUY LIB tokens
              </Button>
            </Form>
          </Col>
          <Col>
              <h5>
                You have {this.state.userBalance} LIB
              </h5>
          </Col>
          <Col>
              <Button onClick={this.giveAllowance}>
                Give allowance
              </Button>
          </Col>

        </Row>
        <Row className="rows">
          <Col className="cols">
            {this.state.hasToReturn ? <Button style={{ ...controlButton }} onClick={this.returnBook}>Return {this.state.currentBook ? this.state.currentBook.name : "current book"}</Button> : <h5>You can borrow a book</h5>}
            {!this.state.contract && <Button style={{ ...controlButton }} onClick={this.init}>init</Button>}
          </Col>
          <Col>
            <h5>
              Books are {this.state.bookCount}
              {/* <Button onClick={this.update}>Update</Button> */}
            </h5>
          </Col>
          {
            this.state.isOwner &&
            <Col>

              <Form>
                <Form.Control
                  type="text"
                  value={this.state.value}
                  placeholder="name"
                  onChange={(e) => this.setState({ value: e.target.value })}
                />
                <Form.Control
                  type="text"
                  placeholder="isbn"
                  value={this.state.isbn}
                  onChange={(e) => this.setState({ isbn: e.target.value })}
                />

                <Form.Control
                  type="number"
                  placeholder="count"
                  value={this.state.number}
                  onChange={(e) => this.setState({ number: e.target.value })}
                />

                <Button style={{ ...controlButton }} onClick={() => {
                  this.addBook(this.state.isbn, this.state.value, this.state.number)
                  this.setState({ isbn: "", value: "", number: "" })
                }}>
                  Add book
                </Button>
              </Form>
            </Col>
          }
          {this.state.isOwner &&
            <Col>
              <Button style={{ ...controlButton }} onClick={this.withdraw}>
                Withdraw
              </Button>
            </Col>
          }
          {this.state.isOwner &&
            <Col>
              <h3>
                {this.state.libraryBalance} LIB in da bank
                {this.state.libraryETHBalance} LIB in da bank
              </h3>
            </Col>
          }
        </Row>
        <Container>
          <Row>
            {this.state.books ?
              this.state.books.map((book: any, index: number) => {
                return (<Col style={{ padding: 10 }} lg={4} key={book.name}>
                  <img src={"https://covers.openlibrary.org/b/isbn/" + book.isbn + "-M.jpg"} />
                  {parseInt(book.copies._hex, 16)
                    ?
                    <Button style={{ ...bookStyle, ...availableBook }} onClick={() => this.borrowBook(index + 1,)} key={book.name}> {book.name} - {parseInt(book.copies._hex, 16)}</Button>
                    :
                    <Button style={{ ...bookStyle, ...unavailableBook }} onClick={() => this.borrowBook(index + 1)} key={book.name}> {book.name} - {parseInt(book.copies._hex, 16)}</Button>
                  }
                </Col>
                )
              })
              :
              <Circles color="#00BFFF" height={80} width={80} />
            }
          </Row>
        </Container>
      </Container>
    );
  }
}


export default Body
