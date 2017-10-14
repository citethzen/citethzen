pragma solidity ^0.4.4;

contract government{

	enum ImmigrationStatus {registered, paying, accepted, rejected}
	CheckoutState public currentState;

	mapping (address => uint256) public structs;

	struct immigrantStruct{
		// Immigrant's wallet address
		address publicKey;

		// Additional demographic info
		uint age;
		uint income;
		string ocupation;

		// Hash string from immigrant's first and last name, date of birth and PIN
		// !! NOT SURE IF IT'S EASIER TO MANIPULATE string OR hash IN THIS CASE !!
		string infoHash;

		// Immigrant's contributions since registration
		/*mapping (address => uint) contributions;*/
		uint contribution;
	}

	immigrantStruct newStruct;

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

	function Struct(){
		newStruct.contribution = 0;
	}

	function balance() returns (uint) {
		return newStruct.contribution;
	}

	payable function contribute() returns (bool) {

	}

	function queryContribution(address _address) constant returns (uint256 balance) {
		return structs[_address].contribution;
	}
}
