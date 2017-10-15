pragma solidity ^0.4.16;


import "./ERC20.sol";
import "./Immigrant.sol";
import "./Wallet.sol";


contract Government is Wallet {
    // Government public address that will own the contract and receive the funds at the end of the process
    address public owner;

    address[] public acceptedTokens;

    mapping (address => Immigrant) public immigrantRegistry;

    function createHash(string firstName, string lastName, string dateOfBirth, string password) public pure returns (bytes32 hash) {
        return keccak256(firstName, lastName, dateOfBirth, password);
    }

    function Government(address[] _acceptedTokens) Wallet(msg.sender) public {
        owner = msg.sender;

        //limit spending gas when withdrawing
        require(_acceptedTokens.length < 5);
        acceptedTokens = _acceptedTokens;
    }

    // register/create new immigrant contract
    function register(uint64 _occupation, uint64 _age, uint128 _income, bytes32 _dataHash) public returns (address) {
        // msg sender cannot be the government contract owner
        require(msg.sender != owner);

        // msg sender cannot already be registered
        require(immigrantRegistry[msg.sender] == address(0));

        Immigrant newImmigrant = new Immigrant(msg.sender, _occupation, _age, _income, _dataHash);

        immigrantRegistry[msg.sender] = newImmigrant;

        LogImmigrantRegistration(_occupation, _age, _income, _dataHash, msg.sender, newImmigrant);

        return address(newImmigrant);
    }

    function invite(address immigrantWallet) public onlyOwner returns (bool) {
        require(immigrantRegistry[immigrantWallet].receiveGovernmentInvitation());
        LogInvitation(immigrantWallet);
    }

    function makeDecision(address immigrantWallet, bool accepted) public returns (bool) {
        require(immigrantRegistry[immigrantWallet].receiveDecision(accepted));
        LogGovernmentDecision(immigrantWallet, accepted);
    }

    function () payable {

    }

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    //EVENTS
    event LogImmigrantRegistration(uint indexed occupation, uint indexed age, uint indexed income, bytes32 dataHash, address immigrantAddress, address immigrantContractAddress);

    event LogInvitation(address indexed immigrantWallet);

    // Log government decisions (accept/decline citizenship for the immigrant)
    event LogGovernmentDecision(address indexed immigrant, bool indexed wasAccepted);

    // Log :moneybag: :moneybag: :moneybag:
    event LogGovernmentCollection(address indexed immigrant, uint indexed amountCollected);

    // Log :moneybag: :moneybag: :moneybag:
    event LogTokenCollection(address indexed tokenAddress, address indexed immigrant, uint indexed amountCollected);

    function collectContribution(address _address, string firstName, string lastName, string dateOfBirth, string password) public returns (uint _contribution) {
        // must be registered
        require(immigrantRegistry[_address] != address(0));

        // require that the hash of the credentials match the stored hashed secret
        require(
            createHash(firstName, lastName, dateOfBirth, password) == immigrantRegistry[_address].dataHash()
        );

        uint contribution = immigrantRegistry[_address].balance;

        // empty the immigrants wallet
        immigrantRegistry[_address].emptyAccountEth();
            /*LogGovernmentCollection(_address, contribution);*/

            /*for (uint token = 0; token < acceptedTokens.length; token++) {
                immigrantRegistry[_address].emptyAccountToken(acceptedTokens[token]);
            }*/

        return contribution;
    }

}
