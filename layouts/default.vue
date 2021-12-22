<template>
  <div class="min-h-full">
    <HeroSection v-if="true" />
    <!-- ^^^ Todo: only show section if on home page -->

    <main>
      <div class="max-w-3xl mx-auto p-6">
        <slot />
      </div>
    </main>
  </div>
</template>