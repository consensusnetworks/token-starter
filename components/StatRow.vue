<template>
  <div class="pt-3 pb-3">
    <div
      name="stat-box"
      id="stat-box"
      class="
        relative
        flex
        grid grid-cols-4
        w-auto
        mx-auto
        rounded-md
        shadow
        overflow-hidden
        border-b
        border-gray-200
      "
    >
      <div
        v-for="(value, name) in stats"
        :key="name"
        class="text-center w-full py-4"
      >
        <div class="text-2xl font-black text-slate-900">
          {{ value ? parseStat(value) : "–" }}
        </div>
        <div class="text-xs font-semibold text-slate-500 capitalize">
          {{ name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  stats: {
    type: Object,
    required: true,
  },
  label: {
    type: String,
    default: "Stats",
  },
});

// Could move to a Vue mixin directory file
const parseStat = (stat) => {
  if (typeof stat === "number") {
    return abbreviateNumber(stat);
  }
  return stat;
};

// Could move to a Vue mixin directory file
const abbreviateNumber = (number) => {
  const suffixes = ["", "k", "M", "G", "T", "P", "E"];

  // Get the suffix index by tier
  const tier = (Math.log10(Math.abs(number)) / 3) | 0;
  if (tier === 0) return number;

  // Get suffix and determine scale
  const suffix = suffixes[tier];
  const scale = Math.pow(10, tier * 3);

  // Scale the number
  const scaled = number / scale;

  // Format number and add suffix
  return scaled.toFixed(1) + suffix;
};
</script>