<template>
  <div class="min-h-full">
    <HeroSection />
    <!-- ^^^ Todo: only show section if on home page -->

    <!-- Todo: fix SSR hydration issue and remove client-only wrapper -->
    <client-only>
      <slot />
    </client-only>
  </div>
</template>