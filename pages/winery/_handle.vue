<script lang="ts">
import {
  computed,
  defineComponent,
  inject, nextTick,
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
import { generateHeadHreflang } from '~/utilities/arrays'
import getArticles from '~/graphql/queries/getArticles.graphql'
import { inRange } from '~/utilities/math'
import ribbon from '~/assets/svg/ribbon.svg'
import { stripHtmlAnchors } from '~/utilities/strings'

// Todo: define right types
interface ILocales {
  de: string
  en: string
  fr: string
  it: string
}
interface IMetaFields {
  hrefLang: {}
  images: never[]
  isPartner: boolean
  key: string
  feId: string
  subtitle: ILocales
  country: string
  region: string
}

interface IBrand {
  handle: string
  title: string
  contentHtml: string
  seo: {
    description: string
    title: string
  }
  image: {
    url: string
  }
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
    const brand = ref<IBrand>({
      handle: '/',
      title: '',
      contentHtml: '',
      seo: {
        description: '',
        title: '',
      },
      image: {
        url: '',
      },
    })
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

    const { fetch } = useFetch(async ({ $graphql }) => {
      const { articles } = await $graphql.default.request(getArticles, {
        lang: i18n.locale.toUpperCase(),
        first: 1,
        query: query.value,
      })

      if (articles.nodes[0]) {
        brand.value = articles.nodes[0]
        metaFields.value = articles.nodes[0].details && JSON.parse(articles.nodes[0].details.value) as IMetaFields

        if (route.value.params.handle !== `${brand!.value.handle}-${metaFields.value.key}.htm`) { return redirect(301, localePath({ name: 'winery-handle', params: { handle: `${brand.value?.handle.trim()}-${metaFields.value?.key}.htm` } })) }
      }
    })

    const currentC1Slide = computed(() => c1.value && c1.value.$refs.innerSlider.currentSlide)

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
      title: brand.value?.seo?.title || '',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: brand.value?.seo?.description || '',
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
      brand,
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
      metaFields,
      partnerC1,
      partnerC2,
      ribbon,
      stripHtmlAnchors,
    }
  },
  head: {},
  methods: { inRange },
})
</script>

<template>
  <div class="">
    <p v-if="$fetchState.pending" class="max-w-screen-xl mx-auto p-4">
      {{ $t("loading") }}
    </p>
    <template v-else>
      <div v-if="metaFields && brand.title">
        <div v-if="metaFields.isPartner" class="relative">
          <img
            class="absolute top-0 left-0 w-full h-500px"
            src="@/assets/images/bg-wave.png" alt="image"
          >
          <div class="relative max-w-screen-xl mx-auto py-4 md:px-4">
            <div class="px-4 lg:px-3 ">
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
              <h1 v-if="brand" class="text-white" v-text="brand.title" />
              <div class="h4 my-4 !text-white" v-text="metaFields.subtitle && metaFields.subtitle[$i18n.locale]" />
            </div>
            <ClientOnly v-if="!!metaFields.images.length">
              <VueSlickCarousel
                ref="partnerC1"
                class="lg:pr-3"
                :as-nav-for="partnerC2"
                :focus-on-select="true"
                :dots="!isDesktop"
                dots-class="c-carouselDots"
              >
                <div
                  v-for="(image, idx) in metaFields.images" :key="image"
                  class="lg:pl-3 w-full flex h-[410px]"
                >
                  <LoadingImage
                    class="select-none pointer-events-none flex md:rounded-sm w-full h-full overflow-hidden"
                    img-classes="w-full object-cover object-center"
                    :thumbnail="{
                      url: `${image}&width=40&height=20`,
                      width: 40,
                      height: 20,
                      altText: `${brand.title} - ${idx}`,
                    }"
                    :source="{
                      url: `${image}&width=800&height=409`,
                      width: 800,
                      height: 409,
                      altText: `${brand.title} - ${idx}`,
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
              <div v-if="metaFields.images.length > 1 && isDesktop" class="my-4">
                <VueSlickCarousel
                  ref="partnerC2"
                  class="lg:pr-3"
                  :as-nav-for="partnerC1"
                  :slides-to-show="5.5"
                  :infinite="false"
                  :focus-on-select="true"
                >
                  <div
                    v-for="(image, idx) in metaFields.images" :key="`thumb-${image}`"
                    class="px-3 h-full flex"
                  >
                    <img
                      class="select-none pointer-events-none flex rounded-sm h-full overflow-hidden"
                      :src="image" :alt="`${brand.title} - ${idx}`"
                    >
                  </div>
                  <template #prevArrow>
                    <span />
                  </template>
                  <template #nextArrow>
                    <div class="custom-arrow absolute transform -translate-y-1/2 top-1/2 !right-8">
                      <VueSvgIcon :data="chevronRightIcon" width="20" height="20" />
                    </div>
                  </template>
                </VueSlickCarousel>
              </div>
            </ClientOnly>
            <div class="px-4 md:(grid gap-4 grid-cols-[minmax(auto,_60%)_minmax(auto,_40%)])">
              <BrandInfo v-if="metaFields" :meta-fields="metaFields" />
              <CountryMap
                v-if="metaFields && isDesktop" :logo="brand.image && brand.image.url || ''" :country="metaFields.country"
                :region="metaFields.region"
              />
            </div>
            <div class="px-4 md:order-3" v-html="stripHtmlAnchors(brand.contentHtml)" />
          </div>
        </div>
        <div v-else class="max-w-screen-xl mx-auto py-4">
          <h1 v-if="brand" class="px-4 text-secondary" v-text="brand.title" />
          <div class="px-4 h4 my-4 text-secondary" v-text="metaFields.subtitle && metaFields.subtitle[$i18n.locale]" />
          <div class="md:(grid gap-4 grid-cols-[minmax(auto,_60%)_minmax(auto,_40%)])">
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
                    v-for="(image, idx) in metaFields.images" :key="image"
                    class="lg:pl-3 h-full flex" :class="image"
                  >
                    <LoadingImage
                      class="select-none pointer-events-none flex md:rounded-sm h-full overflow-hidden"
                      :thumbnail="{
                        url: `${image}&width=40&height=20`,
                        width: 40,
                        height: 20,
                        altText: `${brand.title} - ${idx}`,
                      }"
                      :source="{
                        url: `${image}&width=800&height=409`,
                        width: 800,
                        height: 409,
                        altText: `${brand.title} - ${idx}`,
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
                <div v-if="metaFields.images.length > 1 && isDesktop" class="my-4">
                  <VueSlickCarousel
                    ref="c2"
                    :as-nav-for="c1"
                    :slides-to-show="3.5"
                    :infinite="false"
                    :focus-on-select="true"
                  >
                    <div
                      v-for="(image, idx) in metaFields.images" :key="`thumb-${image}`"
                      class="px-3 h-full flex"
                    >
                      <LoadingImage
                        class="select-none pointer-events-none flex rounded-sm h-full overflow-hidden"
                        :thumbnail="{
                          url: `${image}&width=40&height=20`,
                          width: 40,
                          height: 20,
                          altText: `${brand.title} - ${idx}`,
                        }"
                        :source="{
                          url: `${image}&width=800&height=409`,
                          width: 800,
                          height: 409,
                          altText: `${brand.title} - ${idx}`,
                        }"
                      />
                    </div>
                    <template #prevArrow>
                      <span />
                    </template>
                    <template #nextArrow>
                      <div class="custom-arrow absolute transform -translate-y-1/2 top-1/2 !right-8">
                        <VueSvgIcon :data="chevronRightIcon" width="20" height="20" />
                      </div>
                    </template>
                  </VueSlickCarousel>
                </div>
              </ClientOnly>
              <div v-if="isDesktop" class="md:order-3" v-html="stripHtmlAnchors(brand.contentHtml)" />
            </div>
            <div class="px-4">
              <BrandInfo v-if="metaFields" :meta-fields="metaFields" />
              <CountryMap
                v-if="metaFields && isDesktop" :logo="brand.image && brand.image.url || ''" :country="metaFields.country"
                :region="metaFields.region"
              />
            </div>
            <div v-if="brand && brand.image && brand.image.url" class="md:order-4">
              <!-- Note: on Nuxt 3 we could use Teleport o this component instead of having duplicates -->
              <CountryMap
                v-if="metaFields && !isDesktop" :logo="brand.image && brand.image.url || ''" :country="metaFields.country"
                :region="metaFields.region"
              />
            </div>
            <div v-if="!isDesktop" class="px-4 md:order-3" v-html="stripHtmlAnchors(brand.contentHtml)" />
          </div>
        </div>
        <div v-if="brand && brand.title" id="brand-products" ref="brandProductsRef">
          <VendorProductsListing :vendor="brand.title" :vendor-fe-id="metaFields.feId" />
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
