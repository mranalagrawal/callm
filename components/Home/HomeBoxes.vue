<script lang="ts">
import { defineComponent, ref, useFetch } from '@nuxtjs/composition-api'
import prismicConfig from '~/config/prismicConfig'
import type { TStores } from '~/config/themeConfig'
import { generateKey } from '~/utilities/strings'
import { inRange } from '@/utilities/math'

export default defineComponent({
  setup() {
    const carousel = ref(null)

    const boxes = ref([])
    const responsive = [
      {
        minWidth: 0,
        slidesPerPage: 1,
      },
      {
        minWidth: 767,
        slidesPerPage: 2,
      },
      {
        minWidth: 1023,
        slidesPerPage: 3,
      },
    ]

    const { fetch } = useFetch(async ({ $config, $cmwRepo, $handleApiErrors }) => {
      await $cmwRepo.prismic.getSingle({ page: prismicConfig[$config.STORE as TStores]?.components.homeBoxes })
        .then(({ data }) => {
          boxes.value = data.box
        })
        .catch((err: Error) => $handleApiErrors(`Catch getting homeBoxes from prismic: ${err}`))
    })

    return { carousel, responsive, fetch, boxes }
  },

  methods: { inRange, generateKey },
})
</script>

<template>
  <div v-if="!!boxes.length" class="max-w-screen-xl mx-auto py-8 px-4 mt-4">
    <SsrCarousel
      ref="carousel" :key="boxes.length" :responsive="responsive" :show-arrows="false"
      :show-dots="false" class="relative"
    >
      <div v-for="({ title, description, image }) in boxes" :key="generateKey(title)" class="h-full pt-8">
        <div class="relative rounded border border-gray-light px-4 text-center h-full pt-12 pb-2">
          <div class="absolute flex bg-white transform left-1/2 top-0 translate-x-[-50%] translate-y-[-50%] px-2 w-[100px] h-[100px]">
            <img
              :src="image.url"
              class="m-auto w-full h-auto"
              :alt="image.alt || 'missing'"
              width="80"
              height="80"
            >
          </div>
          <div class="font-bold text-secondary-700" v-text="title" />
          <p v-text="description" />
        </div>
      </div>
    </SsrCarousel>
  </div>
</template>
