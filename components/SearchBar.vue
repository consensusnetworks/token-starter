<template>
  <div class="pt-6 pb-3">
    <label for="search-input" class="block text-sm font-medium text-gray-700">
      {{ label }}
    </label>
    <div class="mt-1 relative flex">
      <input
        name="search-input"
        id="search-input"
        v-model="searchInput"
        type="text"
        class="px-4 py-2 w-full bg-gray-100 rounded-l-md"
        :placeholder="placeholder"
      />
      <button
        :disabled="loading"
        @click="submit(searchInput)"
        class="flex items-center justify-center px-4 bg-gray-100 rounded-r-md"
      >
        <svg
          class="w-6 h-6 text-gray-600"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path
            d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z"
          />
        </svg>
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
  placeholder: {
    type: String,
    default: "Search...",
  },
  label: {
    type: String,
    default: "Search",
  },
});
const searchInput = ref("");
const loading = ref(false);
const submit = async (value) => {
  loading.value = true;
  await props.handler(value);
  // Leave the input for user to clear
  loading.value = false;
};
</script>