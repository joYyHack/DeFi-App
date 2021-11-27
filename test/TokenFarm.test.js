const assert = require("assert");
const { expect } = require("chai");

const DappToken = artifacts.require("DappToken");
const DaiToken = artifacts.require("DaiToken");
const TokenFarm = artifacts.require("TokenFarm");

require("chai").use(require("chai-as-promised")).should();

function tokens(ether) {
  return web3.utils.toWei(ether);
}

contract("Token Farm", ([owner, investor]) => {
  let dappToken, daiToken, tokenFarm;

  before(async () => {
    //load contracts
    dappToken = await DappToken.new();
    daiToken = await DaiToken.new();
    tokenFarm = await TokenFarm.new(daiToken.address, dappToken.address);

    //transfer all dapp tokens to farm
    await dappToken.transfer(tokenFarm.address, tokens("1000000"));
    //transfer tokens to investor
    await daiToken.transfer(investor, tokens("1000"), { from: owner });
  });

  describe("Mock DAI deployment", async () => {
    it("Has name - Mock DAI Token", async () => {
      const name = await daiToken.name();
      assert.equal(name, "Mock DAI Token");
    });

    it("Investor has 1000 Dai tokens", async () => {
      let balance = await daiToken.balanceOf(investor);
      assert.equal(balance.toString(), tokens("1000"));
    });
  });

  describe("Mock DAPP deployment", async () => {
    it("Has name - DApp Token", async () => {
      const name = await dappToken.name();
      assert.equal(name, "DApp Token");
    });
  });

  describe("Token Farm deployment", async () => {
    it("Has name - DAPP Token Farm", async () => {
      const name = await tokenFarm.name();
      assert.equal(name, "DAPP Token Farm");
    });

    it("Farm has 1 million tokens", async () => {
      let balance = await dappToken.balanceOf(tokenFarm.address);
      assert.equal(balance.toString(), tokens("1000000"));
    });
  });

  describe("Stake Tokens", async () => {
    it("Investor must has 1000 DAI tokens before staking", async () => {
      //check investor balance before staking
      //1000 tokens are given to investor when contract is deployed
      let investorBalance = (await daiToken.balanceOf(investor)).toString();
      assert.equal(
        investorBalance,
        tokens("1000"),
        "Investor must has 1000 dai tokens"
      );
    });

    it("Investor balance must be 900 DAI tokens after staking", async () => {
      //approve future staking on 100 tokens
      await daiToken.approve(tokenFarm.address, tokens("100"), {
        from: investor,
      });
      //stake tokens
      await tokenFarm.stakeTokens(tokens("100"), { from: investor });

      //check investor balance of dai tokens after staking
      let updatedInvestorBalance = (
        await daiToken.balanceOf(investor)
      ).toString();
      assert.equal(
        updatedInvestorBalance,
        tokens("900"),
        "Investor balance must be 900 dai tokens"
      );
    });

    it("Investor staking balance must be 100", async () => {
      //check investor balance staking balance after staking
      let investorBalanceOfDappTokens = (
        await tokenFarm.stakersBalances(investor)
      ).toString();
      assert.equal(
        investorBalanceOfDappTokens,
        tokens("100"),
        "Investor staking balance must be 100"
      );
    });

    it('Investor current status "is staking"', async () => {
      let isStaking = await tokenFarm.isStaking(investor);
      expect(isStaking).is.true;
    });

    it("Token farm must has 100 dai tokens", async () => {
      let tokenFarmBalance = (
        await daiToken.balanceOf(tokenFarm.address)
      ).toString();
      assert.equal(
        tokenFarmBalance,
        tokens("100"),
        "Token farm must has 100 DAI tokens"
      );
    });
  });

  describe("Issue Tokens", async () => {
    it("Investor must has 100 dapp tokens", async () => {
      await tokenFarm.issueTokens({ from: owner });
      let investorDappBalance = (
        await dappToken.balanceOf(investor)
      ).toString();
      assert.equal(
        investorDappBalance,
        tokens("100"),
        "Investor must has 100 dapp tokens"
      );
    });

    it("Token farm must has 999.900 DAPP tokens", async () => {
      let tokenFarmBalance = (
        await dappToken.balanceOf(tokenFarm.address)
      ).toString();
      assert.equal(
        tokenFarmBalance,
        tokens("999900"),
        "Token farm must has 999.900 DAPP tokens"
      );
    });

    it("Only the owner can issue tokens", async () => {
      await tokenFarm.issueTokens({ from: investor }).should.be.rejected;
    });
  });
});
