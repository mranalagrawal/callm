<script lang="ts">
import { defineComponent, inject, ref, useFetch } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    const isDesktop = inject('isDesktop')
    const preFooterData = ref<Record<string, any>[]>([])

    useFetch(async ({ $cmwRepo }) => {
      const data = await $cmwRepo.prismic.getSingle('footer')
      preFooterData.value = data.body as Record<string, any>[]
    })

    return {
      preFooterData,
      isDesktop,
    }
  },

})
</script>

<template>
  <div class="max-w-screen-xl mx-auto md:px-4">
    <div class="h2 text-center pt-20 pb-8">
      {{ $t('footer.explore') }}
    </div>
    <div :class="{ hidden: isDesktop }">
      <div v-for="item in preFooterData" :key="item.id">
        <NuxtLink
          :to="localePath(item?.primary?.link || '/')"
          class="block overline-2 text-secondary-700 text-uppercase text-sm px-4 py-2"
        >
          {{ item?.primary?.title }}
        </NuxtLink>
      </div>
    </div>
    <div :class="{ hidden: !isDesktop }" class="w-full flex justify-between">
      <div v-for="item in preFooterData" :key="item.id">
        <NuxtLink
          :to="localePath(item?.primary?.link || '/')"
          class="block overline-2 text-secondary-700 text-uppercase text-sm pb-8"
        >
          {{ item?.primary?.title }}
        </NuxtLink>
        <p
          v-for="link in item.items"
          :key="`inner_${link.name}`"
          class="pb-0"
        >
          <NuxtLink :to="localePath(link?.link || '/')">
            {{ link?.name }}
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>
