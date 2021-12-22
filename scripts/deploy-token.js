// We are building for the Hardhat Runtime Environment explicitly here
// Deploy using 'npx hardhat run scripts/deploy-token.js --network localhost'

const hre = require("hardhat");
const { ethers } = hre;
const keythereum = require("keythereum");
const dotenv = require("dotenv");
dotenv.config();

// Deploy to your local Geth network or similar
const network = parseInt(process.env.NETWORK);
const chain = parseInt(process.env.CHAIN);

// Use your local Geth or hardhat wallet
const address = process.env.ADDRESS;
const datadir = process.env.DATADIR;
const password = process.env.PASSWORD;
const key = process.env.KEY;

// Your new token!
const name = process.env.NAME;
const symbol = process.env.SYMBOL;
const decimals = parseInt(process.env.DECIMALS);
const supply = parseInt(process.env.SUPPLY);

async function main() {
  // We get our wallet
  const keyObject = !key ? keythereum.importFromFile(address , datadir) : null;
  const recoveredKey = !key ? keythereum.recover(password, keyObject) : null;
  const provider = new ethers.providers.JsonRpcProvider(network, chain);
  const wallet = new ethers.Wallet(key || recoveredKey, provider);

  // We get the contract to deploy, signed with wallet
  const Token = await ethers.getContractFactory("Token", wallet);
  const token = await Token.deploy(name, symbol, decimals, supply);
  await token.deployed();
  console.log("Token deployed to:", token.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
