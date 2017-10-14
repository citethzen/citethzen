pragma solidity ^0.4.16;

import "./ERC20.sol";
import "./Government.sol";
import "./Wallet.sol";

contract Immigrant {
	// need to generate new contract address
	// Immigrant's wallet address
	address public immigrantWallet;

	address public government;
	bytes32 public dataHash;

	enum Occupation { doctor, lawyer, migrantWorker, laborer }
    // Additional demographic info
    uint64 public age;
    uint64 public occupation;
    uint128 public income;

	enum ImmigrationStatus { registered, invited, accepted, rejected }

	event LogContribution(address immigrant, uint amount);

	// Current immigrant status in the process
    ImmigrationStatus status;

	function Immigrant(address _immigrantWallet, uint64 _occupation, uint64 _age, uint128 _income, bytes32 _dataHash) public {
        government = msg.sender;
		immigrantWallet = _immigrantWallet;

        occupation = _occupation;
		age = _age;
		income = _income;
		dataHash = _dataHash;
        status = ImmigrationStatus.registered;
	}

	function() public payable {
		// Make a contribution to the income tax fund for msg.sender
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

	function emptyAccountEth()  public onlyGov returns (bool) {
	   government.transfer(this.balance);
       return true;
	}

    function emptyAccountToken(address tokenAddress)  public onlyGov returns (bool) {
        ERC20 token = ERC20(tokenAddress);
        government.transfer(token.balanceOf(this));
        return true;
	}

}
