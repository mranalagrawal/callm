<script>
import { computed, nextTick, onMounted, onUnmounted, ref, useContext, useFetch, useRoute } from '@nuxtjs/composition-api'
import debounce from 'lodash.debounce'
import getArticles from '~/graphql/queries/getArticles'
import { inRange } from '~/utilities/math'
import { stripHtmlAnchors } from '~/utilities/strings'

export default {
  layout(context) {
    return context.$config.STORE
  },
  setup() {
    const { $graphql, i18n } = useContext()
    const route = useRoute()
    const isDesktop = ref(false)
    const partnerC1 = ref(null)
    const partnerC2 = ref(null)
    const c1 = ref(null)
    const c2 = ref(null)
    const brand = ref({
      title: '',
      contentHtml: '',
      image: {
        url: '',
      },
    })
    const metaFields = ref({
      subtitle: '',
      images: [],
      isPartner: false,
    })

    const { fetch } = useFetch(async () => {
      const { articles } = await $graphql.default.request(getArticles, {
        lang: i18n.locale.toUpperCase(),
        first: 1,
        query: `tag:${route.value.path.split('-').at(-1)}`, // route.value.params.handle,
      })

      if (articles.nodes[0]) {
        brand.value = articles.nodes[0]
        metaFields.value = articles.nodes[0].details && JSON.parse(articles.nodes[0].details.value)
      }
    })

    const currentC1Slide = computed(() => c1.value && c1.value.$refs.innerSlider.currentSlide)
    const resizeListener = debounce(() => {
      isDesktop.value = window.innerWidth > 991
    }, 400)

    onMounted(() => {
      // Todo: Move this to a global composable when we implement VueUse
      window.addEventListener('resize', resizeListener)
      nextTick(() => {
        resizeListener()
      })
    })

    onUnmounted(() => {
      window.removeEventListener('resize', resizeListener)
    })

    return {
      isDesktop,
      brand,
      fetch,
      metaFields,
      partnerC1,
      partnerC2,
      c1,
      c2,
      currentC1Slide,
      inRange,
      stripHtmlAnchors,
    }
  },
}
</script>

<template>
  <div class="">
    <p v-if="$fetchState.pending" class="cmw-max-w-screen-xl cmw-mx-auto cmw-p-4">
      {{ $t("loading") }}
    </p>
    <template v-else>
      <div v-if="metaFields && brand.title">
        <div v-if="metaFields.isPartner" class="container-fluid px-0 cmw-relative">
          <img
            class="cmw-absolute cmw-top-0 cmw-left-0 cmw-w-full cmw-h-500px"
            src="@/assets/images/bg-wave.png" alt="image"
          >
          <div class="cmw-relative cmw-max-w-screen-xl cmw-mx-auto cmw-py-4 md:cmw-px-4">
            <div class="cmw-px-4 lg:cmw-px-3 ">
              <div class="c-ribbon cmw-flex cmw-items-center cmw-text-secondary cmw-mt-4">
                <VueSvgIcon class="c-ribbon__left" :data="require(`@/assets/svg/ribbon.svg`)" width="9" height="24" />
                <span
                  class="c-ribbon__content cmw-h-6 cmw-flex cmw-gap-1 cmw-items-center cmw-bg-secondary cmw-text-white cmw-px-2"
                >
                  <VueSvgIcon :data="require(`@/assets/svg/feature-cmw-favourite.svg`)" width="18" height="18" />
                  <span class="cmw-text-xs cmw-leading-normal">{{ $t('product.recommendedByCallmewine') }}</span>
                </span>
                <VueSvgIcon class="c-ribbon__right" :data="require(`@/assets/svg/ribbon.svg`)" width="9" height="24" />
              </div>
              <h1 v-if="brand" class="cmw-text-white" v-text="brand.title" />
              <div class="cmw-h4 cmw-my-4 cmw-text-white" v-text="metaFields.subtitle" />
            </div>
            <ClientOnly v-if="!!metaFields.images.length">
              <VueSlickCarousel
                ref="partnerC1"
                class="lg:cmw-pr-3"
                :as-nav-for="partnerC2"
                :focus-on-select="true"
                :dots="!isDesktop"
                dots-class="c-carouselDots"
              >
                <div
                  v-for="image in metaFields.images" :key="image"
                  class="lg:cmw-pl-3 cmw-w-full cmw-flex cmw-h-[410px]"
                >
                  <img
                    class="
                cmw-object-cover cmw-object-center cmw-select-none cmw-pointer-events-none
                cmw-flex md:cmw-rounded-sm cmw-w-full cmw-h-full cmw-overflow-hidden"
                    :src="image" :alt="image"
                  >
                </div>
                <template #customPaging="page">
                  <button
                    class="c-carouselDots__dot"
                    :class="{ '-sm': !inRange((page - currentC1Slide), -2, 2) }"
                  />
                </template>
              </VueSlickCarousel>
              <div v-if="metaFields.images.length > 1 && isDesktop" class="my-4">
                <VueSlickCarousel
                  ref="partnerC2"
                  class="lg:cmw-pr-3"
                  :as-nav-for="partnerC1"
                  :slides-to-show="5.5"
                  :infinite="false"
                  :focus-on-select="true"
                >
                  <div
                    v-for="image in metaFields.images" :key="`thumb-${image}`"
                    class="cmw-px-3 cmw-h-full cmw-flex"
                  >
                    <img
                      class="cmw-select-none cmw-pointer-events-none cmw-flex cmw-rounded-sm cmw-h-full cmw-overflow-hidden"
                      :src="image" :alt="image"
                    >
                  </div>
                  <template #prevArrow>
                    <div class="custom-arrow cmw-bg-white cmw-rounded-sm cmw-text-primary-400 cmw-flex">
                      <VueSvgIcon :data="require(`@/assets/svg/chevron-left.svg`)" width="20" height="20" />
                    </div>
                  </template>
                  <template #nextArrow>
                    <div class="custom-arrow cmw-bg-white cmw-rounded-sm cmw-text-primary-400 cmw-flex">
                      <VueSvgIcon :data="require(`@/assets/svg/chevron-right.svg`)" width="20" height="20" />
                    </div>
                  </template>
                </VueSlickCarousel>
              </div>
            </ClientOnly>
            <div class="cmw-px-4 md:(cmw-grid cmw-gap-4 cmw-grid-cols-[minmax(auto,_60%)_minmax(auto,_40%)])">
              <BrandInfo v-if="metaFields" :meta-fields="metaFields" />
              <CountryMap
                v-if="metaFields && isDesktop" :logo="brand.image && brand.image.url || ''" :country="metaFields.country"
                :region="metaFields.region"
              />
            </div>
            <div class="cmw-px-4 md:cmw-order-3" v-html="stripHtmlAnchors(brand.contentHtml)" />
          </div>
        </div>
        <div v-else class="cmw-max-w-screen-xl cmw-mx-auto cmw-py-4">
          <h1 v-if="brand" class="cmw-px-4 cmw-text-secondary" v-text="brand.title" />
          <div class="cmw-px-4 cmw-h4 cmw-my-4 cmw-text-secondary" v-text="metaFields.subtitle" />
          <div class="md:(cmw-grid cmw-gap-4 cmw-grid-cols-[minmax(auto,_60%)_minmax(auto,_40%)])">
            <div>
              <ClientOnly v-if="!!metaFields.images.length">
                <VueSlickCarousel
                  ref="c1"
                  :as-nav-for="c2"
                  :focus-on-select="true"
                  :dots="!isDesktop"
                  dots-class="c-carouselDots"
                >
                  <div
                    v-for="image in metaFields.images" :key="image"
                    class="lg:cmw-pl-3 cmw-h-full cmw-flex"
                  >
                    <img
                      class="cmw-select-none cmw-pointer-events-none cmw-flex md:cmw-rounded-sm cmw-h-full cmw-overflow-hidden"
                      :src="image" :alt="image"
                    >
                  </div>
                  <template #customPaging="page">
                    <button
                      class="c-carouselDots__dot"
                      :class="{ '-sm': !inRange((page - currentC1Slide), -2, 2) }"
                    />
                  </template>
                </VueSlickCarousel>
                <div v-if="metaFields.images.length > 1 && isDesktop" class="my-4">
                  <VueSlickCarousel
                    ref="c2"
                    :as-nav-for="c1"
                    :slides-to-show="3.5"
                    :infinite="false"
                    :focus-on-select="true"
                  >
                    <div
                      v-for="image in metaFields.images" :key="`thumb-${image}`"
                      class="cmw-px-3 cmw-h-full cmw-flex"
                    >
                      <img
                        class="cmw-select-none cmw-pointer-events-none cmw-flex cmw-rounded-sm cmw-h-full cmw-overflow-hidden"
                        :src="image" :alt="image"
                      >
                    </div>
                    <template #prevArrow>
                      <div class="custom-arrow cmw-bg-white cmw-rounded-sm cmw-text-primary-400 cmw-flex">
                        <VueSvgIcon :data="require(`@/assets/svg/chevron-left.svg`)" width="20" height="20" />
                      </div>
                    </template>
                    <template #nextArrow>
                      <div class="custom-arrow cmw-bg-white cmw-rounded-sm cmw-text-primary-400 cmw-flex">
                        <VueSvgIcon :data="require(`@/assets/svg/chevron-right.svg`)" width="20" height="20" />
                      </div>
                    </template>
                  </VueSlickCarousel>
                </div>
              </ClientOnly>
              <div v-if="isDesktop" class="md:cmw-order-3" v-html="stripHtmlAnchors(brand.contentHtml)" />
            </div>
            <div class="cmw-px-4">
              <BrandInfo v-if="metaFields" :meta-fields="metaFields" />
              <CountryMap
                v-if="metaFields && isDesktop" :logo="brand.image && brand.image.url || ''" :country="metaFields.country"
                :region="metaFields.region"
              />
            </div>
            <div v-if="brand && brand.image && brand.image.url" class="md:cmw-order-4">
              <!-- Note: on Nuxt 3 we could use Teleport o this component instead of having duplicates -->
              <CountryMap
                v-if="metaFields && !isDesktop" :logo="brand.image && brand.image.url || ''" :country="metaFields.country"
                :region="metaFields.region"
              />
            </div>
            <div v-if="!isDesktop" class="cmw-px-4 md:cmw-order-3" v-html="stripHtmlAnchors(brand.contentHtml)" />
          </div>
          <div v-if="brand && brand.title">
            <VendorProductsInBrand :vendor="brand.title" />
          </div>
        </div>
      </div>
      <div v-else class="cmw-max-w-screen-xl cmw-mx-auto cmw-p-4 cmw-text-center">
        <div v-text="$t('search.noResultsAlert')" />
        <NuxtLink class="cmw-text-primary-400 hover:(cmw-text-primary-400 cmw-no-underline)" :to="localePath('winery')">
          {{ $t('search.noBrands') }}
        </NuxtLink>
      </div>
    </template>
  </div>
</template>

<style scoped>
.c-ribbon {
  display: flex;
  justify-self: stretch;
  gap: 0;
}

.c-ribbon__right {
  transform: scaleX(-1);
}

::v-deep(.custom-arrow.slick-prev), ::v-deep(.custom-arrow.slick-next) {
  display: flex;
  width: 38px;
  height: 38px;
  background-color: white;
  color: theme('colors.primary.400');
  z-index: 1;
}

::v-deep(.custom-arrow.slick-prev) {
  left: 20px;
}

::v-deep(.custom-arrow.slick-next) {
  right: 20px;
}

::v-deep(.custom-arrow svg) {
  margin: auto;
}

::v-deep(.slick-prev:before), ::v-deep(.slick-next:before) {
  content: '';
}

::v-deep(.slick-slide > div > div) {
  display: flex !important;
}

::v-deep(.c-carouselDots) {
  display: flex !important;
  gap: 0.5rem;
  justify-content: center;
  align-items: center;
  margin: 1rem auto;
}

::v-deep(.c-carouselDots li) {
  display: flex !important;
}

::v-deep(.c-carouselDots__dot) {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: theme('colors.primary.100');
  transform: scale(0.5);
  transition: transform 300ms ease-in-out;
}

::v-deep(.slick-active .c-carouselDots__dot) {
  transform: scale(1);
  background-color: theme('colors.primary.DEFAULT');
}

::v-deep(.c-carouselDots__dot.-sm) {
  transform: scale(0.3);
}
</style>
