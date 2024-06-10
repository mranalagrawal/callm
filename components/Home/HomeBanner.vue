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

import heroBannerCurveLg from '~/assets/images/hero-banner-curve-lg.png'
import heroBannerCurveSm from '~/assets/images/hero-banner-curve-sm.png'
import carouselCurveDesktop from '~/assets/svg/carousel-curve-desktop.svg'
import carouselCurveMobile from '~/assets/svg/carousel-curve-mobile.svg'
import chevronLeftIcon from '~/assets/svg/chevron-left.svg'
import chevronRightIcon from '~/assets/svg/chevron-right.svg'

import { getMobileOperatingSystem } from '@/utilities/getOS'
import { generateKey } from '@/utilities/strings'
import getHomeHero from '~/graphql/queries/getHomeHero.graphql'

export default defineComponent({
  setup() {
    const {
      req,
      localeRoute,
      $cookies,
      $graphql,
      i18n,

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
  
    const { fetch } = useFetch(async () => {
      if (!process.browser) {
        OS.value = getMobileOperatingSystem(req.headers['user-agent'])
        $cookies.set('iOS', getMobileOperatingSystem(req.headers['user-agent']), {
          sameSite: 'none',
          secure: true,
        })
      }

      isBrowser.value = process?.browser
      // slides.value = data.body && data.body[0].items
    })
    interface BannerData {
      id: any
      backgroundColor: string
      image: string
      link: string
      text: string
      title: string
      buttontext: string
    }
    const homeBannerData = ref<BannerData[]>([])
    const isDataLoaded = ref(false)
    const HomeBannerCarousel = async () => {
      try {
        const banners: BannerData[] = [];

        // GraphQL request to fetch the hero data
        const { metaobject } = await $graphql.default.request(
          getHomeHero,
          {
            lang: i18n.locale.toUpperCase(),
            handle: {
              handle: "home",
              type: "home"
            },
            first: 10
          }
        );
        // Check if the data exists and has the necessary structure
        if (metaobject && metaobject.hero && metaobject.hero.references) {
          // Find the hero named "Current Hero"
          const currentHero = metaobject.hero.references.nodes.find((hero: any) => hero.name.value === "Current Hero");

          // If the "Current Hero" is found, process its banner carousel data
          if (currentHero && currentHero.banner_carousel && currentHero.banner_carousel.references) {
            currentHero.banner_carousel.references.nodes.forEach((banner: any) => {
              const backgroundColor = banner.backgroundColor?.value || '';
              const imageUrl = banner.image?.reference?.image?.url || '';
              const link = banner.link?.value || '';
              const buttontext = banner.buttonText?.value || '';
              const title = banner.title?.value || '';
              const text = banner.text.value || ""
              const bannerData = {
                id: banner.id,
                backgroundColor,
                image: imageUrl,
                link,
                text, // Assuming the text field does not exist in the provided data structure
                title,
                buttontext
              };

              banners.push(bannerData);
            });
          }
        }

        // Update the component state with the fetched banners
        homeBannerData.value = banners;
        isDataLoaded.value = true;
      } catch (error) {
        console.error('Error HomeBannerCarousel fetching data:', error);
      }
    };
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
    const init = async () => {
      await HomeBannerCarousel()
    }

    init()

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
      homeBannerData,
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
    <div v-if="homeBannerData && homeBannerData?.length">
      <SsrCarousel ref="carousel" :key="homeBannerData?.length" loop :show-arrows="isDesktopWide" show-dots
        class="relative h-[505px]">
        <!-- Carousel content -->
        <div v-for="banner in homeBannerData" :key="banner.id" class="slide  relative w-full h-[505px] overflow-hidden"
          :style="{ backgroundColor: banner.backgroundColor }" @click="handleMobileClick(banner.link)">
          <div
            class="banner-container max-w-screen-xl mx-auto grid grid-cols-1 gap-0 min-h-100px items-center lg:grid-cols-[25%_40%_35%] lg:gap-3 lg:pt-4 2xl:grid-cols-[25%_48%_32%] ">
            <!-- Image container -->
            <div class="image-container">
              <img :src="banner.image" class="banner-image" :alt="banner.title">
            </div>
            <div class="content-container">
              <NuxtLink class="block w-full self-start leading-none mr-auto h1 !my-1 -dark md:self-end title"
                :to="localeRoute(banner.link)">
                {{ banner.title }}
              </NuxtLink>

              <NuxtLink class="block w-full self-start leading-none mr-auto h1 fw !my-1 -dark md:self-end text"
                :to="localeRoute(banner.link)">
                {{ banner.text }}
              </NuxtLink>
              <CmwButton v-if="banner.buttontext"
                class="hidden w-max self-end mt-8 text-shadow-none md:(block self-start) mb-4 cta-button"
                variant="default-inverse" :to="localeRoute(banner.link)" :label="banner.buttontext" />
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
  gap: 2vmax;
  align-items: flex-end;
  height: 100%;
  padding: 1rem 1em 0 1em;
}

.content-container {
  margin-top: 2vmax;
  width: 50%;
  margin-left: 4vmax;
  align-self: center !important;
}

.image-container {
  width: 70vw;
  height: 32vmax;
  margin-left: 2vw;
}

.banner-image {
  width: 100%;
  height: 100%;

}

.title {
  font-size: 1.5rem;
}

.text {
  opacity: 0.8;
  margin-bottom: 3.1rem !important;
  font-size: 1.5rem;
}

.cta-button {
  margin-bottom: 3rem !important;
}


@media(max-width:1240px) {
  .text {
    /* margin-bottom: 2.5rem; */
    font-size: 1.5em;


  }

  .title {
    font-size: 2em;
  }

  .image-container {
    width: 50vw;
    height: 40vmax;
    margin-left: 2vw;
  }

}

@media(max-width:960px) {

  .title,
  .text {
    font-size: 1.5em;
  }


}

@media (max-width: 768px) {
  .banner-container {
    flex-direction: column-reverse;
    padding: 0;
    padding-left: 5vw;
    gap: 0;

  }

  .content-container {
    width: 95%;
    margin: 0;
    height: 25%;
  }

  .image-container {
    width: 100%;
    height: 68%;
  }

  .text {
    font-weight: normal !important;

  }



  .cta-button {
    display: none;
  }
}
</style>
