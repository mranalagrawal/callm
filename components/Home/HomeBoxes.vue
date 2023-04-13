<script>
import { computed, ref, useContext, useFetch } from '@nuxtjs/composition-api'
import VueSlickCarousel from 'vue-slick-carousel'
import documents from '../../prismic-mapper'
import { generateKey } from '@/utilities/strings'
import { inRange } from '@/utilities/math'
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'

export default {
  components: { VueSlickCarousel },
  setup() {
    const { $config, i18n, $prismic } = useContext()

    const boxes = ref([])
    const carouselSettings = {
      dots: true,
      focusOnSelect: true,
      infinite: true,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 3,
      touchThreshold: 5,
      responsive: [
        {
          breakpoint: 411,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            dots: true,
            arrows: false,
          },
        },
        {
          breakpoint: 767,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
            dots: true,
            arrows: false,
          },
        },
        {
          breakpoint: 1023,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
            dots: false,
            arrows: false,
          },
        },
      ],
    }

    const c1 = ref(null)
    const currentSlide = computed(() => c1.value && c1.value.$refs.innerSlider.currentSlide)

    const { fetch } = useFetch(async () => {
      const { data } = await $prismic.api.getSingle(
        documents[$config.STORE].homeBoxes,
        { lang: i18n.localeProperties.iso.toLowerCase() },
      )
      boxes.value = data.box
    })

    return { c1, currentSlide, carouselSettings, fetch, boxes }
  },

  methods: { inRange, generateKey },
}
</script>

<template>
  <div v-if="!!boxes.length" class="cmw-max-w-screen-xl cmw-mx-auto cmw-py-4 cmw-px-4 cmw-mt-4">
    <VueSlickCarousel ref="c1" v-bind="carouselSettings" dots-class="c-carouselDots">
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
      <template #customPaging="page">
        <button
          :data-test="page"
          class="c-carouselDots__dot"
          :class="{ '-sm': !inRange((page - currentSlide), -2, 2) }"
        />
      </template>
    </VueSlickCarousel>
  </div>
</template>

<style lang="css" scoped>
::v-deep(.slick-track) {
  display: flex !important;
}

::v-deep(.slick-slide) > div {
  height: 100%;
}

::v-deep(.slick-slide) {
  padding-left: 8px;
  padding-right: 8px;
  height: inherit !important;
}

::v-deep(.c-carouselDots li) {
  display: flex !important;
}

::v-deep(.slick-active .c-carouselDots__dot) {
  transform: scale(1);
  background-color: theme('colors.primary.DEFAULT');
}

::v-deep(li:not(.slick-active) .c-carouselDots__dot.-sm) {
  transform: scale(0.3);
}
</style>
