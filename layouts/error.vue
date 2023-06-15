<script lang="ts">
import { defineComponent, toRefs } from '@nuxtjs/composition-api'

export default defineComponent({
  layout({ $config }) {
    return $config.STORE
  },
  props: ['error'], // you can set a custom layout for the error page
  setup(props) {
    const { statusCode } = toRefs(props.error)

    return { statusCode }
  },
})
</script>

<template>
  <div class="relative text-center mt-12 px-4">
    <ClientOnly>
      <div v-if="statusCode === 404" class="md:(grid grid-cols-2 items-center)">
        <img
          class="w-3/4 mx-auto" src="https://cdn.shopify.com/s/files/1/0668/1860/5335/files/wine-stain.png?width=900"
          alt="empty-bottles"
        >
        <div class="text-left">
          <h2 class="h1 text-secondary" v-text="$t('notFoundTitle')" />
          <p class="mb-8 md:w-3/5" v-text="$t('notFoundLine')" />
        </div>
        <div class="my-8 text-left md:text-center">
          or try a new drink from our
          <NuxtLink to="/" class="text-primary-400">
            Home page
          </NuxtLink>
        </div>
      </div>
      <div v-else class="text-xl" v-text="error.message" />
    </ClientOnly>
  </div>
</template>
