//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.10;

import "./DaiToken.sol";
import "./DappToken.sol";

contract TokenFarm {
  string public name = "DAPP Token Farm";
  address public owner;
  DaiToken public daiToken;
  DappToken public dappToken;

  address[] public stakers;
  mapping(address => uint256) public stakersBalances;
  mapping(address => bool) public hasStaked;
  mapping(address => bool) public isStaking;

  constructor(DaiToken _daiToken, DappToken _dappToken) {
    daiToken = _daiToken;
    dappToken = _dappToken;
    owner = msg.sender;
  }

  //deposit
  function stakeTokens(uint256 _amount) public {
    require(_amount > 0, "Amount must be greater than 0");

    //transfer dai tokens to token farm
    daiToken.transferFrom(msg.sender, address(this), _amount);

    // update stakers balance
    stakersBalances[msg.sender] += _amount;

    //add new stakers
    if (!hasStaked[msg.sender]) {
      stakers.push(msg.sender);

      hasStaked[msg.sender] = true;
      isStaking[msg.sender] = true;
    }
  }

  function issueTokens() public {
    require(
      msg.sender == owner,
      "Only the owner of this contract can issue tokens"
    );

    for (uint256 i = 0; i < stakers.length; i++) {
      address receiver = stakers[i];
      uint256 balance = stakersBalances[receiver];

      if (balance > 0) {
        dappToken.transfer(receiver, balance);
      }
    }
  }
}
