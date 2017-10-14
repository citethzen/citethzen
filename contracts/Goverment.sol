pragma solidity ^0.4.4;

contract Government {
	// Government public address that will own the contract and receive the funds at the end of the process
	address public owner = msg.sender;

	enum ImmigrationStatus { registered, paying, accepted, rejected }
	/*CheckoutState public currentState;*/

	struct immigrantStruct {
		// Immigrant's wallet address
		address publicKey;

		// Additional demographic info
		uint age;
		uint income;
		string occupation;

		// Hash string from immigrant's first and last name, date of birth and PIN
		// !! NOT SURE IF IT'S EASIER TO MANIPULATE string OR hash IN THIS CASE !!
		bytes32 dataHash;

		// Immigrant's contributions since registration
		/*mapping (address => uint) contributions;*/
		uint contribution;

		// Current immigrant status in the process
		ImmigrationStatus status;
	}

	mapping (address => immigrantStruct) public immigrants;

	// Log new immigrant registration
	event LogImmigrantRegistration(address immigrant, uint age, string occupation, uint income);

	// Log any immigrant contribution
	event LogImmigrantContribution(address immigrant, uint amount, uint totalContributed);

	// Log immigrants that decided to drop the process
	event LogImmigrantWithdraw(address immigrant, uint totalRefunded);

	// Log government decisions (accept/decline citizenship for the immigrant)
	event LogGovernmentDecision(address immigrant, bool wasAccepted);

	// Log :moneybag: :moneybag: :moneybag:
	event LogGovernmentCollection(address immigrant, uint totalContributed);

	function register (string occupation, uint age, uint income, bytes32 dataHash) public returns (bool success) {
		// New immigrantStruct, saving msg.sender as the publicKey and all the info in the struct instance
		immigrants[msg.sender].occupation = occupation;
		immigrants[msg.sender].age = age;
		immigrants[msg.sender].income = income;
		immigrants[msg.sender].dataHash = dataHash;
		immigrants[msg.sender].status = ImmigrationStatus.registered;

		LogImmigrantRegistration(msg.sender, age, occupation, income);

		return true;
	}

	function contribute() payable public returns (uint) {
		// Make a contribution for msg.sender
		immigrants[msg.sender].contribution += msg.value;

		LogImmigrantContribution(msg.sender, msg.value, immigrants[msg.sender].contribution);
	}

	function makeDecision(address _address, bool accepted) public returns (uint status) {
		if (accepted) {
			immigrants[_address].status = ImmigrationStatus.accepted;
		} else {
			immigrants[_address].status = ImmigrationStatus.rejected;
		}

		LogGovernmentDecision(_address, accepted);

		return uint(immigrants[_address].status);
	}

	function collectContribution(address _address, string firstName, string lastName, string dateOfBirth, string pin) public returns (uint contribution) {
		// SHA3 MAGIC AND COMPARE WITH IMMIGRANT.DATAHASH
		// keccak256 == sha3
		bytes32 immigrantDataHash = keccak256(firstName, lastName, dateOfBirth, pin);
		bytes32 storedDataHash = immigrants[_address].dataHash;

		if (storedDataHash == immigrantDataHash) {
			owner.transfer(immigrants[_address].contribution);

			immigrants[_address].contribution = 0;
		}

		return immigrants[_address].contribution;
	}

	function queryContribution(address _address) constant public returns (uint balance) {
		return immigrants[_address].contribution;
	}

	function queryImmigrantStatus(address _address) constant public returns (uint status) {
		return uint(immigrants[_address].status);
	}
}
