const TokenFarm = artifacts.require("TokenFarm");
const DappToken = artifacts.require("DappToken");
const DaiToken = artifacts.require("DaiToken");

module.exports = async function (deployer, network, accounts) {
  // deploy dapp tokens
  await deployer.deploy(DappToken);
  const dappToken = await DappToken.deployed();

  //deploy mock dai tokens
  await deployer.deploy(DaiToken);
  const daiToken = await DaiToken.deployed();

  //deploy token farm
  await deployer.deploy(TokenFarm, daiToken.address, dappToken.address);
  const tokenFarm = await TokenFarm.deployed();

  //transfer all dapp tokens to token farm
  await dappToken.transfer(tokenFarm.address, "1000000000000000000000000");

  //transfer 100 dai tokens to investor
  await daiToken.transfer(accounts[1], "1000000000000000000000");
};
