const DappToken = artifacts.require('DappToken');
const DaiToken = artifacts.require('DaiToken');
const TokenFarm = artifacts.require('TokenFarm');

require('chai')
    .use(require('chai-as-promised'))
    .should();

function getTokensFromEther(ether) {
    return web3.utils.toWei(ether);
}

contract('Deployment', ([owner, investor]) => {
    let dappToken, daiToken, tokenFarm;

    before(async () => {
        //load contracts
        dappToken = await DappToken.new();
        daiToken = await DaiToken.new();
        tokenFarm = await TokenFarm.new(daiToken.address, dappToken.address);

        //transfer all dapp tokens to farm
        await dappToken.transfer(tokenFarm.address, getTokensFromEther('1000000'));
        //transfer tokens to investor
        await daiToken.transfer(investor, getTokensFromEther('1000'), { from: owner });
    });

    describe('Mock DAI deployment', async () => {
        it('Has name - Mock DAI Token', async () => {
            const name = await daiToken.name();
            assert.equal(name, 'Mock DAI Token');
        });

        it('Investor has 1000 Dai tokens', async () => {
            let balance = await daiToken.balanceOf(investor);
            assert.equal(balance.toString(), getTokensFromEther('1000'));
        })
    });

    describe('Mock DAPP deployment', async () => {
        it('Has name - DApp Token', async () => {
            const name = await dappToken.name();
            assert.equal(name, 'DApp Token');
        });
    });

    describe('Token Farm deployment', async () => {
        it('Has name - DAPP Token Farm', async () => {
            const name = await tokenFarm.name();
            assert.equal(name, 'DAPP Token Farm');
        });

        it('Farm has 1 million tokens', async () => {
            let balance = await dappToken.balanceOf(tokenFarm.address);
            assert.equal(balance.toString(), getTokensFromEther('1000000'));
        });
    });
})