<script>
export default {
  layout(context) {
    return context.$config.STORE
  },
  props: ['error'], // you can set a custom layout for the error page
}
</script>

<template>
  <div class="cmw-main container">
    <div class="cmw-relative cmw-text-center cmw-mt-12">
      <div v-if="error.statusCode === 404" class="md:(cmw-grid cmw-grid-cols-2 cmw-items-center)">
        <img
          class="cmw-w-3/4 cmw-mx-auto" :src="require('assets/images/wine-stain.png')"
          alt="empty-bottles"
        >
        <div class="cmw-text-left">
          <h2 class="cmw-h1 cmw-text-secondary" v-text="$t('notFoundTitle')" />
          <p class="cmw-mb-8 md:cmw-w-3/5" v-text="$t('notFoundLine')" />
        </div>
      </div>
      <h1 v-else>
        An error occurred
      </h1>
    </div>
    <div class="cmw-my-8">
      or try a new drink from our
      <NuxtLink to="/">
        Home page
      </NuxtLink>
    </div>
  </div>
</template>
