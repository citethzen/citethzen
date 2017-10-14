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

<<<<<<< HEAD
	enum ImmigrationStatus { registered, paying, accepted, rejected }
	enum Occupation { doctor, lawyer, migrantWorker, laborer }
=======
    // Additional demographic info
    uint64 public age;
    uint64 public occupation;
    uint128 public income;

	enum ImmigrationStatus { registered, invited, accepted, rejected }
>>>>>>> 022868a3785bb3ffe84214941ae8834b6b308497

	// Current immigrant status in the process
    ImmigrationStatus status;

	function Immigrant(address _immigrantWallet, uint64 _occupation, uint64 _age, uint128 _income, bytes32 _dataHash) public {
        government = msg.sender;
		immigrantWallet = _immigrantWallet;

        occupation = _occupation;
		age = _age;
		income = _income;
		dataHash = _dataHash;
<<<<<<< HEAD
		government = msg.sender;

		status = ImmigrationStatus.registered;
=======
        status = ImmigrationStatus.registered;
>>>>>>> 022868a3785bb3ffe84214941ae8834b6b308497
	}

	function() public payable {
		// Make a contribution to the income tax fund for msg.sender
	}

	modifier onlyGov {
	    require(msg.sender == government);
	    _;
	}

    function invite() public onlyGov returns (bool success) {
        require(status == ImmigrationStatus.registered);
        status = ImmigrationStatus.invited;
        return true;
    }

	function makeDecision(bool accepted)  public onlyGov returns (uint _status) {
        require(status == ImmigrationStatus.invited);

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
<<<<<<< HEAD
				government.transfer(token.balanceOf(this));
=======
        token.transfer(government, token.balanceOf(this));
        return true;
>>>>>>> 022868a3785bb3ffe84214941ae8834b6b308497
	}

}
