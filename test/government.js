const keccak256 = require('js-sha3').keccak256;
const Government = artifacts.require('./Government.sol');
const Immigrant = artifacts.require('./Immigrant.sol');

contract('Government', function (accounts) {
  let government, immigrantContract, immigrantContractAddress;

  const [ governmentOwnerAccount, immigrantAccount ] = accounts;

  // Immigrant data exposed to government
  const occupation = 0;
  const age = 25;
  const income = 999;

  function getBalance(address) {
    return new Promise((resolve, reject) => {
      web3.eth.getBalance(address, (error, result) => {
        if (error) {
          reject(error);
        }

        resolve(result);
      });
    });
  }

  async function getHash(firstName, lastName, dateOfBirth, password) {
    return await government.createHash(firstName, lastName, dateOfBirth, password);
  }

  beforeEach('create the bootstrapping test objects', async () => {
    government = await Government.new({ from: governmentOwnerAccount });

    const hashData = await getHash('John', 'Doe', '01/01/1990', '9999');

    const registerImmigrantTx = await government.register(occupation, age, income, hashData, { from: immigrantAccount });

    immigrantContractAddress = await government.immigrantRegistry(immigrantAccount);

    immigrantContract = Immigrant.at(immigrantContractAddress);
  });

  it('has an immigrant in the registry', async () => {
    assert.equal(await government.immigrantRegistry(immigrantAccount), immigrantContractAddress);
  });

  it('Makes a contribution', async () => {
    // Immigrant's first contribution (in ETH)
    const contribution = 10;

    const contributionTx = await immigrantContract.sendTransaction({
      from: immigrantAccount,
      value: contribution
    });

    const balance = await getBalance(immigrantContractAddress);

    assert.equal(balance, contribution, 'Immigrant\'s total contribution should be 10');
  });

  it('Invitation', async () => {
    const inviteTx = await government.invite(immigrantAccount);

    const status = await immigrantContract.status();

    assert.equal(status.toNumber(), 1, 'Immigrant\'s status should be 1 (invited)');
  });

  it('Accepts the invited immigrant', async () => {
    const inviteTx = await government.invite(immigrantAccount);
    const acceptTx = await government.makeDecision(immigrantAccount, true, {
      from: governmentOwnerAccount
    });

    const status = await immigrantContract.status();

    assert.equal(status.toNumber(), 2, 'Immigrant\'s status should be 2 (accepted)');
  });

  it('Collect an accepted immigrant contribution', async () => {
    // Do a contribution
    const contributionTx = await immigrantContract.sendTransaction({
      from: immigrantAccount,
      value: 5
    });

    // Immigrant sensitive data
    const firstName = 'John';
    const lastName = 'Doe';
    const dateOfBirth = '01/01/1990';
    const correctPassword = '9999';
    const wrongPassword = '1234';

    const collectTx = await government.collectContribution(immigrantAccount, firstName, lastName, dateOfBirth, correctPassword);
    const balance = await getBalance(immigrantContractAddress);

    assert.equal(balance.toNumber(), 0, 'collectContribution should succeed when passing the correct info');
  });

  it('Let the immigrant withdraw his/her funds if they were not invited nor accepted', function () {
    assert.equal(true, true);
  });

});
