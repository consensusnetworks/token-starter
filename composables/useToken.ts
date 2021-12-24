import { useState } from "#app";

import { ethers } from "ethers";
import Token from "@/src/artifacts/contracts/Token.sol/Token.json";
import { formatUnits, parseUnits } from "@ethersproject/units";

export default function () {
  const address = useState("address", () => null);
  const name = useState("name", () => null);
  const symbol = useState("symbol", () => null);
  const supply = useState("supply", () => null);
  const balance = useState("balance", () => null);

  const setAddress = (newAddress) => {
    address.value = newAddress;
  };

  const setStats = (newStats) => {
    name.value = newStats.name;
    symbol.value = newStats.symbol;
    supply.value = newStats.supply;
    balance.value = newStats.balance;
  };

  const getToken = async (address) => {
    if (!address) return;

    // Get global metamask instance on client (browser extension)
    const metamask = (window as any).ethereum;
    if (typeof metamask !== "undefined") {
      try {
        const [account] = await metamask.request({
          method: "eth_requestAccounts",
        });
        const provider = new ethers.providers.Web3Provider(metamask);
        const signer = provider.getSigner();

        // Get contract instance
        const contract = new ethers.Contract(address, Token.abi, signer);

        // Log contract for debugging
        console.log("Inspect the contract: ", contract);

        // Get token stats
        const name = await contract.name();
        const symbol = await contract.symbol();
        const decimals = await contract.decimals();
        const supply = parseInt(
          formatUnits(await contract.totalSupply(), decimals)
        );
        const balance = parseInt(
          formatUnits(await contract.balanceOf(account), decimals)
        );

        // Get token transfers and log
        // Later we could display these
        const transfers = await getTransfers();
        console.log(transfers);

        // Set token address
        setAddress(address);

        // Set token stats
        setStats({
          name,
          symbol,
          supply,
          balance,
        });
      } catch (error) {
        console.log("Error: ", error);

        window.alert(
          `Failed to get token${error.message ? ": " + error.message : ""}`
        );
      }
    }
  };

  // Right now we assume that the subgraph is already indexing a single ERC-20 token
  // In the future we may have multiple tokens indexed (multiple sources in subgraph/src/mappings.ts)
  // Here we would just pass a contract address or get transfers all indexed tokens
  const getTransfers = async () => {
    try {
      return await $fetch("/api/transfers");
    } catch (error) {
      console.log("Error: ", error);
      console.log("Make sure you have set up the subgraph");
    }
  };

  // Share the love!
  const sendToken = async ({ recipient, amount }) => {
    if (!recipient || !amount) return;
    const metamask = (window as any).ethereum;
    if (typeof metamask !== "undefined") {
      try {
        await metamask.request({ method: "eth_requestAccounts" });
        const provider = new ethers.providers.Web3Provider(metamask);
        const signer = provider.getSigner();

        // Get contract instance using the current address value
        const contract = new ethers.Contract(address.value, Token.abi, signer);

        // Log contract for debugging
        console.log("Inspect the contract: ", contract);

        // Convert amount to big number units and transfer
        const symbol = await contract.symbol();
        const decimals = await contract.decimals();
        const units = parseUnits(amount.toString(), decimals);
        const transaction = await contract.transfer(recipient, units);

        // Log transaction for debugging
        console.log("Inspect the transaction: ", transaction);

        await transaction.wait();

        window.alert(`${amount} ${symbol} on its way to ${recipient} 🚀`);
      } catch (error) {
        console.log("Error: ", error);

        window.alert(
          `Failed to complete transaction${
            error.message ? ": " + error.message : ""
          }`
        );
      }
    }
  };

  return {
    address,
    name,
    symbol,
    supply,
    balance,
    setAddress,
    setStats,
    getToken,
    sendToken,
  };
}
