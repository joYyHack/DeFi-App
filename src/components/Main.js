import React, { Component } from "react";
import dai from "../dai.png";

import "./Main.css";

class Main extends Component {
  render() {
    return (
      <div>
        <div id="content" className="mt-3">
          <table className="w-100">
            <thead>
              <tr className="text-center">
                <th scope="col">Staking balance</th>
                <th scope="col">Rewarding balance</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-center">
                <td>
                  {window.web3.utils.fromWei(
                    this.props.stakingBalance,
                    "Ether"
                  )}{" "}
                  DAI
                </td>
                <td>
                  {window.web3.utils.fromWei(
                    this.props.dappTokenBalance,
                    "Ether"
                  )}{" "}
                  DAPP
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div id="content" className="mt-3">
          <div className="card mb-4">
            <div className="card-body">
              <form
                className="mb-3"
                onSubmit={(event) => {
                  event.preventDefault();
                  let amount;
                  amount = this.input.value.toString();
                  amount = window.web3.utils.toWei(amount, "Ether");
                  this.props.stakeTokens(amount);
                }}
              >
                <div className="d-flex justify-content-between">
                  <label>
                    <b>Stake tokens</b>
                  </label>
                  <span className="text-muted">
                    Balance:&nbsp;
                    {window.web3.utils.fromWei(
                      this.props.daiTokenBalance,
                      "Ether"
                    )}
                  </span>
                </div>
                <div className="input-group mb-4">
                  <input
                    type="text"
                    ref={(input) => (this.input = input)}
                    className="form-control form-control-lg"
                    placeholder="0"
                    required
                  />
                  <div className="input-group-append">
                    <div className="input-group-text">
                      <img src={dai} height="34" alt="" />
                      &nbsp;&nbsp;&nbsp; DAI
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  className="btn btn-primary btn-lock btn-lg"
                >
                  STAKE!
                </button>
              </form>
              <button
                onClick={(event) => {
                  event.preventDefault();
                  this.props.withdrawTokens();
                }}
                type="submit"
                className="btn btn-link btn-lock btn-lg"
              >
                UN-STAKE!
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Main;
