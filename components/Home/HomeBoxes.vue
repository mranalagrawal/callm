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
  <div v-if="!!boxes.length" class="cmw-max-w-screen-xl cmw-mx-auto cmw-py-8 cmw-px-4 cmw-mt-4">
    <SsrCarousel
      ref="carousel" :key="boxes.length" :responsive="responsive" :show-arrows="false"
      :show-dots="false" class="cmw-relative"
    >
      <div v-for="({ title, description, image }) in boxes" :key="generateKey(title)" class="cmw-h-full cmw-pt-8">
        <div class="cmw-relative cmw-rounded cmw-border cmw-border-gray-light cmw-px-4 cmw-text-center cmw-h-full cmw-pt-12 cmw-pb-2">
          <div class="cmw-absolute cmw-flex cmw-bg-white cmw-transform cmw-left-1/2 cmw-top-0 cmw-translate-x-[-50%] cmw-translate-y-[-50%] cmw-px-2 cmw-w-[100px] cmw-h-[100px]">
            <img
              :src="image.url"
              class="cmw-m-auto cmw-w-full cmw-h-auto"
              :alt="image.alt || 'missing'"
              width="80"
              height="80"
            >
          </div>
          <div class="cmw-font-bold cmw-text-secondary-700" v-text="title" />
          <p v-text="description" />
        </div>
      </div>
    </SsrCarousel>
  </div>
</template>
