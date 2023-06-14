<script lang="ts">
import { defineComponent, ref, useFetch } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    const slides = ref([])
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

    const { fetch } = useFetch(async ({
      $cmwRepo,
      $handleApiErrors,
    }) => {
      await $cmwRepo.prismic.getSingle({ page: 'productors' })
        .then(({ data }) => {
          const {
            productor,
            label,
          } = data
          slides.value = productor.concat(productor)
          title.value = label
        })
        .catch((err: Error) => $handleApiErrors(`Catch getting home producers slides from prismic: ${err}`))
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
  <div class="cmw-my-5 cmw-bg-gray-lightest">
    <ClientOnly>
      <div class="cmw-py-5">
        <!-- <PrismicText v-if="title" class="cmw-text-center" :field="title" /> -->
        <h2 class="cmw-text-center" v-text="title" />

        <VueSlickCarousel v-if="!!slides.length" v-bind="settingsTop" class="cmw-py-4">
          <div v-for="productor in slides" :key="productor.name">
            <nuxt-link
              :to="productor.link"
              class="cmw-flex cmw-bg-white cmw-mx-2 cmw-p-1 cmw-border cmw-border-gray-light cmw-rounded-sm cmw-border-gray-light cmw-shadow-elevation"
            >
              <img
                :src="productor.logo.url"
                alt="logo"
                height="120"
                class="cmw-m-auto"
              >
            </nuxt-link>
          </div>
        </VueSlickCarousel>
        <VueSlickCarousel v-if="!!slides.length" v-bind="settingsBottom" class="cmw-py-4">
          <div v-for="productor in slides" :key="productor.name">
            <nuxt-link
              :to="productor.link"
              class="cmw-flex cmw-bg-white cmw-mx-2 cmw-p-1 cmw-border cmw-border-gray-light cmw-rounded-sm cmw-border-gray-light cmw-shadow-elevation"
            >
              <img
                :src="productor.logo.url"
                alt="logo"
                height="120"
                class="cmw-m-auto"
              >
            </nuxt-link>
          </div>
        </VueSlickCarousel>
      </div>
    </ClientOnly>
  </div>
</template>
