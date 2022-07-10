import * as React from 'react';
import styled from 'styled-components';

import Web3Modal from 'web3modal';
// @ts-ignore
import WalletConnectProvider from '@walletconnect/web3-provider';
import Column from './components/Column';
import Wrapper from './components/Wrapper';
import Header from './components/Header';
import Loader from './components/Loader';
import ConnectButton from './components/ConnectButton';

import Info from './components/Info';

import { Web3Provider } from '@ethersproject/providers';
import { getChainData } from './helpers/utilities';

import {
  LIBRARY_ADDRESS
} from './constants';
import { getContract } from './helpers/ethers';
import LIBRARY from './constants/abis/Library.json';
// import './constants/abis/Library.json' as LIBRARY;

const SLayout = styled.div`
  position: relative;
  width: 100%;
  min-height: 100vh;
  text-align: center;
`;

const SContent = styled(Wrapper)`
  width: 100%;
  height: 100%;
  padding: 0 16px;
`;

const SContainer = styled.div`
  height: 100%;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  word-break: break-word;
`;

const SLanding = styled(Column)`
  height: 600px;
`;

// @ts-ignore
const SBalances = styled(SLanding)`
  height: 100%;
  & h3 {
    padding-top: 30px;
  }
`;



interface IAppState {
  fetching: boolean;
  address: string;
  library: any;
  connected: boolean;
  chainId: number;
  pendingRequest: boolean;
  result: any | null;
  libContract: any | null;
  info: any | null;
  count: any;
}

const INITIAL_STATE: IAppState = {
  fetching: false,
  address: '',
  library: null,
  connected: false,
  chainId: 1,
  pendingRequest: false,
  result: null,
  libContract: null,
  info: null,
  count: 0,
};


class App extends React.Component<any, any> {
  // @ts-ignore
  public web3Modal: Web3Modal;
  public state: IAppState;
  public provider: any;

  constructor(props: any) {
    super(props);
    this.state = {
      ...INITIAL_STATE
    };

    this.web3Modal = new Web3Modal({
      network: this.getNetwork(),
      cacheProvider: true,
      providerOptions: this.getProviderOptions()
    });
  }

  public componentDidMount() {
    if (this.web3Modal.cachedProvider) {
      this.onConnect();
    }
  }

  public onConnect = async () => {
    this.provider = await this.web3Modal.connect();

    const library = new Web3Provider(this.provider);

    const network = await library.getNetwork();

    const address = await this.provider.selectedAddress;//  ? this.provider.selectedAddress : await this.provider.accounts[0];


    const libContract = getContract(LIBRARY_ADDRESS, LIBRARY.abi, library, address);
    await this.setState({
      provider:this.provider,
      library,
      chainId: network.chainId,
      address,
      connected: true,
      libContract
      
    });
    await this.subscribeToProviderEvents(this.provider);
  };

  public subscribeToProviderEvents = async (provider:any) => {
    if (!provider.on) {
      return;
    }

    provider.on("accountsChanged", this.changedAccount);
    provider.on("networkChanged", this.networkChanged);
    provider.on("close", this.close);

    await this.web3Modal.off('accountsChanged');
  };

  public async unSubscribe(provider:any) {
    // Workaround for metamask widget > 9.0.3 (provider.off is undefined);
    window.location.reload(false);
    if (!provider.off) {
      return;
    }

    provider.off("accountsChanged", this.changedAccount);
    provider.off("networkChanged", this.networkChanged);
    provider.off("close", this.close);
  }

  public changedAccount = async (accounts: string[]) => {
    if(!accounts.length) {
      // Metamask Lock fire an empty accounts array 
      await this.resetApp();
    } else {
      await this.setState({ address: accounts[0] });
    }
  }

  public networkChanged = async (networkId: number) => {
    const library = new Web3Provider(this.provider);
    const network = await library.getNetwork();
    const chainId = network.chainId;
    await this.setState({ chainId, library });
  }
  
  public close = async () => {
    this.resetApp();
  }

  public getNetwork = () => getChainData(this.state.chainId).network;

  public getProviderOptions = () => {
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId: process.env.REACT_APP_INFURA_ID
        }
      }
    };
    return providerOptions;
  };

  public resetApp = async () => {
    await this.web3Modal.clearCachedProvider();
    localStorage.removeItem("WEB3_CONNECT_CACHED_PROVIDER");
    localStorage.removeItem("walletconnect");
    await this.unSubscribe(this.provider);

    this.setState({ ...INITIAL_STATE });

  };

  public getContr = async () => {
    const c = await this.state.libContract;
    return c;
  }

  public render = () => {
    const {
      address,
      connected,
      chainId,
      fetching
    } = this.state;

    // const c= await this.getCount();

    return (
      <SLayout>
        <Column maxWidth={1000} spanHeight>
          <Header
            connected={connected}
            address={address}
            chainId={chainId}
            killSession={this.resetApp}
          />        
          <SContent>
            <Info  getContract={this.getContr}  />
            {LIBRARY_ADDRESS}
            <br/>
            {LIBRARY.abi[10].type}
            <br/>
            {this.state.library ? "a" : "b"}
            <br/>
            {address}
            <br/>
            {this.state.libContract?"a":"b"}
            {fetching ? (
              <Column center>
                <SContainer>
                  <Loader />
                </SContainer>
              </Column>
            ) : (
                <SLanding center>
                  {!this.state.connected && <ConnectButton onClick={this.onConnect} />}
                </SLanding>
              )}
          </SContent>
        </Column>
        

      </SLayout>
    );
  };
}

export default App;
