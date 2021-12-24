# Token Starter

Token Starter is a boiler Nuxt app with Node utilities to deploy, inspect, send Ethereum tokens using [Hardhat](https://github.com/nomiclabs/hardhat) and [Ethers](https://github.com/ethers-io/ethers.js/). You can use it to connect to your Ethereum network and start deploying tokens as ERC-20 smart contracts.

## Prerequisites

You'll need to have [Node LTS](https://nodejs.org/en/download/) or some similar version installed to run the utilities and app. You'll also need to have some Ethereum web wallet like [Metamask](https://metamask.io/) installed in your browser to interact with the app.

## Installation

Clone this repository, change into the new directory, and install dependencies:

```shell
git clone https://github.com/consensusnetworks/token-starter.git
cd token-starter
npm install
```

## Usage

### Hardhat Initialization

1. Initialize your local hardhat network:

```shell
npx hardhat node
```

You should see an output that includes a JSON-RPC endpoint and a list of accounts, shown as pairs account #s and private keys, each loaded with ~10000 ETH. Keep this console running throughout the rest of the process unless you want to switch to a different network.

2. Change `.env.example` to `.env`. 
   
3. Fill in your network info. `NETWORK` and `CHAIN` can stay the same as the example (and `DATADIR` and `PASSWORD` can remain blank). You'll need to pick one of the accounts listed in the output from the previous step and copy the account # and private key to `ADDRESS` and `KEY`, respectively. 

4. Update `NAME`, `SYMBOL`, `SUPPLY` and `DECIMALS` with your desired token info. 

### Contract Deployment

1. Compile and test the ERC-20 Solidity contract at `/contracts/Token.sol`:

```shell
npx hardhat test
```

If successful, you should see a new directory `/src/artifacts` with the compiled contract and the test `/test/token-test.js` will pass without exceptions. You'll need to rerun this command or `npm run compile` if you change the contract.

2. Now you can deploy the contract:

```
npx hardhat run scripts/deploy-token.js --network localhost
```

If successful, you should see your console output the following: `Token deployed to: "some-contract-address"`. Copy and keep the contract address handy for future use.

### The Graph Initialization

1. In another directory (or in the same directory if you prefer), clone the [graph-node](https://github.com/graphprotocol/graph-node.git) repository and run the following command to start the Graph node:

```shell
git clone https://github.com/graphprotocol/graph-node.git
cd graph-node/docker
docker-compose up
```

Confirm your node is running before continuing. (Todo: add a check for this.)

2. Back in this token-starter directory, initialize your new subgraph for the token contract:

```shell
graph init --protocol ethereum --from-contract "your-token-address" \
    --network localhost \
    --abi ./src/artifacts/contracts/Token.sol/Token.json \
    --contract-name Token \
    --product hosted-service \
    --index-events \
    "your-github-username"/token-starter subgraph
```

### Metamask Integration

Open a browser with Metamask, toggle the wallet extension, and switch the network to `http://localhost:8545`. Then click the Metamask account avatar in the top right corner of the extension and select `Import Account`. You can paste the private key from the contract deployment step into the input box. You can also import your new token by selecting the `Assets` tab and clicking `Import tokens`.

### Token Inspection

Serve the Nuxt app:

```shell
npm run dev
```

Paste the contract address from the recent deployment into the search bar and enter. You should see the token information in the app. You can also send some of your new token to another account on your network.

### Geth Integration

Visit [GethLab](https://github.com/natemiller1/GethLab) to confirm and run the commands to initialize your local geth node on port 8545 (if you don't have it running already). Make sure to first end the process running your Hardhat network (`CTRL + C` in the same terminal that you ran `npx hardhat node` in the first step.) 

You may also want to switch from using your private key directly in .env `KEY` variable to using the `DATADIR` and `PASSWORD` variables, which provide the location of your local geth account keystore file and your password for that file, respectively.

## Operations

### Docker

Build:
```shell
docker build -t "your-docker-username"/token-starter
```

Run:
```shell
docker run -p 3000:3000 -d "your-docker-username"/token-starter
```

Push:
```shell
docker push "your-docker-username"/token-starter
```

## Roadmap
Although this is a simple starter app, we can consider ways to improve the onboarding of new developers to the Ethereum ecosystem.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)

You are encouraged to copy or fork this project and use it to start your own.
