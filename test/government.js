const keccak256 = require('js-sha3').keccak256;
const Government = artifacts.require('./Government.sol');
const Immigrant = artifacts.require('./Immigrant.sol');
const Web3 = require('web3');

contract('Government', function (accounts) {
  let government;

  const [ governmentOwnerAccount, immigrantAccount ] = accounts;

  // Immigrant data exposed to government
  const occupation = 0;
  const age = 25;
  const income = 999;

  function getBalance (address) {
    return new Promise((resolve, reject) => {
      web3.eth.getBalance(address, (error, result) => {
        if (error) {
          reject(error);
        }

        resolve(result);
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

    const immigrantContractAddress = await government.immigrantRegistry(immigrantAccount);
    const immigrantContract = Immigrant.at(immigrantContractAddress);

    const contributionTx = await immigrantContract.sendTransaction({
      from: immigrantAccount,
      value: contribution
    });

    const balance = await getBalance(immigrantContractAddress);

    assert.equal(balance, 10, 'Immigrant\'s total contribution should be 10');
  });

  it('Invitation', async () => {
    const inviteTx = await government.invite(immigrantAccount);

    const immigrantContractAddress = await government.immigrantRegistry(immigrantAccount);
    const immigrantContract = Immigrant.at(immigrantContractAddress);
    const status = await immigrantContract.status();

    assert.equal(status.toNumber(), 1, 'Immigrant\'s status should be 1 (invited)');
  });

  it('Accepts the invited immigrant', async () => {
    const immigrantContractAddress = await government.immigrantRegistry(immigrantAccount);
    const immigrantContract = Immigrant.at(immigrantContractAddress);

    const acceptTx = await immigrantContract.makeDecision(immigrantAccount, true, {
      from: governmentOwnerAccount
    });

    const status = await immigrantContract.status();

    assert.equal(status.toNumber(), 2, 'Immigrant\'s status should be 2 (accepted)');
  });

  it('Collect an accepted immigrant contribution', async () => {
    // Immigrant sensitive data
    const firstName = 'John';
    const lastName = 'Doe';
    const dateOfBirth = '01/01/1990';
    const correctPin = '9999';
    const wrongPin = '1234';

    const collectTx = await government.collectContribution(immigrantAccount, firstName, lastName, dateOfBirth, correctPin);
    const balance = await getBalance(immigrantAccount);

    assert.equal(balance, 0, 'collectContribution should succeed when passing the correct info');
  });

  it('Let the immigrant withdraw his/her application', function () {
    assert.equal(true, true);
  });

});
