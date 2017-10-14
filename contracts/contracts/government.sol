pragma solidity ^0.4.4;

contract government{
	
	enum ImmigrationStatus {registered, paying, accepted, rejected}
	ImmigrationStatus public currentState; 

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

	function contribute() payable returns (bool) {
	}

	function immigrantWithdraw() returns (bool) {

	}



	function queryContribution(address _address) constant returns (uint256 balance) {
	}

	event ContributionLog(address _to, uint _amount);

	}