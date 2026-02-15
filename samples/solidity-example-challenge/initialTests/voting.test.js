const Voting = artifacts.require("../contracts/Voting.sol");

contract("Voting", function (accounts) {
  let instance;

  before(async () => {
    instance = await Voting.deployed();
  });

  it("Should add a candidate by the owner", async () => {
    await instance.addCandidate("Alice", { from: accounts[0] });
    const candidates = await instance.getAllCandidates();
    assert.equal(candidates[0], "Alice");
  });

  it("Should prevent non-owner from adding candidates", async () => {
    try {
      await instance.addCandidate("Bob", { from: accounts[1] });
      assert.fail("Non-owner was able to add a candidate");
    } catch (err) {
      assert(err.toString().includes("Only owner can perform this action"), "Error message mismatch");
    }
  });

  it("Should allow a user to vote for a candidate", async () => {
    await instance.vote("Alice", { from: accounts[1] });
    const votes = await instance.getVotes("Alice");
    assert.equal(votes.toString(), "1", "Vote count mismatch");
  });

  it("Should prevent double voting", async () => {
    try {
      await instance.vote("Alice", { from: accounts[1] });
      assert.fail("Double voting allowed");
    } catch (err) {
      assert(err.toString().includes("You have already voted"), "Error message mismatch");
    }
  });

  it("Should prevent voting for a non-existent candidate", async () => {
    try {
      await instance.vote("Bob", { from: accounts[2] });
      assert.fail("Voted for a non-existent candidate");
    } catch (err) {
      assert(err.toString().includes("Candidate does not exist"), "Error message mismatch");
    }
  });
});
