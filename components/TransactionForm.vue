<template>
  <div class="pt-3 pb-3 grid grid-cols-3 gap-6">
    <div class="col-span-3">
      <label
        for="recipient-input"
        class="block text-sm font-medium text-gray-700"
      >
        Recipient
      </label>
      <div class="mt-1 relative flex">
        <input
          name="recipient-input"
          id="recipient-input"
          v-model="address"
          type="text"
          class="px-4 py-2 w-full bg-gray-100 rounded-md"
          placeholder="Enter recipient address..."
        />
      </div>
    </div>
    <div class="col-span-2">
      <label
        for="amount-input"
        class="block text-sm font-medium text-gray-700"
      >
        Amount
      </label>
      <div class="mt-1 relative flex">
        <input
          name="amount-input"
          id="amount-input"
          v-model="amount"
          type="number"
          class="px-4 py-2 w-full bg-gray-100 rounded-md"
          placeholder="Enter amount..."
        />
      </div>
    </div>
    <button
      :disabled="disabled || !address || !amount || loading"
      @click="submit({ address, amount })"
      type="button"
      class="
        col-span-1
        inline-flex
        justify-center
        rounded-md
        border border-transparent
        shadow-sm
        px-4
        py-2
        bg-slate-600
        text-base
        font-medium
        text-white
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500
        disabled:opacity-25
        ml-3
        w-auto
        text-sm
        h-10
        self-end
      "
      :class="{
        'hover:bg-slate-700': !disabled,
      }"
    >
      Send
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  handler: {
    type: Function,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  }
});
const address = ref("");
const amount = ref(0);
const loading = ref(false);
const submit = async (data) => {
  loading.value = true;
  try {
    await props.handler(data);

    // Reset the form if successful
    address.value = "";
    amount.value = 0;
  } catch (error) {
    console.log("Error:", error);
  }
  loading.value = false;
};
</script>