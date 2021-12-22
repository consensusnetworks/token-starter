<template>
  <SearchBar
    :label="'Token address'"
    :placeholder="'Enter token address...'"
    :handler="getToken"
  />
  <StatRow :label="'Token info & balance'" :stats="tokenStats" />
  <TransactionForm :disabled="!tokenBalance" :handler="sendToken" />
</template>

<script setup>
import { reactive, toRef } from "vue";
import { ethers } from "ethers";
import Token from "@/src/artifacts/contracts/Token.sol/Token.json";
import { formatUnits, parseUnits } from "@ethersproject/units";

// Move to a separate composable or state management directory file
const state = reactive({
  tokenAddress: "",
  tokenStats: {
    name: null,
    symbol: null,
    supply: null,
    balance: null,
  },
});

// Create a ref to the observable state property
// So we can pass around as a prop without losing reactivity
const tokenAddress = toRef(state, "tokenAddress");
const tokenStats = toRef(state, "tokenStats");
const tokenBalance = computed(() => {
  return state.tokenStats.balance;
});

const setTokenAddress = (newAddress) => {
  state.tokenAddress = newAddress;
};

const setTokenStats = (newTokenStats) => {
  state.tokenStats = {
    ...state.tokenStats,
    ...newTokenStats,
  };
};

const getAccount = async (metamask) => {
  return await metamask.request({ method: "eth_requestAccounts" });
};

const getToken = async (address) => {
  if (!address) return;

  // Get global metamask instance
  // Only exists client side
  const metamask = window.ethereum;
  if (typeof metamask !== "undefined") {
    try {
      const [account] = await getAccount(metamask);
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

      // Set token address
      setTokenAddress(address);

      // Set token stats
      setTokenStats({
        name,
        symbol,
        supply,
        balance,
      });
    } catch (error) {
      console.log("Error: ", error);

      window.alert(
        `Failed to get token${
          error.message ? ": " + error.message : ""
        }`
      );
    }
  }
};

const getTokenalysis = async (address) => {
  if (!address) return;
  return await $fetch(`/api/tokenalysis`, { params: { address } });
}

const sendToken = async ({ address, amount }) => {
  if (!address || !amount) return;
  const metamask = window.ethereum;
  if (typeof metamask !== "undefined") {
    try {
      await getAccount(metamask);
      const provider = new ethers.providers.Web3Provider(metamask);
      const signer = provider.getSigner();

      // Get contract instance
      const contract = new ethers.Contract(
        tokenAddress.value,
        Token.abi,
        signer
      );

      // Log contract for debugging
      console.log("Inspect the contract: ", contract);

      // Convert amount to big number units and transfer
      const symbol = await contract.symbol();
      const decimals = await contract.decimals();
      const units = parseUnits(amount.toString(), decimals);
      const transaction = await contract.transfer(address, units);

      // Log transaction for debugging
      console.log("Inspect the transaction: ", transaction);

      await transaction.wait();

      window.alert(`${amount} ${symbol} on its way to ${address} 🚀`);

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
</script>