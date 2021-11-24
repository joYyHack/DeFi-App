pragma solidity 0.8.10;

import "./DaiToken.sol";
import "./DappToken.sol";

contract TokenFarm {
    string public name = "DAPP Token Farm";
    DaiToken public daiToken;
    DappToken public dappToken;

    address[] public stakers;
    mapping(address => uint) public stakersBalances;
    mapping(address => bool) public hasStaken;
    mapping(address => bool) public isStaking;

    constructor(DaiToken _daiToken, DappToken _dappToken) {
        daiToken = _daiToken;
        dappToken = _dappToken;
    }

    //deposit
    function stakeTokens(uint _amount) public {
        //transfer dai tokens to token farm
        daiToken.transferFrom(msg.sender, address(this), _amount);

        // update stakers balance
        stakersBalances[msg.sender] += _amount;

        //add new stakers
        if(!hasStaken[msg.sender]){
            stakers.push(msg.sender);

            hasStaken[msg.sender] = true;
            isStaking[msg.sender] = true;
        }
    }
}
