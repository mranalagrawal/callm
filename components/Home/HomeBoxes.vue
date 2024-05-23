<script lang="ts">
import { defineComponent, ref, useFetch } from '@nuxtjs/composition-api'

import { inRange } from '~/utilities/math'
import { generateKey } from '~/utilities/strings'

export default defineComponent({
  setup() {
    const carousel = ref(null)

    const boxes = ref<Record<string, any>[]>([])
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

    const { fetch } = useFetch(async ({ $cmwRepo }) => {
      const data = await $cmwRepo.prismic.getSingle('home-boxes')
      boxes.value = data.box as Record<string, any>[]
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
      :show-dots="true" class="relative"
    >
      <div v-for="({ title, description, image }) in boxes" :key="generateKey(title)" class="c-wrapper h-full pt-8">
        <div class="relative rounded border border-gray-light px-4 text-center h-full pt-12 pb-2">
          <div class="absolute flex bg-white transform left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 px-2 w-[100px] h-[100px]">
            <img
              :src="image.url"
              class="m-auto w-full h-auto"
              :alt="image.alt || 'missing'"
              width="80"
              height="80"
            >
          </div>
          <div class="cmw-font-bold text-secondary-700" v-text="title" />
          <div class="prose c-wrapper__desc" v-html="description" />
        </div>
      </div>
    </SsrCarousel>
  </div>
</template>

<style scoped>
.c-wrapper {
  container: card-wrapper / inline-size;
}

.c-wrapper__desc {
  min-height: 16ch;
}

@container card-wrapper (min-width: 200px) {
  .c-wrapper__desc {
    min-height: 14ch;
  }
}

@container card-wrapper (min-width: 300px) {
  .c-wrapper__desc {
    min-height: 12ch;
  }
}

@container card-wrapper (min-width: 360px) {
  .c-wrapper__desc {
    min-height: 14ch;
  }
}

@container card-wrapper (min-width: 460px) {
  .c-wrapper__desc {
    min-height: 10ch;
  }
}
</style>
