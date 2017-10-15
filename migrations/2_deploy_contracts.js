const Government = artifacts.require('./Government.sol');
const SAI = artifacts.require('tokens/HumanStandardToken.sol');

module.exports = function (deployer) {
  deployer.deploy(SAI, Math.pow(10, 12), 'Simplified DAI', 2, 'SAI')
    .then(() => SAI.deployed())
    .then(sai => deployer.deploy(Government, [ sai.address ]));
};
