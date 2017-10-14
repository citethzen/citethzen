pragma solidity ^0.4.16;

import "./ERC20.sol";
import "./Government.sol";

contract Immigrant {
	// need to generate new contract address
	// Immigrant's wallet address
	address immigrantWallet;

	// Additional demographic info
	uint public age;
	uint public income;
	string public occupation;
	bytes32 public dataHash;
	address public government;

	enum ImmigrationStatus { registered, paying, accepted, rejected }

	// Current immigrant status in the process
	ImmigrationStatus status;

	event LogContribution(address immigrant, uint amount);

	function Immigrant(address _address, string _occupation, uint _age, uint _income, bytes32 _dataHash) {
		immigrantWallet = _address;
		occupation = _occupation;
		age = _age;
		income = _income;
		dataHash = _dataHash;
		government = msg.sender;
		status = ImmigrationStatus.registered;
	}

	function() payable {
		// Make a contribution for msg.sender
		LogContribution(msg.sender, msg.value);
	}

	modifier onlyGov {
	    require(msg.sender == government);
	    _;
	}

	function makeDecision(address _address, bool accepted) onlyGov returns (uint _status) {
		if (accepted) {
			status = ImmigrationStatus.accepted;
		} else {
			status = ImmigrationStatus.rejected;
		}
		return uint(status);
	}

	function emptyAccountEth() onlyGov returns (bool) {
	   government.transfer(this.balance);
	}

    function emptyAccountToken(address tokenAddress) onlyGov returns (bool) {
        ERC20 token = ERC20(tokenAddress);
        token.transfer(government, token.balanceOf(this));
	}

}
