var UpgradeableContractProxy = artifacts.require("./UpgradeableContractProxy.sol");

module.exports = function(deployer) {
    deployer.deploy(UpgradeableContractProxy);
}