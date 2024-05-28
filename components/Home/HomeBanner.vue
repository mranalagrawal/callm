<script lang="ts">
import type { Ref } from '@nuxtjs/composition-api'
import {
  computed,
  defineComponent,
  inject,
  onBeforeUnmount,
  ref,
  useContext,
  useFetch,
  useRouter,
} from '@nuxtjs/composition-api'
import type { RawLocation } from 'vue-router'

import { useHeroStore } from '~/store/heroStore'

import heroBannerCurveLg from '~/assets/images/hero-banner-curve-lg.png'
import heroBannerCurveSm from '~/assets/images/hero-banner-curve-sm.png'
import carouselCurveDesktop from '~/assets/svg/carousel-curve-desktop.svg'
import carouselCurveMobile from '~/assets/svg/carousel-curve-mobile.svg'
import chevronLeftIcon from '~/assets/svg/chevron-left.svg'
import chevronRightIcon from '~/assets/svg/chevron-right.svg'

import { getMobileOperatingSystem } from '@/utilities/getOS'
import { generateKey } from '@/utilities/strings'

export default defineComponent({
  setup() {
    const {
      req,
      localeRoute,
      $cookies,
    } = useContext()
    const router = useRouter()
    const heroStore = useHeroStore()

    // Fixme: carousel is loading all images (mobile and desktop) when loading a desktop website
    const carousel = ref(null)
    const slides = ref([])
    const OS = ref($cookies.get('iOS'))
    const isBrowser = ref(false)
    const isTablet = inject('isTablet') as Ref<boolean>
    const isDesktopWide = inject('isDesktopWide') as Ref<boolean>
    const hasBeenSet = inject('hasBeenSet') as Ref<boolean>
    const mtdata = ref(heroStore.banners)
    const { fetch } = useFetch(async ({ $cmwRepo }) => {
      const data = await $cmwRepo.prismic.getSingle('home-carousel')
      if (!process.browser) {
        OS.value = getMobileOperatingSystem(req.headers['user-agent'])
        $cookies.set('iOS', getMobileOperatingSystem(req.headers['user-agent']), {
          sameSite: 'none',
          secure: true,
        })
      }

      isBrowser.value = process?.browser
      slides.value = data.body && data.body[0].items
    })

    const handleMobileClick = (link: RawLocation) => {
      if (isTablet.value) {
        return
      }

      router.push(localeRoute(link) as RawLocation)
    }

    const showDesktopImage = computed(() => {
      if (hasBeenSet.value) {
        return isTablet.value
      } else {
        return (!isBrowser.value && !OS.value) || (isBrowser.value && isTablet.value)
      }
    })

    onBeforeUnmount(() => slides.value = [])
    const banners = ref([])
    return {
      OS,
      heroBannerCurveLg,
      heroBannerCurveSm,
      carousel,
      carouselCurveDesktop,
      carouselCurveMobile,
      chevronLeftIcon,
      chevronRightIcon,
      fetch,
      handleMobileClick,
      hasBeenSet,
      isBrowser,
      isDesktopWide,
      isTablet,
      localeRoute,
      showDesktopImage,
      slides,
      banners,
      mtdata,

    }
  },

  methods: {
    generateKey,
  },
})
</script>

<template>
  <!-- <div class="relative h-[505px] bg-primary-50">
    <div v-if="slides.length">
      <SsrCarousel
        ref="carousel" :key="slides.length" loop :show-arrows="isDesktopWide" show-dots
        class="relative h-[505px]"
      >
        <div
          v-for="({ text, cta, image, link }) in slides" :key="generateKey(text)"
          class="slide relative w-full h-[505px] overflow-hidden" @click="handleMobileClick(link)"
        >
          <div class="absolute top-0 left-0 w-full h-full bg-cover bg-center" />
          <PrismicImage
            class="absolute top-0 left-0 w-full h-full object-cover"
            :field="showDesktopImage ? image : image.mobile" :imgix-params="{ sat: -100, dpr: 2 }"
          />
          <div class="absolute top-0 left-0 w-full h-full">
            <picture>
              <source :srcset="heroBannerCurveLg" media="(min-width: 768px)" width="1200" height="500">
              <source :srcset="heroBannerCurveSm" width="800" height="400">
              <img
                :src="heroBannerCurveSm"
                class="c-bannerCurve w-full object-contain object-[0_-50px] md:(object-cover w-4/6 h-full)"
                alt="A geometric shape" width="400" height="400" loading="lazy" decoding="async"
              >
            </picture>
          </div>
          <div class="c-carouselWrapper relative z-base grid justify-stretch h-full md:justify-center">
            <div />
            <div class="grid grid-rows-auto md:(w-[min(100%,_30vw)]) xl:(w-[min(100%,_20vw)] justify-center)">
              <NuxtLink
                class="block w-full self-start leading-none mr-auto h1 !my-1 -dark md:self-end"
                :to="localeRoute(link)"
              >
                {{ text }}
              </NuxtLink>
              <CmwButton
                class="hidden w-max self-end mt-8 text-shadow-none md:(block self-start)"
                variant="default-inverse" :to="localeRoute(link)" :label="cta"
              />
            </div>
            <div />
          </div>
        </div>
        <template #back-arrow>
          <span class="w-12 h-12 bg-white rounded-sm flex">
            <VueSvgIcon :data="chevronLeftIcon" color="#992545" width="20" height="20" class="m-auto" />
          </span>
        </template>
<template #next-arrow>
          <span class="w-12 h-12 bg-white rounded-sm flex">
            <VueSvgIcon :data="chevronRightIcon" color="#992545" width="20" height="20" class="m-auto" />
          </span>
        </template>
</SsrCarousel>
<div class="absolute left-0 bottom-[-2px] w-full h-auto">
  <VueSvgIcon class="m-auto" :data="showDesktopImage
            ? carouselCurveDesktop : carouselCurveMobile" width="100%" height="auto" original />
</div>
</div>
</div> -->

  <div class="relative h-[505px]">
    <div v-if="mtdata && mtdata.length">
      <SsrCarousel ref="carousel" :key="mtdata.length" loop :show-arrows="isDesktopWide" show-dots
        class="relative h-[505px]">
        <!-- Carousel content -->
        <div v-for="banner in mtdata" :key="banner.id" class="slide relative w-full h-[505px] overflow-hidden"
          :style="{ backgroundColor: banner.backgroundColor }" @click="handleMobileClick(banner.link)">
          <div class="banner-container">
            <!-- Image container -->
            <div class="image-container">
              <img :src="banner.image" class="banner-image" :alt="banner.title">
            </div>
            <!-- Content container -->
            <div class="content-container">
              <NuxtLink class="block w-full self-start leading-none mr-auto h1 !my-1 -dark md:self-end"
                :to="localeRoute(banner.link)">
                {{ banner.title }}
              </NuxtLink>
              <NuxtLink class="block w-full self-start leading-none mr-auto h1 !my-1 -dark md:self-end"
                :to="localeRoute(banner.link)">
                {{ banner.text }}
              </NuxtLink>
              <CmwButton v-if="banner.text" class="hidden w-max self-end mt-8 text-shadow-none md:(block self-start)"
    variant="default-inverse" :to="localeRoute(banner.link)" :label="banner.text" />
            </div>
          </div>
          <!-- Carousel content -->
        </div>
        <!-- Carousel navigation arrows -->
        <template #back-arrow>
          <span class="w-12 h-12 bg-white rounded-sm flex">
            <VueSvgIcon :data="chevronLeftIcon" color="#992545" width="20" height="20" class="m-auto" />
          </span>
        </template>
        <template #next-arrow>
          <span class="w-12 h-12 bg-white rounded-sm flex">
            <VueSvgIcon :data="chevronRightIcon" color="#992545" width="20" height="20" class="m-auto" />
          </span>
        </template>
      </SsrCarousel>
    </div>
  </div>
</template>

<!-- <style scoped>
.c-bannerCurve {
  object-position: 0 0;
}

.c-carouselWrapper {
  --max-w: theme('screens.md');
  grid-template-columns: minmax(16px, 1fr) minmax(100px, var(--max-w)) minmax(16px, 1fr);
}

::v-deep(.ssr-carousel-dots) {
  margin-top: 0;
  bottom: 0;
  position: absolute;
  width: 100%;
  z-index: 1;
  transform: translateY(100%);
}

@screen phone {
  .c-bannerCurve {
    object-position: 0 -30px;
  }
}

@screen sm {
  .c-bannerCurve {
    object-position: 0 -100px;
  }
}

@screen md {
  .c-bannerCurve {
    object-position: right;
  }

  ::v-deep(.ssr-carousel-dots) {
    width: 100%;
    bottom: 100px;
    justify-content: end;
    padding-right: 40px;
  }

  ::v-deep(.ssr-carousel-dot-icon) {
    background-color: theme('colors.white');
    border-color: theme('colors.white');
    opacity: 1;
  }

  ::v-deep([aria-disabled] .ssr-carousel-dot-icon) {
    background-color: theme('colors.primary.400');
    border-color: theme('colors.primary.400');
    opacity: 1;
  }
}

@screen lg {
  .c-carouselWrapper {
    --max-w: theme('screens.lg');
  }
}

@screen desktop-wide {
  ::v-deep(.ssr-carousel-back-button) {
    left: 6%;
  }

  ::v-deep(.ssr-carousel-next-button) {
    right: 6%;
  }
}

@screen xl {
  .c-carouselWrapper {
    --max-w: theme('screens.desktop');
  }

  ::v-deep(.ssr-carousel-dots) {
    width: 100%;
    bottom: 100px;
    justify-content: end;
    padding-right: 40px;
  }

}

@screen desktop-wider {
  ::v-deep(.ssr-carousel-back-button) {
    left: 8%;
  }

  ::v-deep(.ssr-carousel-next-button) {
    right: 8%;
  }
}
</style> -->
<style scoped>
.banner-container {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
}

.content-container {
  order: 2;
  margin-top: 2vmax;
}

.image-container {
  order: 1;
  margin-top: 3.2vmax;
  width: 50%;
  height: 32vmax;
  overflow: hidden;
}

.banner-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.cta-button {
  margin-top: 1rem;
}

@media (max-width: 768px) {
  .banner-container {
    flex-direction: column;
  }

  .content-container {
    order: 1;
  }

  .image-container {
    order: 2;
    width: 100%;
    height: 100%;
  }

  .banner-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .cta-button {
    display: none;
  }
}
</style>
