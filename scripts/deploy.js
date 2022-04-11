const { ethers } = require("hardhat");

async function main() {
  /*
  A ContractFactory in ethers.js is an abstraction used to deploy new smart contracts,
  
  */
  const VotingContract = await ethers.getContractFactory("VotingDappByOleanji");

  // here we deploy the contract
  const deployedVotingContract = await VotingContract.deploy();
  // 10 is the Maximum number of whitelisted addresses allowed
  
  // Wait for it to finish deploying
  await deployedVotingContract.deployed();

  // print the address of the deployed contract
  console.log(
    "VotingDappByOleanji Contract Address:",
    deployedVotingContract.address
  );
}

// Call the main function and catch if there is any error
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });