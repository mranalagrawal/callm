<script lang="ts">
import { computed, defineComponent, ref, useFetch } from '@nuxtjs/composition-api'
import bgCarousel from 'assets/images/bg-carousel.png'
import prismicConfig from '~/config/prismicConfig'
import type { TStores } from '~/config/themeConfig'
import { getIconByFeature } from '~/utilities/icons'
import { generateKey } from '~/utilities/strings'
import { inRange } from '~/utilities/math'

export default defineComponent({
  setup() {
    const items = ref([])
    const title = ref('')
    const c1 = ref<any>(null)
    const currentC1Slide = computed(() => c1.value && c1.value.$refs.innerSlider.currentSlide)

    const settings = {
      arrows: false,
      dots: true,
      infinite: true,
      speed: 8000,
      slidesToShow: 4,
      slidesToScroll: 2,
      autoplay: true,
      autoplaySpeed: 0,
      cssEase: 'linear',
      responsive: [
        {
          breakpoint: 1023,
          settings: {
            slidesToShow: 3,
          },
        },
        {
          breakpoint: 767,
          settings: {
            slidesToShow: 2,
          },
        },
        {
          breakpoint: 411,
          settings: {
            slidesToShow: 1,
          },
        },
      ],
    }

    useFetch(async ({ $config, $cmwRepo, $handleApiErrors }) => {
      await $cmwRepo.prismic.getSingle({ page: prismicConfig[$config.STORE as TStores]?.components.selections })
        .then(({ data }) => {
          items.value = data.body[0].items.concat(data.body[0].items).concat(data.body[0].items)
          title.value = data.body[0].primary.title
        })
        .catch((err: Error) => $handleApiErrors(`Catch getting callToAction data from prismic: ${err}`))
    })
    return { c1, currentC1Slide, items, title, settings, bgCarousel }
  },
  methods: { inRange, getIconByFeature, generateKey },

})
</script>

<template>
  <div class="cmw-py-8 cmw-mt-4 cmw-bg-gray-lightest cmw-min-h-[200px]">
    <PrismicRichText v-if="title" class="cmw-text-center" :field="title" />
    <ClientOnly v-if="!!items.length">
      <VueSlickCarousel v-bind="settings" ref="c1" :dots="false" dots-class="c-carouselDots">
        <div v-for="({ icon_code, label, link }, idx) in items" :key="generateKey(`${title}-${idx}`)" class="cmw-my-8">
          <NuxtLink
            :to="link"
            class="cmw-bg-cover cmw-bg-no-repeat cmw-bg-center cmw-text-white cmw-h-[88px] cmw-m-2 cmw-rounded-sm
           cmw-flex cmw-gap-2 cmw-items-center cmw-justify-center hover:(!cmw-text-white cmw-no-underline cmw-shadow-elevation)"
            :style="{ backgroundImage: `url('${bgCarousel}')` }"
          >
            <VueSvgIcon
              :data="require(`@/assets/svg/${getIconByFeature(icon_code)}.svg`)"
              class="cmw-block cmw-flex-shrink-0"
              width="40"
              height="auto"
            />
            <span>{{ label }}</span>
          </NuxtLink>
        </div>
        <template #customPaging="page">
          <button
            class="c-carouselDots__dot"
            :class="{ '-sm': !inRange((page - currentC1Slide), -2, 2) }"
          />
        </template>
      </VueSlickCarousel>
    </ClientOnly>
  </div>
</template>

<style scoped>
::v-deep(.c-carouselDots li) {
  display: flex !important;
}

::v-deep(.slick-active .c-carouselDots__dot) {
  transform: scale(1);
  background-color: theme('colors.primary.DEFAULT');
}

::v-deep(.c-carouselDots__dot.-sm) {
  transform: scale(0.3);
}
</style>
