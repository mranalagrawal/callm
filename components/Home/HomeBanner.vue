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
import chevronLeftIcon from 'assets/svg/chevron-left.svg'
import chevronRightIcon from 'assets/svg/chevron-right.svg'
import carouselCurveDesktop from 'assets/svg/carousel-curve-desktop.svg'
import carouselCurveMobile from 'assets/svg/carousel-curve-mobile.svg'
import heroBannerCurveLg from '~/assets/images/hero-banner-curve-lg.png'
import heroBannerCurveSm from '~/assets/images/hero-banner-curve-sm.png'
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

    // Fixme: carousel is loading all images (mobile and desktop) when loading a desktop website
    const carousel = ref(null)
    const slides = ref([])
    const OS = ref($cookies.get('iOS'))
    const isBrowser = ref(false)
    const isTablet = inject('isTablet') as Ref<boolean>
    const isDesktopWide = inject('isDesktopWide') as Ref<boolean>
    const hasBeenSet = inject('hasBeenSet') as Ref<boolean>

    const { fetch } = useFetch(async ({ $cmwRepo }) => {
      const data = await $cmwRepo.prismic.getSingle('home-carousel')
      if (!process.browser) {
        OS.value = getMobileOperatingSystem(req.headers['user-agent'])
        $cookies.set('iOS', getMobileOperatingSystem(req.headers['user-agent']), {
          sameSite: 'lax',
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
    }
  },
  methods: {
    generateKey,
  },
})
</script>

<template>
  <div class="relative h-[505px] bg-primary-50">
    <div v-if="slides.length">
      <SsrCarousel
        ref="carousel" :key="slides.length" loop :show-arrows="isDesktopWide" show-dots
        class="relative h-[505px]"
      >
        <div
          v-for="({ text, cta, image, link }) in slides" :key="generateKey(text)"
          class="slide relative w-full h-[505px] overflow-hidden"
          @click="handleMobileClick(link)"
        >
          <div
            class="absolute top-0 left-0 w-full h-full bg-cover bg-center"
          />
          <PrismicImage
            class="absolute top-0 left-0 w-full h-full object-cover"
            :field="showDesktopImage ? image : image.mobile"
            :imgix-params="{ sat: -100, dpr: 2 }"
          />
          <div class="absolute top-0 left-0 w-full h-full">
            <picture>
              <source :srcset="heroBannerCurveLg" media="(min-width: 768px)" width="1200" height="500">
              <source :srcset="heroBannerCurveSm" width="800" height="400">
              <img
                :src="heroBannerCurveSm"
                class="c-bannerCurve w-full object-contain object-[0_-50px] md:(object-cover w-4/6 h-full)"
                alt="A geometric shape"
                width="400"
                height="400"
                loading="lazy"
                decoding="async"
              >
            </picture>
          </div>
          <div
            class="c-carouselWrapper relative z-base grid justify-stretch h-full md:justify-center"
          >
            <div />
            <div class="grid grid-rows-2 md:(w-[min(100%,_30vw)]) xl:(w-[min(100%,_20vw)] justify-center)">
              <NuxtLink
                class="block pt-8 w-full self-start leading-none mr-auto h1 -dark md:self-end"
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
        <VueSvgIcon
          class="m-auto"
          :data="showDesktopImage
            ? carouselCurveDesktop : carouselCurveMobile"
          width="100%"
          height="auto"
          original
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.c-bannerCurve {
  object-position: 0 10px;
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
</style>
