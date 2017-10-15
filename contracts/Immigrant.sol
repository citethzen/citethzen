pragma solidity ^0.4.16;

import "./ERC20.sol";
import "./Government.sol";
import "./Wallet.sol";

contract Immigrant is Wallet {
	// need to generate new contract address
	// Immigrant's wallet address
	address public immigrantAddress;

	address public government;
	bytes32 public dataHash;

	enum Occupation { doctor, lawyer, migrantWorker, laborer }
    // Additional demographic info
    uint64 public age;
    uint64 public occupation;
    uint128 public income;

	enum ImmigrationStatus { registered, invited, accepted, rejected }

	event LogContribution(address _immigrant, uint amount);
	event LogDecision(address _government, bool accepted);
	event LogFailedCollection(address _immigrant, address _government, uint balance);

	// Current immigrant status in the process
  ImmigrationStatus public status;

	function Immigrant(address _immigrantAddress, uint64 _occupation, uint64 _age, uint128 _income, bytes32 _dataHash) Wallet(_immigrantAddress) public {
        government = msg.sender;
        immigrantAddress = _immigrantAddress;

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

	function receiveGovernmentInvitation() public onlyGov returns (bool success) {
		require(status == ImmigrationStatus.registered);
		status = ImmigrationStatus.invited;
		return true;
	}

	function receiveDecision(bool accepted) public onlyGov returns (bool) {
		if (accepted) {
			status = ImmigrationStatus.accepted;
		} else {
			status = ImmigrationStatus.rejected;
		}

		return accepted;
	}

	function emptyAccountEth() public onlyGov returns (bool) {
		/*government.transfer(this.balance);*/

		if (!government.call.value(this.balance)()) {
			LogFailedCollection(immigrantAddress, government, this.balance);
		}

		return true;
	}

  function emptyAccountToken(address tokenAddress)  public onlyGov returns (bool) {
    ERC20 token = ERC20(tokenAddress);
    government.transfer(token.balanceOf(this));
    return true;
	}

}
