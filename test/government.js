const sha3 = require("sha3");
const Government = artifacts.require("./Government.sol");

contract('Government', function(accounts) {

  it("Registers a new immigrant", function() {
    // Immigrant sensitive data
    const firstName = "John";
    const lastName = "Doe";
    const dateOfBirth = "01/01/1990";
    const pin = "9999";

    // Data exposed to government
    const occupation = 'Solidity Developer';
    const age = 25;
    const income = 999;

    let hash = sha3_256(firstName + lastName + dateOfBirth + pin);

    // Contract instance reference
    let contractInstance = null;

    return Government.deployed().then(function(instance) {
      contractInstance = instance;

      return contractInstance.register(occupation, age, income, hash);
    }).then(function() {
      return contractInstance.queryImmigrantStatus.call(accounts[0]);
    }).then(function(immigrantStatus) {
      assert.equal(immigrantStatus.valueOf(), 0, "Could not register immigrant in the contract");

      // Improvement: Add validation/test in case the same publicKey tries to register multiple times.
    });
  });

  it("Makes a contribution", function() {
    // Immigrant's first contribution (in ETH)
    const contribution = 10;

    // Contract instance reference
    let contractInstance = null;
    let account_one = accounts[0];

    return Government.deployed().then(function(instance) {
      contractInstance = instance;

      return contractInstance.contribute({ from: account_one, value: 10 });
    }).then(function() {
      return contractInstance.queryContribution.call(account_one);
    }).then(function(balance) {
      assert.equal(balance.valueOf(), 10, "Immigrant's total contribution should be 10");

      // Improvement: Add validation/test for immigrants that were accepted/declined already.
      // And it would be nice to find a way to make a contribution on accounts[1] and accounts[2],
      // since they will be useful later on to test denials and refunds.
    });
  });

  it("Government final decision", function() {
    // Contract instance reference
    let contractInstance = null;
    let account_one = accounts[0];
    let account_two = accounts[1];

    return Government.deployed().then(function(instance) {
      contractInstance = instance;

      return contractInstance.makeDecision(account_one, true);
    }).then(function() {
      return contractInstance.queryImmigrantStatus.call(account_one);
    }).then(function(status) {
      // Return the total contribution made by that immigrant over time
      assert.equal(status.valueOf(), 2, "Accepted immigrant total contribution should be 2 (accepted)");

      return contractInstance.makeDecision(account_two, false);
    }).then(function() {
      return contractInstance.queryImmigrantStatus.call(account_two);
    }).then(function(status) {
      // If the immigrant application was declined, ether should be refunded
      assert.equal(status.valueOf(), 3, "Rejected immigrant total contribution should be 3 (rejection)");

      // Improvement: Add validation/test for immigrants that were accepted/declined already
      // Also, check to make sure the immigrant's contribution balance is empty in case of rejection (validate refund)
    });
  });

  it("Collect an accepted immigrant contribution", function() {
    // Immigrant sensitive data
    const firstName = "John";
    const lastName = "Doe";
    const dateOfBirth = "01/01/1990";
    const correctPin = "9999";
    const wrongPin = "1234";

    return Government.deployed().then(function(instance) {
      return instance.collectContribution(accounts[2], firstName, lastName, dateOfBirth, wrongPin);
    }).then(function(success) {
      assert.equal(success, false, "collectContribution should fail when sending a wrong PIN or immigrant info");

      return instance.collectContribution(accounts[2], firstName, lastName, dateOfBirth, correctPin);
    }).then(function(success) {
      assert.equal(success, true, "collectContribution should succeed when passing the correct info");

      // Improvement: Add validation/test for immigrants that were accepted/declined already
    });
  });

  it("Let the immigrant withdraw his/her application", function() {
    return Government.deployed().then(function(instance) {
      return instance.withdraw();
    }).then(function(balance) {
      // During withdraw, the contributions should be refunded to the immigrant
      assert.equal(balance.valueOf(), 0, "Immigrant's total contribution should be empty");

      // Improvement: Add validation/test for immigrants that were accepted/declined already
      // Improvement: Add test to make sure an user can't perform multiple withdrawals
    });
  });

});
