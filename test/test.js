const MembershipFeeStakingContract = artifacts.require("MembershipFeeStaking");
const SGTtokenContract = artifacts.require("SGTtoken");

contract("MembershipFeeStakingContract", async accounts => {

    it("should mint tokens to address", async () => {
        SGTtokenInstance = await SGTtokenContract.deployed();

        await SGTtokenInstance.mint(accounts[1], 34500);
        let balance = await SGTtokenInstance.balanceOf(accounts[1]);

        assert.equal(
            balance,
            34500,
            "Wrong account balance"
        );
    });


    it("should initialize contract with correct values", async () => {
      
        let MemFeeContractInstance = await MembershipFeeStakingContract.deployed();
        await MemFeeContractInstance.initialize(SGTtokenContract.address, 604800);
        
        let SGTtoken = await MemFeeContractInstance.SGTtoken();
        let MinPeriod = await MemFeeContractInstance.minLockingPeriod();

        assert.equal(
            SGTtokenContract.address,
            SGTtoken,
            "Wrong SGT token address"
        );
        assert.equal(
            MinPeriod,
            604800,
            "Wrong min staking period"    
        );
    });

    // todo: test with other tokens too
    // todo: call unlock | lock from 

    it("should stake tokens", async () => {

        let MemFeeContractInstance = await MembershipFeeStakingContract.deployed();
        
        await MemFeeContractInstance.lock(2000, 700000, {from: accounts[1]});

        // assert.equal(
        //     MinPeriod,
        //     604800,
        //     "Wrong min staking period"    
        // );
    });
});
