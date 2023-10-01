<script lang="ts">
import { defineComponent, ref, useFetch } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    const slidesTop = ref<Record<string, any>[]>([])
    const slidesBottom = ref<Record<string, any>[]>([])
    const title = ref('')

    const sliderClasses = {
      wrapper: 'flex bg-white mx-2 p-1 h-32 items-center border border-gray-light rounded-sm border-gray-light shadow-elevation',
      image: 'w-3/4 m-auto',
    }
    const settingsShare = {
      arrows: false,
      dots: false,
      infinite: true,
      slidesToShow: 5,
      slidesToScroll: 2,
      autoplay: true,
      speed: 8000,
      autoplaySpeed: 0,
      cssEase: 'linear',
      pauseOnFocus: false,
      pauseOnHover: false,
      rtl: false,
    }

    const settingsTop = {
      ...settingsShare,

      responsive: [
        {
          breakpoint: 1025,
          settings: {
            slidesToShow: 3.5,
          },
        },
        {
          breakpoint: 770,
          settings: {
            slidesToShow: 2.5,
          },
        },
        {
          breakpoint: 420,
          settings: {
            slidesToShow: 1.5,
          },
        },
      ],
    }

    const settingsBottom = {
      ...settingsShare,
      rtl: true,
      responsive: [
        {
          breakpoint: 1025,
          settings: {
            slidesToShow: 3.5,
          },
        },
        {
          breakpoint: 770,
          settings: {
            slidesToShow: 2.5,
          },
        },
        {
          breakpoint: 420,
          settings: {
            slidesToShow: 1.5,
          },
        },
      ],
    }

    useFetch(async ({ $cmwRepo }) => {
      const { productor, label } = await $cmwRepo.prismic.getSingle('productors')
      // Note: Some day we can make an API to handle these brands automatically without prismic

      // Get the productor length and split it in two arrays
      const productorLength = productor?.length || 0
      const productorHalf = Math.ceil(productorLength / 2)
      const top = productor?.slice(0, productorHalf) || []
      const bottom = productor?.slice(productorHalf, productorLength) || []
      slidesTop.value = top.concat(top)
      slidesBottom.value = bottom.concat(bottom)
      title.value = label as string
    })

    return {
      settingsBottom,
      settingsTop,
      sliderClasses,
      slidesBottom,
      slidesTop,
      title,
    }
  },
})
</script>

<template>
  <div class="my-5 bg-gray-lightest">
    <ClientOnly>
      <div class="py-5">
        <!-- <PrismicText v-if="title" class="text-center" :field="title" /> -->
        <h2 class="text-center" v-text="title" />

        <VueSlickCarousel v-if="!!slidesTop.length" v-bind="settingsTop" class="py-4">
          <div v-for="productor in slidesTop" :key="productor.name">
            <nuxt-link
              :to="localePath({ name: 'winery-handle', params: { handle: `${productor.link}.htm` } })"
              :class="sliderClasses.wrapper"
            >
              <img
                :src="productor.logo.url"
                alt="logo"
                height="120"
                :class="sliderClasses.image"
              >
            </nuxt-link>
          </div>
        </VueSlickCarousel>
        <VueSlickCarousel v-if="!!slidesBottom.length" v-bind="settingsBottom" class="py-4">
          <div v-for="productor in slidesBottom" :key="productor.name">
            <nuxt-link
              :to="localePath({ name: 'winery-handle', params: { handle: `${productor.link}.htm` } })"
              :class="sliderClasses.wrapper"
            >
              <img
                :src="productor.logo.url"
                alt="logo"
                height="120"
                :class="sliderClasses.image"
              >
            </nuxt-link>
          </div>
        </VueSlickCarousel>
        <CmwButton class="w-max mx-auto my-4" variant="ghost" :label="$t('common.cta.viewAll')" :to="localePath('winery')" />
      </div>
    </ClientOnly>
  </div>
</template>
