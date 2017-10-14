pragma solidity ^0.4.4;

// https://github.com/ethereum/EIPs/issues/20
 contract ERC20 {
      function totalSupply() constant returns (uint totalSupply);
      function balanceOf(address _owner) constant returns (uint balance);
      function transfer(address _to, uint _value) returns (bool success);
      function transferFrom(address _from, address _to, uint _value) returns (bool success);
      function approve(address _spender, uint _value) returns (bool success);
      function allowance(address _owner, address _spender) constant returns (uint remaining);
      event Transfer(address indexed _from, address indexed _to, uint _value);
     event Approval(address indexed _owner, address indexed _spender, uint _value);
 }

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
