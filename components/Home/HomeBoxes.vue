<script>
import { ref, useContext, useFetch } from '@nuxtjs/composition-api'
import documents from '../../prismic-mapper'
import { generateKey } from '~/utilities/strings'
import { inRange } from '@/utilities/math'

export default {
  setup() {
    const { $config, i18n, $prismic, $sentry } = useContext()
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

    const { fetch } = useFetch(async () => {
      await $prismic.api.getSingle(
        documents[$config.STORE].homeBoxes,
        { lang: i18n.localeProperties.iso.toLowerCase() },
      )
        .then(({ data }) => {
          boxes.value = data.box
        })
        .catch((err) => {
          $sentry.captureException(new Error(`Catch getting homeBoxes from prismic: ${err}`))
        })
    })

    return { carousel, responsive, fetch, boxes }
  },

  methods: { inRange, generateKey },
}
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
