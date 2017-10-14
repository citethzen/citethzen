const keccak256 = require('js-sha3').keccak256;
const Government = artifacts.require('./Government.sol');
const Immigrant = artifacts.require('./Immigrant.sol');

const Web3 = require('web3');
const web3 = new Web3(
  new Web3.providers.HttpProvider("http://localhost:8545")
);

contract('Government', function (accounts) {
  let government;

  const [ governmentOwnerAccount, immigrantAccount ] = accounts;

  // Immigrant data exposed to government
  const occupation = 0;
  const age = 25;
  const income = 999;

  async function getBalance (address) {
    return new Promise((resolve, reject) => {
      web3.eth.getBalance(address, (error, result) => {
        if (error) {
          return reject(error);
        }

        return resolve(result);
      });
    });
  }

  before('get the government instance', async () => {
    government = await Government.deployed();
  });

  it('Registers a new immigrant', async () => {
    // Immigrant sensitive data
    const firstName = 'John';
    const lastName = 'Doe';
    const dateOfBirth = '01/01/1990';
    const pin = '9999';

    // Immigrant data bytes32 hash
    let hash = '0x' + keccak256(firstName + lastName + dateOfBirth + pin);

    const registerTx = await government.register(occupation, age, income, hash, { from: immigrantAccount });
    const immigrant = await government.immigrantRegistry(immigrantAccount);

    assert.isAbove(immigrant.valueOf(), 0, 'Could not register immigrant in the contract');
  });

  it('Makes a contribution', async () => {
    // Immigrant's first contribution (in ETH)
    const contribution = 10;

    // Contract instance reference
    let contractInstance = null;

    const immigrant = await government.immigrantRegistry(immigrantAccount);
    const immigrantContract = Immigrant.at(immigrant);

    const contributionTx = await immigrantContract.sendTransaction({
      from: immigrantAccount,
      value: contribution
    });

    const balance = await getBalance(immigrantAccount);

    assert.equal(balance, 10, 'Immigrant\'s total contribution should be 10');
  });

  it('Government final decision', function () {
    // Contract instance reference
    let contractInstance = null;
    let account_one = accounts[ 0 ];
    let account_two = accounts[ 1 ];

    return Government.deployed().then(function (instance) {
      contractInstance = instance;

      return contractInstance.makeDecision(account_one, true);
    }).then(function () {
      return contractInstance.queryImmigrantStatus.call(account_one);
    }).then(function (status) {
      // Return the total contribution made by that immigrant over time
      assert.equal(status.valueOf(), 2, 'Accepted immigrant total contribution should be 2 (accepted)');

      return contractInstance.makeDecision(account_two, false);
    }).then(function () {
      return contractInstance.queryImmigrantStatus.call(account_two);
    }).then(function (status) {
      // If the immigrant application was declined, ether should be refunded
      assert.equal(status.valueOf(), 3, 'Rejected immigrant total contribution should be 3 (rejection)');

      // Improvement: Add validation/test for immigrants that were accepted/declined already
      // Also, check to make sure the immigrant's contribution balance is empty in case of rejection (validate refund)
    });
  });

  it('Collect an accepted immigrant contribution', function () {
    // Immigrant sensitive data
    const firstName = 'John';
    const lastName = 'Doe';
    const dateOfBirth = '01/01/1990';
    const correctPin = '9999';
    const wrongPin = '1234';

    // Immigrant data bytes32 hash
    let hash = '0x' + keccak256(firstName + lastName + dateOfBirth + correctPin);

    // Contract instance reference
    let contractInstance = null;
    let account_one = accounts[ 0 ];

    return Government.deployed().then(function (instance) {
      contractInstance = instance;

      return contractInstance.collectContribution(account_one, firstName, lastName, dateOfBirth, wrongPin);
    }).then(function () {
      return contractInstance.queryContribution.call(account_one);
    }).then(function (balance) {
      assert.equal(balance.valueOf(), 10, 'collectContribution should fail when sending a wrong PIN or immigrant info');

      return contractInstance.collectContribution(account_one, firstName, lastName, dateOfBirth, correctPin);
    }).then(function () {
      return contractInstance.queryContribution.call(account_one);
    }).then(function (balance) {
      assert.equal(balance.valueOf(), 0, 'collectContribution should succeed when passing the correct info');

      // Improvement: Add validation/test for immigrants that were accepted/declined already
    });
  });

  it('Let the immigrant withdraw his/her application', function () {
    return Government.deployed().then(function (instance) {
      return instance.withdraw();
    }).then(function (balance) {
      // During withdraw, the contributions should be refunded to the immigrant
      assert.equal(balance.valueOf(), 0, 'Immigrant\'s total contribution should be empty');

      // Improvement: Add validation/test for immigrants that were accepted/declined already
      // Improvement: Add test to make sure an user can't perform multiple withdrawals
    });
  });

});
