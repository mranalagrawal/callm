<script lang="ts">
import {
  computed,
  defineComponent,
  inject,
  nextTick,
  onMounted,
  ref,
  useContext,
  useFetch,
  useMeta,
  useRoute,
} from '@nuxtjs/composition-api'

import chevronLeftIcon from '~/assets/svg/chevron-left.svg'
import chevronRightIcon from '~/assets/svg/chevron-right.svg'
import cmwFavouriteIcon from '~/assets/svg/feature-cmw-favourite.svg'
import ribbon from '~/assets/svg/ribbon.svg'

import getArticles from '~/graphql/queries/getArticles.graphql'
import type { ILocales } from '~/types/baseItem'
import type { IGraphQLArticlesResponse, IWineryShopify } from '~/types/winery/winery-backe-end-shopify'
import type { IWineryMapped } from '~/types/winery/winery-front-end'
import { generateHeadHreflang } from '~/utilities/arrays'
import { inRange } from '~/utilities/math'
import { generateKey, stripHtmlAnchors } from '~/utilities/strings'

interface IMetaFields {
  country: string
  feId: string
  hrefLang: {}
  images: never[]
  isPartner: boolean
  key: string
  region: string
  subtitle: ILocales
}

export default defineComponent({
  setup() {
    const { i18n, redirect, $cmwGtmUtils, localePath, req } = useContext()
    const route = useRoute()
    const isDesktop = inject('isDesktop')
    const partnerC1 = ref(null)
    const partnerC2 = ref(null)
    const c1 = ref<any>(null)
    const c2 = ref<any>(null)
    const winery = ref<Maybe<IWineryMapped>>(null)
    const metaFields = ref<IMetaFields>({
      hrefLang: {},
      images: [],
      isPartner: false,
      feId: '',
      key: '',
      subtitle: {
        de: '',
        en: '',
        fr: '',
        it: '',
      },
      country: '',
      region: '',
    })

    const canonicalUrl = ref('')
    const brandProductsRef = ref<Maybe<HTMLElement>>(null)
    const query = computed(() => {
      const pathParts = route.value?.path.split('-')
      if (!pathParts) { return }

      return `tag:${pathParts.at(-1)?.replace('.htm', '') ?? ''}`
    })

    if (process.server && req?.headers && req?.url) {
      const urlSearchParams = new URLSearchParams(req.url.slice(req.url.indexOf('?')))

      urlSearchParams.delete('page')

      const encodedPath = req?.url.split('?')[0] || ''

      canonicalUrl.value = `https://${req.headers.host}${encodedPath}`
    }

    if (process.client && typeof window !== 'undefined') {
      const {
        origin,
        pathname,
        search,
      } = window.location

      const urlSearchParams = new URLSearchParams(search)
      urlSearchParams.delete('page')

      const encodedPath = pathname || ''
      canonicalUrl.value = `${origin}${encodedPath}`
    }

    const getWineryMapped = (iWineryShopify: IWineryShopify): IWineryMapped => {
      const details = iWineryShopify.details?.value ? JSON.parse(iWineryShopify.details.value) : {}

      return {
        masterDistiller: details.masterDistiller,
        annualProduction: details.annualProduction,
        hectares: details.hectares,
        oenologist: details.oenologist,
        ownedGrapes: details.ownedGrapes,
        year: details.year,
        address: {
          country: details.country,
          formattedAddress: details.address,
          region: details.region,
          zone: details.listingText?.[i18n.locale] || '',
        },
        description: '',
        descriptionHtml: iWineryShopify.contentHtml,
        handle: iWineryShopify.handle,
        id: iWineryShopify.id,
        featureImage: {
          url: iWineryShopify.image.url,
          altText: iWineryShopify.image.altText,
        },
        images: details.images.map((image: string[]) => ({
          url: image,
          altText: iWineryShopify.title,
        })),
        isPartner: details.isPartner,
        logo: { ...iWineryShopify.image },
        name: '',
        quote: details.quote || '',
        seo: {
          description: iWineryShopify.seo.description,
          title: iWineryShopify.seo.title,
        },
        subtitle: details.subtitle[i18n.locale],
        title: iWineryShopify.title,
      }
    }
    const { fetch } = useFetch(async ({ $graphql }) => {
      const { articles }: IGraphQLArticlesResponse = await $graphql.default.request(getArticles, {
        lang: i18n.locale.toUpperCase(),
        first: 1,
        query: query.value,
      })

      if (articles.nodes.length) {
        winery.value = getWineryMapped(articles.nodes[0])
        metaFields.value = articles.nodes[0].details && JSON.parse(articles.nodes[0].details.value) as IMetaFields

        if (route.value.params.handle !== `${winery.value?.handle}-${metaFields.value.key}.htm`) { return redirect(301, localePath({ name: 'winery-handle', params: { handle: `${winery.value?.handle.trim()}-${metaFields.value?.key}.htm` } })) }
      }
    })

    const currentC1Slide = computed(() => c1.value && c1.value.$refs.innerSlider.currentSlide)

    // Create a computed that checks if the current route has a query params marketing and its value equals 1
    const isMarketing = computed(() => route.value.query.marketing === '1')

    onMounted(() => {
      process.browser && $cmwGtmUtils.pushPage('page')
      nextTick(() => {
        if (route.value?.hash && typeof window !== 'undefined') {
          const element = brandProductsRef.value
          if (!element || !(element instanceof HTMLElement)) {
            return
          }

          setTimeout(() => {
            const menuHeight = window.innerWidth > 992 ? 170 : 135
            const top = element.offsetTop - menuHeight
            window.scrollTo({ top, behavior: 'smooth' })
          }, 1200)
        }
      })
    })

    useMeta(() => ({
      title: winery.value?.seo?.title || '',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: winery.value?.seo?.description || '',
        },
      ],
      link: [
        ...generateHeadHreflang(metaFields.value.hrefLang),
        {
          rel: 'canonical',
          href: canonicalUrl.value,
        }],
    }))

    return {
      brandProductsRef,
      c1,
      c2,
      canonicalUrl,
      chevronLeftIcon,
      chevronRightIcon,
      cmwFavouriteIcon,
      currentC1Slide,
      fetch,
      isDesktop,
      isMarketing,
      metaFields,
      partnerC1,
      partnerC2,
      ribbon,
      stripHtmlAnchors,
      winery,
    }
  },
  head: {},
  methods: { generateKey, inRange },
})
</script>

<template>
  <div class="">
    <p v-if="$fetchState.pending" class="max-w-screen-xl mx-auto p-4">
      {{ $t("loading") }}
    </p>
    <template v-else>
      <div v-if="winery?.title">
        <div v-if="winery.isPartner && !isMarketing" class="relative">
          <img
            class="absolute top-0 left-0 w-full h-500px"
            src="@/assets/images/bg-wave.png" alt="image"
          >
          <div class="relative max-w-screen-xl mx-auto py-4 md:px-4">
            <div class="px-4 lg:px-3">
              <div class="c-ribbon flex items-center text-secondary mt-4">
                <VueSvgIcon class="c-ribbon__left" :data="ribbon" width="9" height="24" />
                <span
                  class="c-ribbon__content h-6 flex gap-1 items-center bg-secondary text-white px-2"
                >
                  <VueSvgIcon :data="cmwFavouriteIcon" width="18" height="18" />
                  <span class="text-xs leading-normal" v-text="$t('product.recommendedByCallmewine')" />
                </span>
                <VueSvgIcon class="c-ribbon__right" :data="ribbon" width="9" height="24" />
              </div>
              <h1 v-if="winery" class="text-white" v-text="winery.title" />
              <div class="h4 my-4 !text-white" v-text="winery.subtitle" />
            </div>
            <div class="w-[min(100%,_58rem)] m-inline-auto">
              <ClientOnly v-if="!!winery.images.length">
                <VueSlickCarousel
                  ref="partnerC1"
                  class="lg:pr-3"
                  :focus-on-select="true"
                  :dots="!isDesktop"
                  dots-class="c-carouselDots"
                >
                  <div
                    v-for="(image, idx) in winery.images" :key="generateKey(`mobile-${image.url}-${idx}`)"
                    class="lg:pl-3 w-full flex h-[410px]"
                  >
                    <LoadingImage
                      class="select-none pointer-events-none flex md:rounded-sm w-full h-full overflow-hidden"
                      img-classes="w-full object-cover object-center"
                      :thumbnail="{
                        url: `${image.url}&width=40&height=20`,
                        width: 40,
                        height: 20,
                        altText: `${winery.title} - ${idx}`,
                      }"
                      :source="{
                        url: `${image.url}&width=800&height=409`,
                        width: 800,
                        height: 409,
                        altText: `${winery.title} - ${idx}`,
                      }"
                    />
                  </div>
                  <template #customPaging="page">
                    <button
                      class="c-carouselDots__dot"
                      :class="{ '-sm': !inRange((page - currentC1Slide), -2, 2) }"
                    />
                  </template>
                  <template #prevArrow>
                    <div class="custom-arrow absolute transform -translate-y-1/2 top-1/2 !left-8">
                      <VueSvgIcon :data="chevronLeftIcon" width="20" height="20" />
                    </div>
                  </template>
                  <template #nextArrow>
                    <div class="custom-arrow absolute transform -translate-y-1/2 top-1/2 !right-8">
                      <VueSvgIcon :data="chevronRightIcon" width="20" height="20" />
                    </div>
                  </template>
                </VueSlickCarousel>
              </ClientOnly>
            </div>
            <div class="px-4 my-4 md:(grid gap-4 grid-cols-[minmax(auto,_60%)_minmax(auto,_40%)])">
              <BrandInfo :winery="winery" />
              <CountryMap
                v-if="metaFields && isDesktop" :logo="winery.logo && winery.featureImage.url || ''" :country="metaFields.country"
                :region="metaFields.region"
              />
            </div>
            <CmwTextAccordion line-clamp="3" :force-show="!isMarketing">
              <div class="prose px-4 md:order-3" v-html="$cmwStore.isUk ? stripHtmlAnchors(`${winery.descriptionHtml}`) : winery.descriptionHtml" />
            </CmwTextAccordion>
            <CmwQuote :quote="winery.quote" />
          </div>
        </div>
        <div v-else class="max-w-screen-xl mx-auto py-4">
          <h1 v-if="winery" class="px-4 text-secondary" v-text="winery.title" />
          <div class="px-4 h4 my-4 text-secondary" v-text="winery.subtitle" />
          <CmwTextAccordion v-if="isMarketing" line-clamp="3" :force-show="!isMarketing">
            <div
              class="prose px-4 md:order-3" v-html="$cmwStore.isUk ? stripHtmlAnchors(`${winery.descriptionHtml}`) : winery.descriptionHtml"
            />
          </CmwTextAccordion>

          <div v-if="winery && winery.title && isMarketing" id="brand-products" ref="brandProductsRef">
            <VendorProductsListing :vendor="winery.title" :vendor-fe-id="metaFields.feId" />
          </div>
          <div class="md:(grid gap-4 grid-cols-[minmax(auto,_60%)_minmax(auto,_40%)])">
            <div>
              <ClientOnly v-if="!!winery.images.length">
                <VueSlickCarousel
                  ref="c1"
                  :as-nav-for="c2"
                  :focus-on-select="true"
                  :dots="!isDesktop"
                  dots-class="c-carouselDots"
                >
                  <div
                    v-for="(image) in winery.images" :key="generateKey(`carousel-dots-${image.url}`)"
                    class="lg:pl-3 h-full flex"
                  >
                    <LoadingImage
                      class="select-none pointer-events-none flex md:rounded-sm h-full overflow-hidden"
                      :thumbnail="{
                        url: `${image.url}&width=40&height=20`,
                        width: 40,
                        height: 20,
                        altText: image.altText || winery.title,
                      }"
                      :source="{
                        url: `${image.url}&width=800&height=409`,
                        width: 800,
                        height: 409,
                        altText: image.altText || winery.title,
                      }"
                    />
                  </div>
                  <template #customPaging="page">
                    <button
                      class="c-carouselDots__dot"
                      :class="{ '-sm': !inRange((page - currentC1Slide), -2, 2) }"
                    />
                  </template>
                  <template #prevArrow>
                    <span />
                  </template>
                  <template #nextArrow>
                    <span />
                  </template>
                </VueSlickCarousel>
                <div v-if="winery.images.length > 1 && isDesktop" class="my-4">
                  <VueSlickCarousel
                    ref="c2"
                    :as-nav-for="c1"
                    :slides-to-show="3.5"
                    :infinite="false"
                    :focus-on-select="true"
                  >
                    <div
                      v-for="(image) in winery.images" :key="generateKey(`thumb-${image}`)"
                      class="px-3 h-full flex"
                    >
                      <LoadingImage
                        class="select-none pointer-events-none flex rounded-sm h-full overflow-hidden"
                        :thumbnail="{
                          url: `${image.url}&width=40&height=20`,
                          width: 40,
                          height: 20,
                          altText: image.altText || winery.title,
                        }"
                        :source="{
                          url: `${image.url}&width=800&height=409`,
                          width: 800,
                          height: 409,
                          altText: image.altText || winery.title,
                        }"
                      />
                    </div>
                    <template #prevArrow="arrowOption">
                      <div v-if="arrowOption.currentSlide > 0" class="custom-arrow absolute transform -translate-y-1/2 top-1/2 !left-8">
                        <VueSvgIcon :data="chevronLeftIcon" width="20" height="20" />
                      </div>
                      <span v-else />
                    </template>
                    <template #nextArrow>
                      <div class="custom-arrow absolute transform -translate-y-1/2 top-1/2 !right-8">
                        <VueSvgIcon :data="chevronRightIcon" width="20" height="20" />
                      </div>
                    </template>
                  </VueSlickCarousel>
                </div>
              </ClientOnly>
              <CmwTextAccordion v-if="isDesktop && !isMarketing" line-clamp="3" :force-show="!isMarketing">
                <div
                  class="prose md:order-3" v-html="$cmwStore.isUk ? stripHtmlAnchors(`${winery.descriptionHtml}`) : winery.descriptionHtml"
                />
              </CmwTextAccordion>
            </div>
            <div class="px-4">
              <BrandInfo :winery="winery" />
              <CountryMap
                v-if="metaFields && isDesktop" :logo="winery.logo && winery.featureImage.url || ''" :country="metaFields.country"
                :region="metaFields.region"
              />
              <CmwQuote v-if="isDesktop" :quote="winery.quote" />
            </div>
            <div v-if="winery && winery.featureImage && winery.featureImage.url" class="md:order-4">
              <!-- Note: on Nuxt 3 we could use Teleport o this component instead of having duplicates -->
              <CountryMap
                v-if="metaFields && !isDesktop" :logo="winery.featureImage && winery.featureImage.url || ''" :country="metaFields.country"
                :region="metaFields.region"
              />
            </div>
            <CmwTextAccordion v-if="!isDesktop && !isMarketing" line-clamp="3">
              <div class="prose px-4 md:order-3" v-html="$cmwStore.isUk ? stripHtmlAnchors(`${winery.descriptionHtml}`) : winery.descriptionHtml" />
            </CmwTextAccordion>
            <CmwQuote v-if="!isDesktop" :quote="winery.quote" />
          </div>
        </div>
        <div v-if="winery && winery.title && !isMarketing" id="brand-products" ref="brandProductsRef">
          <VendorProductsListing :vendor="winery.title" :vendor-fe-id="metaFields.feId" />
        </div>
      </div>
      <div v-else class="max-w-screen-xl mx-auto p-4 text-center">
        <div v-text="$t('search.noResultsAlert')" />
        <NuxtLink class="text-primary-400" :to="localePath('winery')">
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

::v-deep(.slick-slide > div > div) {
  display: flex !important;
}

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
