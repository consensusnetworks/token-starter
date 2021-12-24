<template>
  <div class="pt-9 pb-3">
    <h1 class="pb-3 text-xl font-extrabold tracking-tight text-slate-900">
      {{ title }}
    </h1>
    <div class="grid grid-cols-3 gap-6">
      <div class="col-span-3">
        <label
          for="recipient-input"
          class="block text-sm font-medium text-slate-700"
        >
          Recipient
        </label>
        <div class="mt-1 relative flex">
          <input
            name="recipient-input"
            id="recipient-input"
            type="text"
            class="px-4 py-2 w-full bg-gray-100 rounded-md shadow"
            placeholder="Enter recipient address..."
            @input="setRecipient($event.target.value)"
          />
        </div>
      </div>
      <div class="col-span-2">
        <label
          for="amount-input"
          class="block text-sm font-medium text-slate-700"
        >
          Amount
        </label>
        <div class="mt-1 relative flex">
          <input
            name="amount-input"
            id="amount-input"
            type="number"
            class="px-4 py-2 w-full bg-gray-100 rounded-md shadow"
            placeholder="Enter amount..."
            @input="setAmount($event.target.value)"
          />
        </div>
      </div>
      <button
        :disabled="disabled || !recipient || !amount || loading"
        @click="submit({ recipient, amount })"
        type="button"
        class="
          col-span-1
          inline-flex
          justify-center
          rounded-md
          border border-transparent
          px-4
          py-2
          bg-slate-600
          text-base
          font-medium
          text-white
          focus:outline-none
          focus:ring-2
          focus:ring-offset-2
          focus:ring-slate-500
          ml-3
          w-auto
          text-sm
          h-10
          self-end
          shadow
          disabled:opacity-50
        "
        :class="{
          'hover:bg-slate-700': !disabled,
        }"
      >
        Send
      </button>
    </div>
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
  },
  title: {
    type: String,
    default: "Transaction form",
  },
});

const recipient = useState(null);
const setRecipient = (newRecipient) => {
  recipient.value = newRecipient;
}

const amount = useState(null);
const setAmount = (newAmount) => {
  amount.value = newAmount;
}

const loading = useState(false);
const setLoading = (newLoading) => {
  loading.value = newLoading;
}

const submit = async (data) => {
  setLoading(true);
  try {
    await props.handler(data);
    // Reset the form if successful
    setRecipient(null);
    setAmount(null)
  } catch (error) {
    console.log("Error:", error);
  }
  setLoading(false);
};
</script>