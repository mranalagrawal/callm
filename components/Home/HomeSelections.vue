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

    useFetch(async ({ $config, $cmwRepo }) => {
      await $cmwRepo.prismic.getSingle({ page: prismicConfig[$config.STORE as TStores]?.components.selections })
        .then((data) => {
          if (!data.body || !Object.keys(data.body).length)
            return

          items.value = data.body[0].items.concat(data.body[0].items).concat(data.body[0].items)
          title.value = data.body[0].primary.title
        })
    })
    return { c1, currentC1Slide, items, title, settings, bgCarousel }
  },
  methods: { inRange, getIconByFeature, generateKey },

})
</script>

<template>
  <div class="py-8 mt-4 bg-gray-lightest min-h-[200px]">
    <PrismicRichText v-if="title" class="text-center" :field="title" />
    <ClientOnly v-if="!!items.length">
      <VueSlickCarousel v-bind="settings" ref="c1" :dots="false" dots-class="c-carouselDots">
        <div v-for="({ icon_code, label, link }, idx) in items" :key="generateKey(`${title}-${idx}`)" class="my-8">
          <NuxtLink
            :to="link"
            class="bg-cover bg-no-repeat bg-center text-white h-[88px] m-2 rounded-sm
           flex gap-2 items-center justify-center hover:(shadow-elevation)"
            :style="{ backgroundImage: `url('${bgCarousel}')` }"
          >
            <VueSvgIcon
              :data="require(`@/assets/svg/${getIconByFeature(icon_code)}.svg`)"
              class="block flex-shrink-0"
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
