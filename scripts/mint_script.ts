// npx hardhat run scripts/mint_script.ts --network arbitrum_sepolia

// view ur minted nft's on arbiscan (but wont properly show) or better, opensea testnet: https://testnets.opensea.io/assets/arbitrum_sepolia/{your contract address}/{nft number}

import { ethers } from "hardhat";
const { parseEther } = ethers;
import axios from "axios";
import fs from "fs";
import path from "path";
import FormDataLib from "form-data";
import dotenv from "dotenv";
dotenv.config();

// Pinata API keys
const PINATA_API_KEY = process.env.PINATA_API_KEY as string;
const PINATA_SECRET_API_KEY = process.env.PINATA_SECRET_API_KEY as string;

async function uploadToPinata(
  imageBuffer: Buffer,
  filename: string
): Promise<string> {
  const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";
  const data = new FormDataLib();
  data.append("file", imageBuffer, filename);
  const boundary = (data as any)._boundary;

  const response = await axios.post(url, data, {
    headers: {
      "Content-Type": `multipart/form-data; boundary=${boundary}`,
      pinata_api_key: PINATA_API_KEY,
      pinata_secret_api_key: PINATA_SECRET_API_KEY,
    },
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
  });

  if (response.status === 200) {
    return `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
  } else {
    throw new Error(`Failed to upload image to Pinata: ${response.statusText}`);
  }
}

async function uploadJsonToPinata(
  jsonData: any,
  filename: string
): Promise<string> {
  const url = "https://api.pinata.cloud/pinning/pinJSONToIPFS";
  const response = await axios.post(
    url,
    {
      pinataContent: jsonData,
      pinataMetadata: { name: filename },
    },
    {
      headers: {
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_API_KEY,
        "Content-Type": "application/json",
      },
    }
  );

  if (response.status === 200) {
    return `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
  } else {
    throw new Error(`Failed to upload JSON to Pinata: ${response.statusText}`);
  }
}

async function main() {
  // Path to your GIF
  const gifPath = path.join(__dirname, "test.gif");
  const gifBuffer = fs.readFileSync(gifPath);

  // Step 1: Upload GIF to Pinata
  const gifIpfsUrl = await uploadToPinata(gifBuffer, "test.gif");
  console.log("GIF uploaded to Pinata:", gifIpfsUrl);

  // Step 2: Create JSON metadata
  const metadata = {
    name: "Test NFT Token",
    description: "This is an NFT with a GIF",
    image: gifIpfsUrl,
    attributes: [
      { trait_type: "Background", value: "Blue" },
      { trait_type: "Rarity", value: "Common" },
    ],
  };

  // Step 3: Upload JSON metadata to Pinata
  const metadataIpfsUrl = await uploadJsonToPinata(metadata, "nft-metadata.json");
  console.log("Metadata uploaded to Pinata:", metadataIpfsUrl);

  // Step 4: Interact with the deployed contract
  const contractAddress = "0x2430A9ad7F4956F877869f588406dF95B8BB2Ed1"; // replace with your deployed contract address
  const NFTMinter = await ethers.getContractFactory("BasicMinter");
  const contract = NFTMinter.attach(contractAddress) as any;

  // Step 5: Mint the NFT with the metadata URI
  const quantity = 1;
  const tx = await contract.mint(quantity, metadataIpfsUrl, {
    value: parseEther("0.01"),
  });
  const receipt = await tx.wait();

  // Decode the Mint event from the logs using the contract interface.
  const mintEvent = receipt.logs
    .map((log: any) => {
      try {
        return contract.interface.parseLog(log);
      } catch {
        return null;
      }
    })
    .find((event: any) => event && event.name === "Mint");

  if (!mintEvent) {
    console.error("Mint event not found in transaction receipt:", receipt);
    process.exit(1);
  }

  const tokenId = mintEvent.args.tokenId.toString();
  console.log("NFT minted successfully with metadata URL:", metadataIpfsUrl);

  // Generate the Arbiscan URL for the minted NFT
  const nftUrl = `https://sepolia.arbiscan.io/nft/${contractAddress}/${tokenId}`;
  console.log(`View the minted NFT here: ${nftUrl}`);

  // Step 6: Fetch and log the token URI from the contract
  const tokenMetadataURI = await contract.tokenURI(tokenId);
  console.log(`Metadata URI for token ${tokenId}:`, tokenMetadataURI);

  // Step 7: Fetch and log the metadata content
  const metadataResponse = await axios.get(tokenMetadataURI);
  console.log(`Metadata content for token ${tokenId}:`, metadataResponse.data);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
