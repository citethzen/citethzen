pragma solidity ^0.4.16;
import "./ERC20.sol";
import "./Immigrant.sol";

contract Government {
	// Government public address that will own the contract and receive the funds at the end of the process
	address public owner;
	address[] public acceptedTokens;
	mapping (address => Immigrant) public immigrantRegistry;

    function Government(address[] _acceptedTokens) public {
        owner = msg.sender;

        //limit spending gas when withdrawing
        require(_acceptedTokens.length < 5);
        acceptedTokens = _acceptedTokens;
    }

	// register/create new immigrant contract
	function register (uint64 _occupation, uint64 _age, uint128 _income, bytes32 _dataHash) public returns (address) {
        require(immigrantRegistry[msg.sender] == address(0));

        Immigrant newImmigrant = new Immigrant(msg.sender, _occupation, _age, _income, _dataHash);

        immigrantRegistry[msg.sender] = newImmigrant;

        LogImmigrantRegistration(_occupation, _age, _income, _dataHash);

		return address(newImmigrant);
	}

    function invite(address immigrantWallet) public onlyOwner returns (bool ){
        require(immigrantRegistry[immigrantWallet].invite());
        LogInvitation(immigrantWallet);
    }


	modifier onlyOwner {
	    require(msg.sender == owner);
	    _;
	}

	//write a function for government to empty it's contract
	function withdraw(address deliverTo) onlyOwner returns (bool) {
			deliverTo.transfer(this.balance);
			return true;
	}

	//EVENTS
    event LogImmigrantRegistration(uint indexed occupation, uint indexed age, uint indexed income, bytes32 dataHash);

    event LogInvitation(address indexed immigrantWallet);

	// Log government decisions (accept/decline citizenship for the immigrant)
	event LogGovernmentDecision(address indexed immigrant, bool indexed wasAccepted);

	// Log :moneybag: :moneybag: :moneybag:
	event LogGovernmentCollection(address indexed immigrant, uint indexed amountCollected);

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
