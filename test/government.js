const sha1 = require("sha1");
const Government = artifacts.require("./Government.sol");

contract('Government', function(accounts) {

  it("Register a new immigrant", function() {
    // Immigrant sensitive data
    const firstName = "John";
    const lastName = "Doe";
    const dateOfBirth = "01/01/1990";
    const pin = "9999";

    // Data exposed to government
    const ocupation = 'Solidity Developer';
    const age = 25;
    const income = 999;

    // Not sure if SHA1 is a proper hashing algorithm for this case
    let hash = sha1(firstName + lastName + dateOfBirth + pin);

    return Government.deployed().then(function(instance) {
      return instance.register(ocupation, age, income, hash);
    }).then(function(success) {
      assert.equal(success, true, "Could not register immigrant in the contract");

      // Improvement: Add validation/test in case the same publicKey tries to register multiple times.
    });
  });

  it("Make a contribution", function() {
    // Immigrant's first contribution (in ETH)
    const contribution = 1;

    return Government.deployed().then(function(instance) {
      return instance.contribute(contribution);
    }).then(function(balance) {
      assert.equal(balance.valueOf(), 1, "Immigrant's total contribution should be 1");

      // Improvement: Add validation/test for immigrants that were accepted/declined already.
      // And it would be nice to find a way to make a contribution on accounts[1] and accounts[2],
      // since they will be useful later on to test denials and refunds.
    });
  });

  it("Government final decision", function() {
    return Government.deployed().then(function(instance) {
      return instance.makeDecision(accounts[0], true);
    }).then(function(balance) {
      // Return the total contribution made by that immigrant over time
      assert.equal(balance.valueOf(), 1, "Accepted immigrant total contribution should be 1");

      return instance.makeDecision(accounts[1], false);
    }).then(function(balance) {
      // If the immigrant application was declined, ether should be refunded
      assert.equal(balance.valueOf(), 0, "Immigrant's total contribution should be empty");

      // Improvement: Add validation/test for immigrants that were accepted/declined already
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
