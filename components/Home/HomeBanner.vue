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
import { getMobileOperatingSystem } from '@/utilities/getOS'
import { generateKey } from '@/utilities/strings'
import prismicConfig from '~/config/prismicConfig'
import type { TStores } from '~/config/themeConfig'

export default defineComponent({
  setup() {
    const {
      req,
      localeLocation,
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

    const { fetch } = useFetch(async ({ $config, $cmwRepo, $handleApiErrors }) => {
      await $cmwRepo.prismic.getSingle({ page: prismicConfig[$config.STORE as TStores]?.components.homeCarousel })
        .then(({ data }) => {
          if (!process.browser) {
            OS.value = getMobileOperatingSystem(req.headers['user-agent'])
            $cookies.set('iOS', getMobileOperatingSystem(req.headers['user-agent']))
          }

          isBrowser.value = process?.browser
          slides.value = data.body[0].items
        })
        .catch((err: Error) => $handleApiErrors(`Catch getting slides from prismic: ${err}`))
    })

    const handleMobileClick = (link: RawLocation) => {
      if (isTablet.value)
        return

      router.push(localeLocation(link) as RawLocation)
    }

    const showDesktopImage = computed(() => {
      if (hasBeenSet.value)
        return isTablet.value
      else
        return (!isBrowser.value && !OS.value) || (isBrowser.value && isTablet.value)
    })
    onBeforeUnmount(() => slides.value = [])

    return {
      showDesktopImage,
      isTablet,
      isDesktopWide,
      hasBeenSet,
      OS,
      isBrowser,
      fetch,
      carousel,
      slides,
      chevronLeftIcon,
      chevronRightIcon,
      carouselCurveDesktop,
      carouselCurveMobile,
      handleMobileClick,
    }
  },
  methods: {
    generateKey,
  },
})
</script>

<template>
  <div v-if="slides.length" class="cmw-relative">
    <SsrCarousel ref="carousel" :key="slides.length" :show-arrows="isDesktopWide" show-dots class="cmw-relative">
      <div
        v-for="({ text, cta, image, link }) in slides" :key="generateKey(text)" class="slide cmw-relative cmw-w-full cmw-h-[505px] cmw-overflow-hidden"
        @click="handleMobileClick(link)"
      >
        <div
          class="cmw-absolute cmw-top-0 cmw-left-0 cmw-w-full cmw-h-full cmw-bg-cover cmw-bg-center"
          :style="`backgroundImage: url('${showDesktopImage ? image.url : image.mobile.url}')`"
        />
        <div
          class="c-carouselWrapper cmw-relative cmw-z-base cmw-grid cmw-justify-stretch cmw-h-full md:cmw-justify-center"
        >
          <div />
          <div class="cmw-grid cmw-grid-rows-2 md:(cmw-w-[min(100%,_30vw)]) xl:(cmw-w-[min(100%,_20vw)] cmw-justify-center)">
            <NuxtLink
              class="
              cmw-block cmw-pt-8 cmw-w-full cmw-self-start cmw-leading-none cmw-mr-auto cmw-h1 cmw-text-white
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
      <template #back-arrow>
        <span class="cmw-absolute cmw-w-12 cmw-h-12 cmw-bg-white cmw-rounded-sm cmw-flex cmw-left-20 cmw-top-2/5 cmw-translate-y-[-50%]">
          <VueSvgIcon :data="chevronLeftIcon" color="#992545" width="20" height="20" class="cmw-m-auto" />
        </span>
      </template>
      <template #next-arrow>
        <span class="cmw-absolute cmw-w-12 cmw-h-12 cmw-bg-white cmw-rounded-sm cmw-flex cmw-right-20 cmw-top-2/5 cmw-translate-y-[-50%]">
          <VueSvgIcon :data="chevronRightIcon" color="#992545" width="20" height="20" class="cmw-m-auto" />
        </span>
      </template>
    </SsrCarousel>
    <div class="cmw-absolute cmw-left-0 cmw-bottom-[-2px] cmw-w-full cmw-h-auto">
      <VueSvgIcon
        class="cmw-m-auto"
        :data="showDesktopImage
          ? carouselCurveDesktop : carouselCurveMobile"
        width="100%"
        height="auto"
        original
      />
    </div>
  </div>
</template>

<style scoped>
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

@screen md {
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
    left: -2%;
  }

  ::v-deep(.ssr-carousel-next-button) {
    right: -2%;
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
    left: 5%;
  }

  ::v-deep(.ssr-carousel-next-button) {
    right: 5%;
  }
}
</style>
