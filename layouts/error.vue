<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  props: ['error'], // you can set a custom layout for the error page
  setup(props) {
    const { statusCode } = props.error

    const componentMap = {
      404: () => import('~/components/Error/Error404.vue'),
      410: () => import('~/components/Error/Error410.vue'),
    }
    return { statusCode, componentMap }
  },
})
</script>

<template>
  <div>
    <div class="relative text-center mt-12 px-4">
      <ClientOnly v-if="statusCode && componentMap[statusCode]">
        <component :is="componentMap[statusCode]" />
      </ClientOnly>
      <div v-else class="text-xl" v-text="error.message" />
    </div>
  </div>
</template>
