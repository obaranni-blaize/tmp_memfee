const MembershipFeeStakingContract = artifacts.require("MembershipFeeStaking");
const SGTtokenContract = artifacts.require("SGTtoken");

contract("MembershipFeeStakingContract", async accounts => {
    
    let SGTtokenContractInstance;
    let MemFeeContractInstance;

    it("deploy contracts", async () => {
        SGTtokenContractInstance = await SGTtokenContract.new("SGT token", "SGT", 10000000, {from: accounts[0]});
        MemFeeContractInstance = await MembershipFeeStakingContract.new(SGTtokenContractInstance.address, {from: accounts[0]})
    });

    it("initialize first time", async () => {
        await MemFeeContractInstance.initialize(SGTtokenContractInstance.address, 604800, {from: accounts[0]});
        
        let MinPeriod = await MemFeeContractInstance.minLockingPeriod();
        let SGTtoken = await MemFeeContractInstance.SGTtoken();

        assert.equal(
            MinPeriod.toNumber(),
            604800,
            "Wrong min period"
        );
        assert.equal(
            SGTtokenContractInstance.address,
            SGTtoken,
            "Wrong SGT token address"
        );
    });

    it("initialize twice test", async () => {

        let errorRaised = undefined;

        try {
            await MemFeeContractInstance.initialize(SGTtokenContractInstance.address, 5000, {from: accounts[1]})
        } catch (error) {
            errorRaised = error;
        }

        let MinPeriod = await MemFeeContractInstance.minLockingPeriod();

        assert.notEqual(
            errorRaised, 
            undefined,
            "Error must be thrown"
        );
        assert.notEqual(
            errorRaised.message.search("can be called only one time"),
            -1,
            "Wrong error raised"
        );
        assert.equal(
            MinPeriod.toNumber(),
            604800,
            "Min period rewrited"
        );
    });

    // // todo: test with other tokens too
    // // todo: call unlock | lock from not staker (only owner can unstake / stake)

    it("should stake tokens", async () => {

        let stakingTime = 700000;
        let amountToLock = 2000;
        let currentTime = Math.floor(Date.now() / 1000);


        await SGTtokenContractInstance.mint(accounts[1], amountToLock + 2000, {from: accounts[0]});

        console.log("BLNCS: ", await SGTtokenContractInstance.balanceOf(accounts[1]), await SGTtokenContractInstance.balanceOf(MemFeeContractInstance.address));

        await SGTtokenContractInstance.approve(MemFeeContractInstance.address, amountToLock, {from: accounts[1]});
        await MemFeeContractInstance.lock(amountToLock, stakingTime, {from: accounts[1]});

        let totalLocked = await MemFeeContractInstance.totalLocked();
        let lockers = await MemFeeContractInstance.lockers(accounts[1]);

        // console.log(totalLocked.toNumber(), "\n\n***\n\n", lockers.amount.toNumber(), lockers.releaseTime.toNumber(), stakingTime + currentTime)
        
        // todo: add balances check 
        console.log("BLNCS: ", await SGTtokenContractInstance.balanceOf(accounts[1]), await SGTtokenContractInstance.balanceOf(MemFeeContractInstance.address));


        assert.equal(
            lockers.releaseTime.toNumber(),
            stakingTime + currentTime,
            "Bad release time"    
        );
        assert.equal(
            lockers.amount.toNumber(),
            amountToLock,
            "Bad staked amount"    
        );
        assert.equal(
            totalLocked,
            amountToLock,
            "Bad total lock"    
        );
    });

    it("should stake tokens", async () => {

        let stakingTime = 900000;
        let amountToLock = 1000;
        let currentTime = Math.floor(Date.now() / 1000);


        console.log("BLNCS: ", await SGTtokenContractInstance.balanceOf(accounts[1]), await SGTtokenContractInstance.balanceOf(MemFeeContractInstance.address));

        await SGTtokenContractInstance.approve(MemFeeContractInstance.address, amountToLock, {from: accounts[1]});
        await MemFeeContractInstance.lock(amountToLock, stakingTime, {from: accounts[1]});

        let totalLocked = await MemFeeContractInstance.totalLocked();
        let lockers = await MemFeeContractInstance.lockers(accounts[1]);

        console.log(totalLocked.toNumber(), "\n\n***\n\n", lockers.amount.toNumber(), lockers.releaseTime.toNumber(), stakingTime + currentTime)
        
        // todo: add balances check 
        console.log("BLNCS: ", await SGTtokenContractInstance.balanceOf(accounts[1]), await SGTtokenContractInstance.balanceOf(MemFeeContractInstance.address));


        assert.equal(
            lockers.releaseTime.toNumber(),
            stakingTime + currentTime,
            "Bad release time"    
        );
        assert.equal(
            lockers.amount.toNumber(),
            amountToLock + 2000,
            "Bad staked amount"    
        );
        assert.equal(
            totalLocked,
            amountToLock + 2000,
            "Bad total lock"    
        );
    });

    // it("should stake tokens", async () => {

    //     let stakingTime = 700000;
    //     let amountToLock = 2000;
    //     let currentTime = Math.floor(Date.now() / 1000);


    //     await SGTtokenContractInstance.mint(accounts[1], amountToLock, {from: accounts[0]});
    //     await MemFeeContractInstance.lock(2000, stakingTime, {from: accounts[1]});

    //     let totalLocked = await MemFeeContractInstance.totalLocked();
    //     let lockers = await MemFeeContractInstance.lockers(accounts[1]);

    //     // console.log(totalLocked.toNumber(), "\n\n***\n\n", lockers.amount.toNumber(), lockers.releaseTime.toNumber(), stakingTime + currentTime)
        
    //     assert.equal(
    //         lockers.releaseTime.toNumber(),
    //         stakingTime + currentTime,
    //         "Bad release time"    
    //     );
    //     assert.equal(
    //         lockers.amount.toNumber(),
    //         amountToLock,
    //         "Bad staked amount"    
    //     );
    //     assert.equal(
    //         totalLocked,
    //         amountToLock,
    //         "Bad total lock"    
    //     );
    // });
});
