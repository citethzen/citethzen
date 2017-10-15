const Government = artifacts.require('./Government.sol');
const SAI = artifacts.require('tokens/HumanStandardToken.sol');

module.exports = function (deployer, network, accounts) {
  deployer.deploy(SAI, Math.pow(10, 12), 'Simplified DAI', 2, 'SAI')
    .then(() => SAI.deployed())
    .then(sai => deployer.deploy(Government, [ sai.address ]));

  // give 10k sai to all the accounts
  deployer.then(() => SAI.deployed())
    .then(
      sai =>
        Promise.all([
          accounts.map(
            account => sai.transfer(account, 10000, { from: accounts[ 0 ] })
          )
        ])
    );
};
