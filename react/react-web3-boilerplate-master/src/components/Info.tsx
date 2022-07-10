import  React, {Component} from 'react'
// import Button from './Button';
// import Column from './Column';

class Info extends Component<any, any> {
    constructor(props: any) {
      super(props);
      this.state = {contract: props.getContract(),getContract: props.getContract};
      this.getContract()
    }
    public getContract = async () => {
        this.setState({contract: await this.state.getContract()});
        return this.state.contract;

    } 

    public getBookCount = async () => {
        const c = await this.state.contract.count();
        this.setState({bookCount: parseInt(c._hex,16)});

        // return b.copies._hex;
    } 

    public getBook = async () => {
        const c = await this.state.contract.getBook(1);
        const b = await c.copies;
        this.setState({bookCount: parseInt(b._hex,16)});

        // return b.copies._hex;
    } 
    
    public render (){
      return (
        <div onLoad= {() => this.getContract().then( () => this.getBookCount())}>
            <h1>
            {  this.state.contract
            ?
            <div>
                <h1>{this.state.bookCount}</h1>
                {this.state.msg}
                <button onClick={this.getBookCount}>getBook</button>
            </div>
            :
            <button onClick={this.getContract}>getContract</button>
            }
            </h1>
        </div>
      );
    }
  }


export default Info
