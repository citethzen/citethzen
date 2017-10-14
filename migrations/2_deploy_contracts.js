var Government = artifacts.require("./Government.sol");

module.exports = function(deployer) {
  deployer.deploy(Government);
};
