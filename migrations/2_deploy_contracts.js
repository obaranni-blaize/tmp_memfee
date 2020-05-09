var MembershipFeeStakingContract = artifacts.require("MembershipFeeStaking");
var SGTtokenContract = artifacts.require("SGTtoken");

module.exports = async function(deployer) {
  await deployer.deploy(SGTtokenContract, "SGT token", "SGT", 10000000 /* deployed from accounts[0] */).then( () => {   
  });
  await deployer.deploy(MembershipFeeStakingContract, SGTtokenContract.address).then( () => {
  });
};