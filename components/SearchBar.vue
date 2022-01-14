<template>
  <div class="pt-9 pb-3">
    <h1 class="pb-3 text-xl font-extrabold tracking-tight text-slate-900">
      {{ title }}
    </h1>
    <label for="search-input" class="block text-sm font-medium text-slate-700">
      {{ label }}
    </label>
    <div class="mt-1 relative flex">
      <input
        name="search-input"
        id="search-input"
        type="text"
        class="px-4 py-2 w-full bg-gray-100 rounded-l-md shadow"
        :placeholder="placeholder"
        @input="setSearchInput($event.target.value)"
        @keyup.enter="submit(searchInput)"
      />
      <button
        :disabled="loading"
        @click="submit(searchInput)"
        class="flex items-center justify-center px-4 bg-gray-100 rounded-r-md shadow"
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
  title: {
    type: String,
    default: "Lookup",
  }
});

const searchInput = useState("seachInput", () => null);
const setSearchInput = (newSearchInput) => {
  searchInput.value = newSearchInput;
}

const loading = useState("loading", () => false);
const setLoading = (newLoading) => {
  loading.value = newLoading;
}

const submit = async (value) => {
  setLoading(true);
  await props.handler(value);
  // Leave the input for user to clear
  setLoading(false);
};
</script>