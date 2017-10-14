pragma solidity ^0.4.4;

contract government{
	
	enum ImmigrationStatus {registered, paying, accepted, rejected}
	CheckoutState public currentState; 

	mapping (address => uint256) public structs;



	struct immigrantStruct{
		uint contribution;
	}

	immigrantStruct newStruct;

	function Struct(){
		newStruct.contribution = 0; 
	}

	function balance() returns (uint){
		return newStruct.contribution;
	}

	payable function contribute() returns boolean {
		
	}



	function queryContribution(address _address) constant returns (uint256 balance) {
		return structs[_address].contribution;
	}

	event ContributionLog(address _to, uint _amount);

	}

