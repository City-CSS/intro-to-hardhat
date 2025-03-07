# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.ts
```


Maybe change to not use IPFS so can use something that doesnt require our own infra. Also remove all encode/personal related parameters from contract.

Get RPC

Make local wallet (can add to hotwallet)

Get IPFS access??

Get testnet funds:
https://cloud.google.com/application/web3/faucet/ethereum/sepolia
https://faucet.quicknode.com/ethereum/sepolia
Maybe one of these, or i just have to send...


Write contracts:

Set up config file:

Compile contracts:
npx hardhat compile

Adjust deploy script to contract:

Deploy to a testnet:
npx hardhat run scripts/deploy.ts --network sepolia


Interact with the contract via a script/backend func/frontend.

CONTRACT ABI.

Interacting via script:
Scripts/mint.ts
npx hardhat run scripts/mint.ts --network sepolia


interacting via frontend - see other repo.



Run sample tests:
npx hardhat test



[Local development nodes with hardhat?]
