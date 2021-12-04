import React, { Component } from "react";
import Navbar from "./Navbar";
import Main from "./Main";
import Web3 from "web3";
import _ from "lodash";

import DaiToken from "../abis/DaiToken.json";
import DappToken from "../abis/DappToken.json";
import TokenFarm from "../abis/TokenFarm.json";
import "./App.css";

class App extends Component {
  async componentDidMount() {
    await this.connectToAccount();
    await this.setAccount();
    this.loadWeb3();
    await this.loadBlockchainData();
  }

  constructor(props) {
    super(props);
    this.state = {
      account: "0x0",
      daiToken: {},
      dappToken: {},
      tokenFarm: {},
      daiTokenBalance: 0,
      dappTokenBalance: 0,
      stakingBalance: 0,
      loading: true,
    };
  }

  printSuccess(message) {
    console.log(`Success: ${message}`);
  }

  async connectToAccount() {
    if (window.ethereum) {
      try {
        await window.ethereum
          .request({ method: "eth_requestAccounts" })
          .catch((err) => {
            console.error(`Err: ${err.message}\nPlease connect to MetaMask`);
          });

        this.printSuccess("Connect to account");
      } catch (error) {
        alert(error.message);
      }
    } else {
      alert("Non-ethereum browser was detected.");
    }
  }

  async setAccount() {
    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    this.setState({ account: accounts[0] });

    this.printSuccess("Set account");
  }

  loadWeb3() {
    window.web3 = new Web3(window.ethereum);

    this.printSuccess("Load web3");
  }

  async loadBlockchainData() {
    try {
      const networkId = await window.ethereum.request({
        method: "net_version",
      });

      await this.setTokenData(DaiToken, networkId);
      await this.setTokenData(DappToken, networkId);
      await this.setTokenData(TokenFarm, networkId);

      this.printSuccess("Load blockchain data");

      this.setState({ loading: false });
      console.log(this.state);
    } catch (error) {
      alert(error.message);
    }
  }

  async setTokenData(token, networkId) {
    try {
      const tokenData = token.networks[networkId];

      const contract = new window.web3.eth.Contract(
        token.abi,
        tokenData.address
      );
      const tokenName = _.camelCase(token.contractName);
      this.setState({ [tokenName]: contract });

      if (token.contractName === Object.keys({ TokenFarm })[0]) {
        let stakingBalance = await contract.methods
          .stakersBalances(this.state.account)
          .call();

        this.setState({ stakingBalance });
      } else {
        let tokenBalance = (
          await contract.methods.balanceOf(this.state.account).call()
        ).toString();

        this.setState({ [`${tokenName}Balance`]: tokenBalance });
      }

      this.printSuccess(`Load ${tokenName}`);
    } catch (error) {
      alert(error.message);
    }
  }

  stakeTokens = (amount) => {
    this.setState({ loading: true });
    this.state.daiToken.methods
      .approve(this.state.tokenFarm._address, amount)
      .send({ from: this.state.account })
      .on("transactionHash", () => {
        this.state.tokenFarm.methods
          .stakeTokens(amount)
          .send({ from: this.state.account })
          .on("transactionHash", () => {
            this.setState({ loading: false });
          });
      });
  };

  withdrawTokens = () => {
    this.setState({ loading: true });
    this.state.dappToken.methods
      .approve(this.state.tokenFarm._address, this.state.stakingBalance)
      .send({ from: this.state.account })
      .on("transactionHash", () => {
        this.state.tokenFarm.methods
          .withdrawTokens()
          .send({ from: this.state.account })
          .on("transactionHash", () => this.setState({ loading: false }));
      });
  };

  render() {
    let content;
    if (this.state.loading)
      content = (
        <p id="loader" className="text-center">
          Loading...
        </p>
      );
    else
      content = (
        <Main
          daiTokenBalance={this.state.daiTokenBalance}
          dappTokenBalance={this.state.dappTokenBalance}
          stakingBalance={this.state.stakingBalance}
          stakeTokens={this.stakeTokens}
          withdrawTokens={this.withdrawTokens}
        />
      );

    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main
              role="main"
              className="col-lg-12 ml-auto mr-auto"
              style={{ maxWidth: "600px" }}
            >
              <div className="content mr-auto ml-auto">
                <a
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                ></a>

                {content}
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
