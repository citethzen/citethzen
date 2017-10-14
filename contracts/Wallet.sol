pragma solidity ^0.4.16;


import "./ERC20.sol";
import "./Immigrant.sol";
import "./Government.sol";


contract Wallet {
    address public owner;

    function Wallet(address _owner) public {
        owner = _owner;
    }

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    function withdrawETH(address withdrawTo) public onlyOwner returns (bool) {
        withdrawTo.transfer(this.balance);
        return true;
    }

    function withdrawTokens(address tokenAddress, address withdrawTo) public onlyOwner {
        ERC20 token = ERC20(tokenAddress);
        token.transfer(withdrawTo, token.balanceOf(this));
    }
}
