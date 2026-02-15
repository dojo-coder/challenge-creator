const Voting = artifacts.require("Voting");

module.exports = async function (callback) {
  try {
    const accounts = await web3.eth.getAccounts();
    const owner = accounts[0];
    const voter = accounts[1];

    // Deploy contract (deployer becomes owner)
    const instance = await Voting.new({ from: owner });

    console.log("Voting deployed at:", instance.address);
    console.log("Owner:", await instance.owner());

    // Add candidates (must be owner)
    await instance.addCandidate("Alice", { from: owner });
    await instance.addCandidate("Bob", { from: owner });

    // Read candidates
    const candidates = await instance.getAllCandidates();
    console.log("Candidates:", candidates);

    // Vote (from a different account)
    await instance.vote("Alice", { from: voter });

    // Read votes
    const aliceVotes = await instance.getVotes("Alice");
    const bobVotes = await instance.getVotes("Bob");

    console.log("Votes for Alice:", aliceVotes.toString());
    console.log("Votes for Bob:", bobVotes.toString());

    callback();
  } catch (error) {
    callback(error);
  }
};
