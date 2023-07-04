<script lang="ts">
import { defineComponent, ref, useFetch } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    const slides = ref<Record<string, any>[]>([])
    const title = ref('')

    const settingsTop = {
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

    const { fetch } = useFetch(async ({ $cmwRepo }) => {
      await $cmwRepo.prismic.getSingle({ page: 'productors' })
        .then((data) => {
          const { productor, label } = data

          slides.value = productor?.concat(productor) || []
          title.value = label as string
        })
    })
    return {
      fetch,
      slides,
      title,
      settingsTop,
      settingsBottom,
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

        <VueSlickCarousel v-if="!!slides.length" v-bind="settingsTop" class="py-4">
          <div v-for="productor in slides" :key="productor.name">
            <nuxt-link
              :to="productor.link"
              class="flex bg-white mx-2 p-1 border border-gray-light rounded-sm border-gray-light shadow-elevation"
            >
              <img
                :src="productor.logo.url"
                alt="logo"
                height="120"
                class="m-auto"
              >
            </nuxt-link>
          </div>
        </VueSlickCarousel>
        <VueSlickCarousel v-if="!!slides.length" v-bind="settingsBottom" class="py-4">
          <div v-for="productor in slides" :key="productor.name">
            <nuxt-link
              :to="productor.link"
              class="flex bg-white mx-2 p-1 border border-gray-light rounded-sm border-gray-light shadow-elevation"
            >
              <img
                :src="productor.logo.url"
                alt="logo"
                height="120"
                class="m-auto"
              >
            </nuxt-link>
          </div>
        </VueSlickCarousel>
      </div>
    </ClientOnly>
  </div>
</template>
