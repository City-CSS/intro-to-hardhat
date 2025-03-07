// npx hardhat run scripts/deploy_usdc.ts --network optimismSepolia


import { ethers } from "hardhat";

async function main() {
  console.log("Deploying PPshiftUSDC to Rootstock...");

  // Replace with the actual USDC token address on Rootstock
  const usdcTokenAddress = process.env.USDC_OPTIMISM_ADDRESS;

  if (!usdcTokenAddress) {
    console.error("USDC_OPTIMISM_ADDRESS environment variable not set!");
    process.exit(1);
  }

  // Get contract factory
  const PPshiftUSDC = await ethers.getContractFactory("PPshiftUSDC");

  // Deploy the contract with the USDC address
  const contract = await PPshiftUSDC.deploy(usdcTokenAddress);
  await contract.waitForDeployment();

  console.log("PPshiftUSDC deployed to:", contract.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
