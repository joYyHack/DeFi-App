pragma solidity 0.8.10;

import "./DaiToken.sol";
import "./DappToken.sol";

contract TokenFarm {
    string public name = "DAPP Token Farm";
    DaiToken public daiToken;
    DappToken public dappToken;

    constructor(DaiToken _daiToken, DappToken _dappToken) {
        daiToken = _daiToken;
        dappToken = _dappToken;
    }
}
