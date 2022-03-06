# Token Starter
:coin: Boilerplate to launch and manage an ERC-20 token

## About
Token Starter is a boilerplate Nuxt app with Node utility scripts to deploy, inspect, send, and analyze an Ethereum token using [Hardhat](https://github.com/nomiclabs/hardhat) and [Ethers](https://github.com/ethers-io/ethers.js/) and [The Graph](https://github.com/graphprotocol/graph-node). You can use it to connect to an Ethereum network and start deploy a tokens as an ERC-20 smart contract. You can deploy subgraphs using your token's ABI and create custom datasets for analytics. The frontend is built with simple Tailwind-styled Vue components that are easy to customize and extend.

![NuxtJS](https://img.shields.io/badge/Nuxt-black?style=for-the-badge&logo=nuxt.js&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![GraphQL](https://img.shields.io/badge/-GraphQL-E10098?style=for-the-badge&logo=graphql&logoColor=white)
![Solidity](https://img.shields.io/badge/Solidity-%23363636.svg?style=for-the-badge&logo=solidity&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

## Prerequisites

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

Compile and test the ERC-20 Solidity contract at `contracts/Token.sol`:

```shell
npx hardhat compile
npx hardhat test
```

If successful, you should see a new directory `src/artifacts` with the compiled contract and the test `test/token-test.js` will pass without exceptions. You'll need to rerun this command or `npm run compile` if you change the contract.

Now you can deploy the contract:

```
npx hardhat run scripts/deploy-token.js --network localhost
```

If successful, you should see your console output the following: `Token deployed to: "some-contract-address"`. Copy and keep the contract address handy for future use.

### The Graph Initialization

In a separate terminal, start The Graph node (you'll want to leave it running for the rest of the process):

```shell
cd graph/graph-node/docker
docker-compose up
```

Wait for deployment logs to complete and confirm your node is running before continuing. 

**Note:** Whenever the Ethereum network has been reset (eg. Hardhat restarted, computer rebooted…), you must DELETE the ./docker/data folder located in the graph-node folder cloned from the repository).
This is required to clean the existing database that checks the genesis block for the current Ethereum network. You can do this cleanup by running `rm -rf "graph/graph-node/docker/data"`. You can stop the node anytime by running `CTRL+C` in the terminal that you started it in.

Update the value of `dataSources: source: address` in `graph/subgraph/subgraph.yaml` to your new token address.

Run the following to create and deploy the subgraph your local Graph node:

```shell
cd graph/subgraph
npm run codegen
npm run build
npm run create-local
npm run deploy-local
```

The last command should output an HTTP and WS endpoint for your subgraph. The queries endpoint should be saved in your `.env` file as `GRAPH_ENDPOINT` (you can replace the default value if necessary).

### Metamask Integration

Open a browser with Metamask, toggle the wallet extension, and switch the network to `http://localhost:8545`. Then click the Metamask account avatar in the top right corner of the extension and select `Import Account`. You can paste the private key from the contract deployment step into the input box. You can also import your new token by selecting the `Assets` tab and clicking `Import tokens`.

### Token Application

Serve the Nuxt app from the root of this repository:

```shell
npm run dev
```

Paste the contract address from the recent deployment into the search bar and enter. You should see the token information in the app. You can also send some of your new token to another account on your network.

**Note:** You'll need to have your Metamask wallet connected (the one you used to deploy the contract) to the network at this point.

### Geth Integration

Visit [GethLab](https://github.com/natemiller1/GethLab) to confirm and run the commands to initialize your local geth node on port 8545 (if you don't have it running already). Make sure to first end the process running your Hardhat network (`CTRL + C` in the same terminal that you ran `npx hardhat node` in the first step.) 

You may also want to switch from using your private key directly in .env `KEY` variable to using the `DATADIR` and `PASSWORD` variables, which provide the location of your local geth account keystore file and your password for that file, respectively.

## Testing

We need to add test scripts compatible with Nuxt SSR and Docker (something like `@nuxt/test-utils` for Nuxt 3). Then we need to run those test scripts in `.github/workflows/pull-request.yaml` after the step for building the Docker image. In the longer term, we will also add better tooling for testing applications on local Kubernetes clusters that more closely resemble the production environment (more so than Kubernetes on Docker or K3s, using something like [Okteto](https://github.com/okteto/okteto))

## Releases

To create a new release according to the [Semantic Versioning](https://semver.org/) standard, we can use a CLI tool like [release-it](https://github.com/release-it/release-it). This helps us automate keeping our versioning synced across repositories and branches.

First run the following command:

```sh
npm run release
```

Then select the appropriate version increment and agree to commit the release to the git repository:

```sh
? Select increment (next version): patch (0.0.2) # major, minor, or patch
✔ npx auto-changelog -p

Changeset:
 M CHANGELOG.md
 M package-lock.json
 M package.json

? Commit (Release 0.0.2)? y
```

This sequence results in the following changes: 
- [CHANGELOG.md](CHANGELOG.md) is updated with all commits since the previous version
- [package.json](package.json), and [package-lock.json](package-lock.json) are updated with the new version
- File changes are committed to the repository 
- A new GitHub release is created with the new version as the tag

## Deployment

We use the following GitHub Actions workflows to test, build and push our images to [our organization](https://hub.docker.com/r/consensusnetworks/consensus-port) on Docker Hub: 
- Pull requests to `develop` and `master` branches trigger image builds (and eventually tests) 
- Pushes to `master` branch trigger image builds and pushes to the registry under the tags **latest** and **{your-commit-hash}**
- Releases from the `master` branch trigger image builds and pushes to the registry under the tags **latest**, **{your-commit-hash}**, and **{your-release-number}**

We can then manage our Kubernetes clusters and pod manifests in a separate repository to isolate environment configuration from application development. For reference, we included sample Kubernetes manifests that would be used in the separate repository to deploy this Nuxt app to a cloud provider managed cluster in the `kubernetes` directory. In addition to manifests, the separate repository would cover the following:
- Kubernetes cluster and managed infrastructure (like a DynamoDB) configuration
- Environment variables and secrets
- CI/CD pipelines for deploying integrated application resources to the cluster
- Helmfiles and Helm charts for organizing common application resources for the cluster

This repository setup also makes a serverless developer feel at home making cloud native applications (by hiding the ugly parts elsewhere).

## Contributing

Pull requests targeting the `develop` branch are welcome anytime. For major changes, please check out what's already being worked on [here](https://github.com/consensusnetworks/token-starter/issues) and open a new issue before starting!

Please make sure to update tests as appropriate. We will be adding a style guide in the future.

## Roadmap

Although this is a simple starter app, we can consider ways to improve the onboarding of new developers to the Ethereum ecosystem. These ideas will lead to changes in this starter repo. 

Some ideas may be best implemented in their own separate repository. You are encouraged to copy or fork this project and use it to start your own.

## License

[MIT](https://choosealicense.com/licenses/mit/)
