<template>
  <div class="max-w-3xl mx-auto p-6 pb-12">
    <SearchBar
      :title="'Lookup'"
      :label="'Token address'"
      :placeholder="'Enter token address...'"
      :handler="getToken"
    />
    <StatRow :label="'Token'" :stats="{ name, symbol, supply, balance }" />
    <TransactionForm
      :title="'Transfer'"
      :disabled="!balance"
      :handler="sendToken"
    />
  </div>
</template>

<script setup>
const {
  address,
  name,
  symbol,
  supply,
  balance,
  setAddress,
  setStats,
  getToken,
  sendToken,
} = useToken();
</script>