<template>
  <div class="mb-8 md:(grid grid-cols-2 items-center)">
    <img
      class="w-3/4 mr-auto ml-auto md:mr-0" src="https://cdn.shopify.com/s/files/1/0668/1860/5335/files/wine-stain.png?width=900"
      alt="empty-bottles"
    >
    <div class="text-left">
      <h2 class="h1 text-secondary" v-text="$t('pages.gone.title')" />
      <i18n
        class="md:w-3/5"
        path="pages.gone.line"
        tag="p"
      >
        <NuxtLink :to="localePath('/')" class="text-primary-400 hover:(underline)">
          {{ $t('pages.notFound.link') }}
        </NuxtLink>
      </i18n>
    </div>
  </div>
</template>
