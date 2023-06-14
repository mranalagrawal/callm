<script>
export default {
  layout(context) {
    return context.$config.STORE
  },
  props: ['error'], // you can set a custom layout for the error page
}
</script>

<template>
  <div class="main container">
    <div class="relative text-center mt-12">
      <div v-if="error.statusCode === 404" class="md:(grid grid-cols-2 items-center)">
        <img
          class="w-3/4 mx-auto" src="https://cdn.shopify.com/s/files/1/0668/1860/5335/files/wine-stain.png?width=900"
          alt="empty-bottles"
        >
        <div class="text-left">
          <h2 class="h1 text-secondary" v-text="$t('notFoundTitle')" />
          <p class="mb-8 md:w-3/5" v-text="$t('notFoundLine')" />
        </div>
      </div>
      <h1 v-else>
        An error occurred
      </h1>
    </div>
    <div class="my-8">
      or try a new drink from our
      <NuxtLink to="/">
        Home page
      </NuxtLink>
    </div>
  </div>
</template>
