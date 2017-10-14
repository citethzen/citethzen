pragma solidity ^0.4.16;
import "./ERC20.sol";
import "./Immigrant.sol";

contract Government {
	// Government public address that will own the contract and receive the funds at the end of the process
	address public owner;
	address[] public acceptedTokens;
	mapping (address => Immigrant) public immigrantRegistry;


    function Government(address[] _acceptedTokens) {
        owner = msg.sender;

        //limit spending gas when withdrawing
        require(_acceptedTokens.length < 5);
        acceptedTokens = _acceptedTokens;
    }
	// register/create new immigrant contract
	function register (string _occupation, uint _age, uint _income, bytes32 _dataHash) returns (address) {
        require(immigrantRegistry[msg.sender] == address(0));

        immigrantRegistry[msg.sender] = new Immigrant(msg.sender, _occupation, _age, _income, _dataHash);
		return immigrantRegistry[msg.sender];
	}

	//EVENTS

	// Log government decisions (accept/decline citizenship for the immigrant)
	event LogGovernmentDecision(address immigrant, bool wasAccepted);

	// Log :moneybag: :moneybag: :moneybag:
	event LogGovernmentCollection(address immigrant, uint totalContributed);


	function collectContribution(address _address, string firstName, string lastName, string dateOfBirth, string pin) public returns (uint _contribution) {
		// SHA3 MAGIC AND COMPARE WITH IMMIGRANT.DATAHASH
		// keccak256 == sha3
		bytes32 immigrantDataHash = keccak256(firstName, lastName, dateOfBirth, pin);
		bytes32 storedDataHash = immigrantRegistry[_address].dataHash();

        uint contribution = immigrantRegistry[_address].balance;
		if (storedDataHash == immigrantDataHash) {

            //call emptyAccount instead
			immigrantRegistry[_address].emptyAccountEth();
		    for (uint token = 0; token < acceptedTokens.length; token++) {
                immigrantRegistry[_address].emptyAccountToken(acceptedTokens[token]);
            }
		}

		return contribution;
	}

}
