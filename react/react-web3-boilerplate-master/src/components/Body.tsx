import  React, {Component} from 'react'
// import Button from './Button';
// import Column from './Column';
// import styled from 'styled-components';
import { Circles } from  'react-loader-spinner'
import { Container, Row, Col, Form}  from 'react-bootstrap'
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

// import Column from './Column';



// const Wrapper = styled.section`
//   # width:100%;
//   background: papayawhip;
// `;

class Body extends Component<any, any> {
    public myTimer: NodeJS.Timeout;
    constructor(props: any) {
      super(props);
      this.state = {contract: props.getContract(),getContract: props.getContract,user: props.user};
      this.init()
    }
    public componentDidMount = () => {
      this.myTimer = setInterval(() => {
        this.update();
      },1000)
    }



    public getContract = async () => {
        this.setState({contract: await this.state.getContract()});
        // return this.state.contract;

    } 

    public getBookCount = async () => {
        const c = await this.state.contract.count();
        this.setState({bookCount: parseInt(c._hex,16)});

        // return b.copies._hex;
    } 

    public loadBooks = async () => {
        await this.getBookCount();
        const books:any[] = new Array();
        for(let i=0;i<this.state.bookCount;i++){
            books[i] = await (this.state.contract.getBook(i+1));
        }
        this.setState({books})
    }
    public checkIfHasToReturn = async () => {
      const hasToReturn = await this.state.contract.currentlyBorrowing(this.state.user);
      this.setState({hasToReturn:parseInt(hasToReturn._hex,16)});
    }

    public borrowBook = async(i:number) =>{
      const borrow = await this.state.contract.borrowBook(i,{value:"1000000000000"},);
      await borrow;
      await this.update();
    }

    public checkIfOwner = async () => {
      const owner = await this.state.contract.owner();
      const isOwner = owner.toUpperCase()===this.state.user.toUpperCase()
      this.setState({owner,isOwner})
    }

    public getCurrentBook = async() => {
      const currentBookIndex = await this.state.contract.currentlyBorrowing(this.state.user);
      const currentBook = await this.state.contract.getBook(currentBookIndex);
      this.setState({currentBook})
    }
    public init = async () =>{
      await this.getContract();
      await this.update();
    }

    public update = async () => {
      await this.getBookCount();
      await this.loadBooks();
      await this.checkIfHasToReturn();
      await this.checkIfOwner();
      await this.getCurrentBook();
    }

    public returnBook = async () => {
      const ret = await this.state.contract.returnCurrentBook();
      await ret;
      await this.update();
    }

    public addBook = async (name:string, c:number) => {
      const add = await this.state.contract.addBook(name,c);
      await add;
      this.update()
    }

    public handleChange(event:any) {
      this.setState({bookName: event.target.value});
    }
    public withdraw = async ()=>{
      await this.state.contract.withdraw();
    }
    public render (){
      return (

        <Container>
          <Row className="rows">
            <Col className="cols">
            {this.state.hasToReturn ? <Button onClick={this.returnBook}>Return {this.state.currentBook ? this.state.currentBook.name : "current book" }</Button> :<h5>You can borrow a book</h5>}
              {!this.state.contract &&  <Button onClick={this.init}>init</Button>}
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
                  onChange={(e) => this.setState({value:e.target.value})}
                  />
                <Button onClick={()=> {
                  this.addBook(this.state.value,1) 
                  this.setState({value:""})
                  }}>
                  Add book
                </Button>
                  </Form>
            </Col> 
    }
    {this.state.isOwner &&
            <Col>
              <Button onClick={this.withdraw}>
                  Withdraw
                </Button>
            </Col>
              }

          </Row>
          <Container>
            
            <Row>
            { this.state.books?
            this.state.books.map((book:any,index:number) => <Col lg={4} key={book.name}><Button onClick={() => this.borrowBook(index+1)}  key={book.name}> {book.name} - {parseInt(book.copies._hex,16)}</Button></Col>)
            :
            <Circles color="#00BFFF" height={80} width={80}/>
            }
            

          </Row>
          </Container>
        </Container>
      );
    }
  }


export default Body
