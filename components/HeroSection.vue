<template>
  <!-- Todo: remove this hack for Nuxt SSR to load favicon -->
  <div style="background-image: url('favicon.ico');"></div>

  <section
    class="relative h-96"
    style="background-image: url('background.png')"
  >
    <div
      class="
        rounded-full
        bg-gradient-radial
        from-slate-900
        via-transparent
        to-transparent
        h-full
      "
    ></div>
    <div
      class="
        z-50
        h-full
        absolute
        text-center
        top-0
        left-1/2
        transform
        -translate-x-1/2
        flex flex-col
        justify-center
        items-center
      "
    >
      <h2
        class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white"
      >
        Token Starter
      </h2>
      <p class="mt-4 max-w-2xl text-xl text-slate-300 mx-auto">
        Manage your tokens
      </p>
    </div>
  </section>
</template>