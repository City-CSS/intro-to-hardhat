// npx hardhat run scripts/deploy_mint.ts --network arbitrumSepolia

const hre = require("hardhat");

async function main() {
  // Get the contract to deploy
  const NFTMinter = await hre.ethers.getContractFactory("BasicMinter");

  // Deploy the contract without any arguments
  const contract = await NFTMinter.deploy();
  await contract.waitForDeployment();

  console.log("Contract deployed to:", contract.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
