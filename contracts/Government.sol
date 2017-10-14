pragma solidity ^0.4.4;

contract Government {
  struct Immigrant {
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
    mapping (address => uint) contributions;
  }

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
}
