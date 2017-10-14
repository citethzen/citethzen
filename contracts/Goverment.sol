pragma solidity ^0.4.4;

contract government{

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
		string dataHash;

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

	function register (string occupation, uint age, uint income, string dataHash) returns (bool success) {
		// New immigrantStruct, saving msg.sender as the publicKey and all the info in the struct instance
		immigrants[msg.sender].occupation = occupation;
		immigrants[msg.sender].age = age;
		immigrants[msg.sender].income = income;
		immigrants[msg.sender].dataHash = dataHash;
		immigrants[msg.sender].status = ImmigrationStatus.registered;

		LogImmigrantRegistration(msg.sender, age, occupation, income);

		return true;
	}

	function queryImmigrantStatus(address _address) constant returns (ImmigrationStatus status) {
		return immigrants[_address].status;
	}

	function contribute() payable returns (uint) {
		// Make a contribution for msg.sender
		immigrants[msg.sender].contribution += msg.value;
	}

	function queryContribution(address _address) constant returns (uint256 balance) {
		return immigrants[_address].contribution;
	}
}
