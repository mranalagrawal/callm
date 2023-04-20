<script>
// import locales from '../../locales-mapper'

import { onBeforeUnmount, ref, useContext, useFetch, useRouter } from '@nuxtjs/composition-api'
import { generateKey } from '@/utilities/strings'

export default {
  setup() {
    const {
      i18n,
      localeLocation,
      $prismic,
      $sentry,
    } = useContext()
    const router = useRouter()

    // Fixme: carousel is loading all images (mobile and desktop) when loading a desktop website
    const carousel = ref(null)
    const slides = ref([])
    const isDesktop = ref(false)

    const settings = {
      navButtons: false,
      dots: false,
      responsive: [
        {
          breakpoint: 768,
          settings: {
            dots: false,
            navButtons: true,
          },
        },
      ],
    }

    const { fetch } = useFetch(async () => {
      await $prismic.api.getSingle(
        'home-carousel',
        { lang: i18n.localeProperties.iso.toLowerCase() },
      )
        .then(({ data }) => {
          slides.value = data.body[0].items
        })
        .catch((err) => {
          $sentry.captureException(new Error(`Catch getting slides from prismic: ${err}`))
        })
    })

    const handleBreakpoint = ({ breakpoint }) => {
      // Fixme: carousel is leaving alive instances
      // carousel.value?.reload() // carousel.value?.destroy()
      isDesktop.value = breakpoint > 0
    }

    const handleMobileClick = (link) => {
      if (isDesktop.value)
        return

      router.push(localeLocation(link))
    }

    onBeforeUnmount(() => carousel.value.destroy())

    return {
      settings,
      isDesktop,
      fetch,
      carousel,
      slides,
      handleBreakpoint,
      handleMobileClick,
    }
  },
  methods: {
    generateKey,
  },
}
// async fetch() {
//   let lang = locales[this.$i18n.locale]
//
//   if (lang === 'en-gb' && this.$config.STORE === 'CMW')
//     lang = 'en-eu'
//
//   const response = await this.$prismic.api.getSingle('home-carousel', {
//     lang,
//   })
// },
</script>

<template>
  <div class="cmw-relative">
    <agile ref="carousel" :key="`${slides.length}-${isDesktop}`" :options="settings" :dots="false" @breakpoint="handleBreakpoint($event)">
      <div
        v-for="({ text, cta, image, link }) in slides" :key="generateKey(text)" class="slide cmw-relative cmw-w-full cmw-h-[505px] cmw-bg-cover cmw-bg-center cmw-overflow-hidden"
        :style="`backgroundImage: url('${isDesktop ? image.url : image.mobile.url}')`"
        @click="handleMobileClick(link)"
      >
        <div class="cmw-grid cmw-grid-cols-[minmax(16px,_1fr)_minmax(100px,_1332px)_minmax(16px,_1fr)] cmw-justify-stretch cmw-h-full md:cmw-justify-center">
          <div />
          <div class="cmw-grid cmw-grid-rows-2 md:(cmw-w-[min(100%,_30vw)] cmw-justify-center)">
            <NuxtLink
              class="
              cmw-block cmw-pt-8 cmw-w-full cmw-self-start cmw-leading-none cmw-mr-auto cmw-h1 cmw-text-white
              hover:(cmw-text-white cmw-no-underline)
              md:cmw-self-end"
              :to="localePath(link)"
            >
              {{ text }}
            </NuxtLink>
            <Button
              class="cmw-hidden cmw-w-max cmw-self-end cmw-mt-8 cmw-py-2 cmw-text-shadow-none md:(cmw-block cmw-self-start)"
              variant="default-inverse" :to="localePath(link)" :label="cta"
            />
          </div>
          <div />
        </div>
      </div>
      <template #prevButton>
        <div class="cmw-absolute cmw-w-12 cmw-h-12 cmw-bg-white cmw-rounded-sm cmw-flex cmw-left-20 cmw-top-2/5 cmw-translate-y-[-50%]">
          <VueSvgIcon :data="require(`@/assets/svg/chevron-left.svg`)" color="#992545" width="20" height="20" class="cmw-m-auto" />
        </div>
      </template>
      <template #nextButton>
        <div class="cmw-absolute cmw-w-12 cmw-h-12 cmw-bg-white cmw-rounded-sm cmw-flex cmw-right-20 cmw-top-2/5 cmw-translate-y-[-50%]">
          <VueSvgIcon :data="require(`@/assets/svg/chevron-right.svg`)" color="#992545" width="20" height="20" class="cmw-m-auto" />
        </div>
      </template>
    </agile>
    <div class="cmw-absolute cmw-left-0 cmw-bottom-0 cmw-w-full cmw-h-auto">
      <VueSvgIcon
        class="cmw-m-auto"
        :data="isDesktop ? require(`@/assets/svg/carousel-curve-desktop.svg`) : require(`@/assets/svg/carousel-curve-mobile.svg`)"
        width="100%"
        height="auto"
        original
      />
    </div>
  </div>
</template>
