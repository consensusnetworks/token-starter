# Token Starter

Token Starter is a boilerplate Nuxt app with Node utility scripts to deploy, inspect, send Ethereum tokens using [Hardhat](https://github.com/nomiclabs/hardhat) and [Ethers](https://github.com/ethers-io/ethers.js/) and [The Graph](https://github.com/graphprotocol/graph-node). You can use it to connect to your Ethereum network and start deploying tokens as ERC-20 smart contracts.

## Prerequisites

![NuxtJS](https://img.shields.io/badge/Nuxt-black?style=for-the-badge&logo=nuxt.js&logoColor=white)
![GraphQL](https://img.shields.io/badge/-GraphQL-E10098?style=for-the-badge&logo=graphql&logoColor=white)
![Solidity](https://img.shields.io/badge/Solidity-%23363636.svg?style=for-the-badge&logo=solidity&logoColor=white)
![Ethereum](https://img.shields.io/badge/Ethereum-3C3C3D?style=for-the-badge&logo=Ethereum&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Kubernetes](https://img.shields.io/badge/kubernetes-%23326ce5.svg?style=for-the-badge&logo=kubernetes&logoColor=white)

You'll need to a few things installed before getting started: 
- [Node (LTS)](https://nodejs.org/en/download/) (installed in on your machine) to run the utilities and app
- Docker Desktop running Kubernetes for building, running, or testing the app's images on a local cluster
- Ethereum web wallet like [Metamask](https://metamask.io/) (installed in your browser) to interact with the app
  
## Installation

Clone this repository, change into the new directory, and install dependencies:

```shell
git clone https://github.com/consensusnetworks/token-starter.git
cd token-starter
npm install
```

## Usage

### Hardhat Initialization

Initialize your local hardhat network:

```shell
npx hardhat node
```

You should see an output that includes a JSON-RPC endpoint and a list of accounts, shown as pairs account #s and private keys, each loaded with ~10000 ETH. Keep this console running throughout the rest of the process unless you want to switch to a different network.

### Hardhat Environment Config

In the project root, change `.env.example` to `.env`. 
   
Fill in your network info. `NETWORK` and `CHAIN_ID` can stay the same as the example (and `DATADIR` and `PASSWORD` can remain blank). You'll need to pick one of the accounts listed in the output from the previous step and copy the account # and private key to `ADDRESS` and `KEY`, respectively. 

Update `NAME`, `SYMBOL`, `SUPPLY` and `DECIMALS` with your desired token info. 

### Hardhat Contract Deployment

Compile and test the ERC-20 Solidity contract at `/contracts/Token.sol`:

```shell
npx hardhat test
```

If successful, you should see a new directory `/src/artifacts` with the compiled contract and the test `/test/token-test.js` will pass without exceptions. You'll need to rerun this command or `npm run compile` if you change the contract.

Now you can deploy the contract:

```
npx hardhat run scripts/deploy-token.js --network localhost
```

If successful, you should see your console output the following: `Token deployed to: "some-contract-address"`. Copy and keep the contract address handy for future use.

### The Graph Initialization

In a separate terminal, start The Graph node (you'll want to leave it running for the rest of the process):

```shell
cd graph-node/docker
docker-compose up
```

Wait for deployment logs to complete and confirm your node is running before continuing. 

**Note:** Whenever the Ethereum network has been reset (eg. Hardhat restarted, computer rebooted…), you must DELETE the ./docker/data folder located in the graph-node folder cloned from the repository).
This is required to clean the existing database that checks the genesis block for the current Ethereum network. 

You can do this cleanup by running:

```shell
rm -rf "./graph-node/docker/data"
```

You can stop the node by running `CTRL+C` in the terminal that you started it in.

Change back to the root directory in token-starter and update the value of `dataSources: source: address` in `./subgraph/subgraph.yaml` to your new token address.

Run the following to create and deploy the subgraph your local Graph node:

```shell
cd subgraph
npm run codegen
npm run build
npm run deploy
```

### Metamask Integration

Open a browser with Metamask, toggle the wallet extension, and switch the network to `http://localhost:8545`. Then click the Metamask account avatar in the top right corner of the extension and select `Import Account`. You can paste the private key from the contract deployment step into the input box. You can also import your new token by selecting the `Assets` tab and clicking `Import tokens`.

### Token Application

Serve the Nuxt app:

```shell
npm run dev
```

Paste the contract address from the recent deployment into the search bar and enter. You should see the token information in the app. You can also send some of your new token to another account on your network.

**Note:** You'll need to have your Metamask wallet connected (the one you used to deploy the contract) to the network at this point.

### Geth Integration

Visit [GethLab](https://github.com/natemiller1/GethLab) to confirm and run the commands to initialize your local geth node on port 8545 (if you don't have it running already). Make sure to first end the process running your Hardhat network (`CTRL + C` in the same terminal that you ran `npx hardhat node` in the first step.) 

You may also want to switch from using your private key directly in .env `KEY` variable to using the `DATADIR` and `PASSWORD` variables, which provide the location of your local geth account keystore file and your password for that file, respectively.

## Deployment

### Docker

First, build the Docker image:

```shell
docker build -t consensusnetworks/token-starter ./docker
```

You can then run the image locally:

```shell
docker run -p 3000:3000 -d consensusnetworks/token-starter ./docker
```

When you're ready to ship code, push changes to the image registry:

```shell
docker push consensusnetworks/token-starter
```

### Kubernetes

Load Balancer (configuration only needed for local or bare metal deployment):
```shell
helm repo add metallb https://metallb.github.io/metallb
helm install metallb metallb/metallb -f kubernetes/values.yaml
```

Deployment:
```shell
kubectl apply -f kubernetes/deployment.yaml
```

Service:
```shell
kubectl apply -f kubernetes/service.yaml
```

## Roadmap

Although this is a simple starter app, we can consider ways to improve the onboarding of new developers to the Ethereum ecosystem. These ideas will lead to changes in this starter repo. 

Some ideas may be best implemented in their own separate repository. You are encouraged to copy or fork this project and use it to start your own.

Other, already, existing tasks include:
- Fix the Nuxt SSR hydration issue and then remove client-only wrapper in `./layouts/default.vue` (which is a temporary fix)
- Document the Docker Desktop workaround for local Kubernetes deployment

## Contributing

Pull requests are welcome. For major changes, please open an issue first!

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
