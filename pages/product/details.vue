<script lang="ts">
import {
  computed,
  defineComponent,
  inject,
  ref,
  useContext,
  useFetch,
  useMeta,
  useRoute,
  watch,
} from '@nuxtjs/composition-api'
import { storeToRefs } from 'pinia'

import type { IProductBreadcrumbs, IProductMapped, IShopifyProductVariant } from '~/types/product'
import type { IMoneyV2 } from '~/types/common-objects'
import type { IShopifyCartInput } from '~/types/cart'
import type { TISO639 } from '~/config/themeConfig'

import { generateKey, stripHtmlAnchors } from '~/utilities/strings'
import { getCountryFromStore, getCurrencySymbol, getLocaleFromCurrencyCode, getPercent } from '~/utilities/currency'
import addIcon from '~/assets/svg/add.svg'
import cartIcon from '~/assets/svg/cart.svg'
import emailIcon from '~/assets/svg/email.svg'
import favouriteIcon from '~/assets/svg/selections/favourite.svg'
import heartFullIcon from '~/assets/svg/heart-full.svg'
import heartIcon from '~/assets/svg/heart.svg'
import subtractIcon from '~/assets/svg/subtract.svg'
import { SweetAlertToast } from '~/utilities/Swal'

import getArticles from '~/graphql/queries/getArticles.graphql'
import { useCart } from '~/store/cart'
import { useCustomer } from '~/store/customer'
import { useCustomerWishlist } from '~/store/customerWishlist'
import { useRecentProductsStore } from '~/store/recent'
import useShowRequestModal from '~/components/ProductBox/useShowRequestModal'

interface IProductDetails {
  brandId: string
  canonical: string
  compareAtPrice: IMoneyV2
  feId: string
  foodPairings: string[]
  hrefLang: Record<string, string> | null
  key: string
  milliliters: number
  priceLists: Record<string, any>
  redirectSeoUrl: Record<string, string>
  shortDescription: Record<string, string>
  subCategoryName: string
}

export default defineComponent({
  setup() {
    if (process.client) { window.scrollTo(0, 0) }

    const {
      $cmwGtmUtils,
      $cmwRepo,
      $cmwStore,
      $config,
      $graphql,
      $productMapping,
      error,
      i18n,
      localePath,
      redirect,
      req,
    } = useContext()
    const customerStore = useCustomer()
    const { cart } = storeToRefs(useCart())
    const { cartLinesAdd, cartLinesUpdate, cartCreate } = useCart()
    const isDesktop = inject('isDesktop')
    const recentProductsStore = useRecentProductsStore()
    const { recentProducts } = storeToRefs(recentProductsStore)

    const {
      customer,
      customerId,
      getCustomerType,
    } = storeToRefs(customerStore)

    const { handleWishlist } = useCustomerWishlist()
    const { wishlistArr } = storeToRefs(useCustomerWishlist())
    const route = useRoute()
    const isOpen = ref(false)
    const showRequestModal = ref(false)
    const product = ref<Maybe<IProductMapped>>(null)
    const productVariant = ref<Maybe<IShopifyProductVariant>>(null)
    const productDetails = ref<Maybe<IProductDetails>>(null)
    const productBreadcrumbs = ref<IProductBreadcrumbs[]>([])
    const brandMetaFields = ref({
      key: '',
      subtitle: '',
      images: [],
      hrefLang: {},
      isPartner: false,
    })
    const finalPrice = ref<Partial<IMoneyV2>>({})
    const lowestPrice = ref<Partial<IMoneyV2>>({})
    const compareAtPrice = ref<Partial<IMoneyV2>>({})

    const brand = ref({
      handle: '',
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

    const canonicalUrl = ref('')
    const originUrl = ref('')

    if (process.server && req?.headers && req?.url) {
      originUrl.value = `https://${req.headers.host}`
      canonicalUrl.value = `https://${req.headers.host}${req.url}`
    }

    if (process.client && typeof window !== 'undefined') {
      const {
        origin,
        pathname,
        search,
      } = window.location
      const encodedPath = pathname || ''
      const encodedSearch = search || ''
      originUrl.value = `${origin}`
      canonicalUrl.value = `${origin}${encodedPath}${encodedSearch}`
    }

    const { handleShowRequestModal } = useShowRequestModal()

    const { fetchState } = useFetch(async ({ $sentry }) => {
      await $cmwRepo.products.getAllV2({
        first: 1,
        query: `tag:P${route.value.params.id}`,
      })
        .then(async (products) => {
          if (!products?.length || !products[0]) {
            return error({
              statusCode: 404,
              message: 'No results',
            })
          }

          const locale: TISO639 = i18n.locale as TISO639
          product.value = $productMapping.fromShopify([products[0]])[0]

          productVariant.value = products[0].variants.nodes[0]
          productDetails.value = JSON.parse(products[0].details.value)
          const productBreadcrumbsValue = products[0].breadcrumbs?.value ? JSON.parse(products[0].breadcrumbs?.value) : {}

          if (Object.keys(productBreadcrumbsValue).length && Object.keys(productBreadcrumbsValue).includes(locale)) {
            productBreadcrumbs.value = $productMapping.breadcrumbs(productBreadcrumbsValue[locale])
          }

          if (!productDetails.value) { return }

          if (route.value.params.pathMatch !== product.value.handle.toLowerCase()) {
            return redirect(
              301,
              localePath(`/${product.value.handle.toLowerCase()}-${productDetails.value.key}.htm`),
              route.value.query)
          }

          if (product.value.tags.includes('not_active')) {
            if (productDetails.value.redirectSeoUrl && productDetails.value.redirectSeoUrl[locale]) {
              return redirect(
                301,
                localePath(`/${productDetails.value.redirectSeoUrl[locale]}`) as unknown as string,
                route.value.query)
            }
            return redirect(301, localePath({ name: 'index' }))
          }

          recentProductsStore.$patch({
            recentProducts: recentProducts.value?.length > 11
              ? [...new Set([...recentProducts.value, productDetails.value.key])].slice(-12)
              : [...new Set([...recentProducts.value, productDetails.value.key])],
          })

          const { articles } = await $graphql.default.request(getArticles, {
            lang: locale.toUpperCase(),
            first: 1,
            query: `tag:B${productDetails.value.brandId}`, // route.value.params.handle,
          })

          if (articles.nodes[0]) {
            brand.value = articles.nodes[0]
            brandMetaFields.value = articles.nodes[0].details && JSON.parse(articles.nodes[0].details.value)
          }
        })
        .catch((err) => {
          $sentry.captureException(new Error(`Something went wrong processing the product in PDP ${err}`))
        })
    })

    const localeProperties = computed(() => i18n.localeProperties)

    const showScalaPay = computed(() => $cmwStore.isIt || $cmwStore.isB2b)

    const showKlarna = computed(() => $cmwStore.isUk || $cmwStore.isFr || $cmwStore.isDe)

    const isOnSale = computed(() => {
      if (!productVariant.value) { return false }

      return product.value?.availableFeatures.includes('isInPromotion')
    })

    const strippedContent = computed(() => {
      const locale: TISO639 = i18n.locale as TISO639
      if (productDetails.value?.shortDescription[locale]) {
        if ($config.SALECHANNEL === 'cmw_uk_b2c') {
          return stripHtmlAnchors(productDetails.value.shortDescription[locale])
        } else {
          return productDetails.value.shortDescription[locale]
        }
      }

      return ''
    })

    const amountMax = computed(() => {
      if (!product.value?.details.amountMax) { return 0 }

      return (product.value.details.amountMax[$config.SALECHANNEL]
              && product.value.details.amountMax[$config.SALECHANNEL] <= product.value.quantityAvailable)
        ? product.value.details.amountMax[$config.SALECHANNEL]
        : product.value.quantityAvailable
    })

    const isOnCart = computed(() =>
      cart.value.lines.find(el => el.merchandise.id === product.value?.shopify_product_variant_id))

    const cartQuantity = computed(() => isOnCart.value ? isOnCart.value.quantity : 0)

    const canAddMore = computed(() => (amountMax.value - cartQuantity.value) > 0)

    const isBundle = computed(() => !!product.value?.bundle?.length)

    const isOnFavourite = computed(() => wishlistArr.value.includes(`'${product.value?.source_id}'`))

    const priceByLiter = computed(() => {
      if ($config.STORE !== 'CMW_DE') {
        return 0
      } else {
        return ((+(finalPrice?.value?.amount || 0) / +(productDetails.value?.milliliters || 0)) * 1000)
      }
    })

    const gtmProductData = computed(() => ({
      ...product.value?.gtmProductData,
      price: finalPrice.value,
    }))

    const removeProductFromCustomerCart = async () => {
      if (cartQuantity.value < 1) {
        return
      }

      const currentLineItem = cart.value.lines.find(el => el.merchandise.id === product.value?.shopify_product_variant_id)

      if (!currentLineItem) { return }

      const lineItems = [{
        attributes: currentLineItem.attributes,
        id: currentLineItem.id,
        quantity: +currentLineItem.quantity - 1,
        merchandiseId: currentLineItem.merchandise.id,
      }]

      await cartLinesUpdate(cart.value.id, lineItems, true)
    }

    const generateMetaLink = (arr: any[]) => {
      const hrefLangArr = arr.length
        ? arr.map(el => ({
          hid: `alternate-${el[0]}`,
          rel: 'alternate',
          href: el[1],
          hreflang: el[0],
        }))
        : []

      return [
        ...hrefLangArr,
        !canonicalUrl.value
          ? {}
          : {
              rel: 'canonical',
              href: canonicalUrl.value,
            },
      ]
    }

    watch([
      () => getCustomerType.value,
      () => productDetails.value?.feId,
    ], () => {
      if (!productDetails.value?.feId) { return false }

      const priceLists = product.value?.priceLists ? product.value?.priceLists[getCustomerType.value] : null

      finalPrice.value = (priceLists?.price?.amount && priceLists?.price?.currencyCode) ? priceLists.price : {}
      lowestPrice.value = (priceLists?.lowestPrice?.amount && priceLists?.lowestPrice?.currencyCode) ? priceLists.lowestPrice : {}
      compareAtPrice.value = (priceLists?.compareAtPrice?.amount && priceLists?.compareAtPrice?.currencyCode) ? priceLists.compareAtPrice : {}
    }, { immediate: true })

    watch(() => gtmProductData.value.id, () => {
      process.browser && $cmwGtmUtils.pushPage('product', {
        event: 'productDetailView',
        ecommerce: {
          currencyCode: $config.STORE === 'CMW_UK' ? 'GBP' : 'EUR',
          detail: {
            products: [{ ...product.value?.gtmProductData }],
          },
        },
      })
    })

    useMeta(() => {
      let productDetailsHrefLang: any = productDetails.value?.hrefLang
        ? Object.entries(productDetails.value.hrefLang)
        : undefined
      productDetailsHrefLang = productDetailsHrefLang && generateMetaLink(productDetailsHrefLang)

      return {
        title: product?.value?.seo?.title || '',
        script: [{
          type: 'application/ld+json',
          innerHTML: JSON.stringify({

            '@context': 'https://schema.org',
            '@type': 'Product',
            'name': `${product.value?.title}`,
            'sku': `${product.value?.sku}`,
            'image': `${product.value?.image?.hd?.url}`,
            'mpn': `CALLMEWINE${product.value?.sku}`,
            'brand': {
              '@type': 'Brand',
              'name': `${product.value?.vendor}`,
            },
            'offers': {
              '@type': 'Offer',
              'url': `${originUrl.value}${localePath(product.value?.url || '')}`,
              'priceCurrency': `${productVariant.value?.price.currencyCode}`,
              'price': `${finalPrice.value}`,
              'availability': `${product.value?.availableForSale ? 'InStock' : 'OutOfStock'}`,
              'itemCondition ': 'newCondition',
            },
          }),
        }, {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({

            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            'itemListElement': productBreadcrumbs.value.map((el, i) => {
              return {
                '@type': 'ListItem',
                'position': i + 1,
                'item': {
                  '@id': `${originUrl.value}${localePath(el.to)}`,
                  'name': el.label,
                },

              }
            }),
          }),
        }],
        __dangerouslyDisableSanitizers: ['script'],
        meta: [
          {
            hid: 'description',
            name: 'description',
            content: product.value?.seo?.description || '',
          },
        ],
        ...(productDetailsHrefLang && { link: productDetailsHrefLang }),
      }
    })

    return {
      addIcon,
      amountMax,
      baseUrl: originUrl,
      brand,
      brandMetaFields,
      canAddMore,
      cart,
      cartCreate,
      cartIcon,
      cartLinesAdd,
      cartQuantity,
      compareAtPrice,
      customer,
      customerId,
      emailIcon,
      favouriteIcon,
      fetchState,
      finalPrice,
      generateMetaLink,
      getCustomerType,
      gtmProductData,
      handleShowRequestModal,
      handleWishlist,
      heartFullIcon,
      heartIcon,
      isBundle,
      isDesktop,
      isOnCart,
      isOnFavourite,
      isOnSale,
      isOpen,
      localeProperties,
      lowestPrice,
      priceByLiter,
      product,
      productBreadcrumbs,
      productDetails,
      productVariant,
      removeProductFromCustomerCart,
      showKlarna,
      showRequestModal,
      showScalaPay,
      strippedContent,
      subtractIcon,
      wishlistArr,
    }
  },
  head: {},
  methods: {
    getCurrencySymbol,
    generateKey,
    getPercent,
    getLocaleFromCurrencyCode,
    async addProductToCustomerCart() {
      this.isOpen = true

      // check for availability
      if (!this.canAddMore) {
        await SweetAlertToast.fire({
          icon: 'warning',
          text: this.$i18n.t('common.feedback.KO.addToCartReachLimit'),
        })
        return
      }

      const cartInput: IShopifyCartInput = {
        buyerIdentity: {
          countryCode: getCountryFromStore(this.$cmwStore.settings.store),
          ...(this.customer.email && { email: this.customer.email }),
        },
        note: this.cart.note || '',
        lines: [{
          attributes: [
            {
              key: 'gtmProductData',
              value: this.product?.gtmProductData ? JSON.stringify(this.product.gtmProductData) : 'false',
            },
            {
              key: 'bundle',
              value: (this.product?.tags) ? this.product.tags.includes('BUNDLE').toString() : 'false',
            },
          ],
          quantity: 1,
          merchandiseId: this.product?.shopify_product_variant_id || '',
        }],
      }

      if (!this.cart.id) {
        await this.cartCreate({
          ...cartInput,
          lines: [],
        })
      }

      this.cartLinesAdd(this.cart.id, cartInput.lines)
        .then(async () => {
          /* @ts-expect-error flashMessage doesn't seem to handle typescript */
          this.flashMessage.show({
            status: '',
            message: this.$i18n.t('common.feedback.OK.cartAdded', { product: `${this.product?.title}` }),
            icon: this.product?.image?.source.url,
            iconClass: 'bg-transparent ',
            time: 8000,
            blockClass: 'add-product-notification',
          })
        })
    },
  },
})
</script>

<template>
  <div class="mt-4 max-w-screen-xl mx-auto px-4">
    <div v-if="fetchState?.pending" class="sr-only" />
    <div v-else-if="fetchState?.error" class="relative text-center mt-12">
      <div class="md:(grid grid-cols-2 items-center)">
        <img
          class="w-3/4 mx-auto" src="https://cdn.shopify.com/s/files/1/0668/1860/5335/files/wine-stain.png?width=900"
          alt="empty-bottles"
        >
        <div class="text-left">
          <h2 class="h1 text-secondary" v-text="$t('pages.notFound.title')" />
          <p class="mb-8 md:w-3/5" v-text="$t('pages.notFound.line')" />
        </div>
      </div>
    </div>
    <div v-else>
      <div v-if="product?.title && brandMetaFields">
        <TheBreadcrumbs v-if="!!productBreadcrumbs.length" :breadcrumbs="productBreadcrumbs" />
        <div class="min-h-[350px] md:(grid grid-cols-[40%_60%] min-h-[550px] my-4)">
          <!-- Image Section -->
          <div class="relative min-h-[350px] md:min-h-[550px]">
            <LoadingImage
              class="min-h-[350px] md:min-h-[550px] h-full"
              img-classes="min-h-[350px] max-h-[350px] md:max-h-[550px] mx-auto object-contain"
              :thumbnail="product?.image?.thumbnail"
              :source="product?.image?.hd"
            />
            <div v-if="$cmwStore.isDe" class="md:hidden transform absolute w-full bottom-0 flex items-center justify-center left-1/2 -translate-x-1/2 translate-y-8">
              <i18n-n
                v-if="finalPrice && !isOnSale && productVariant?.price.currencyCode"
                class="md:hidden inline-block text-gray" :value="Number(finalPrice)"
                :format="{ key: 'currency' }"
                :locale="getLocaleFromCurrencyCode(productVariant.price.currencyCode)"
              >
                <template #currency="slotProps">
                  <span class="text-xs">{{ slotProps.currency }}</span>
                </template>
                <template #integer="slotProps">
                  <span class="text-xs">{{ slotProps.integer }}</span>
                </template>
                <template #group="slotProps">
                  <span class="text-xs">{{ slotProps.group }}</span>
                </template>
                <template #fraction="slotProps">
                  <span class="text-xs">{{ slotProps.fraction }}</span>
                </template>
              </i18n-n>
              <span v-if="$cmwStore.isDe && priceByLiter" class="text-sm text-gray">
                {{
                  $n(Number(priceByLiter), 'currency', getLocaleFromCurrencyCode(compareAtPrice?.currencyCode))
                }}/liter</span>
              <div v-if="$cmwStore.isDe" class="md:hidden text-sm text-gray ml-1">
                Inkl. MwSt. Und St.
              </div>
            </div>
            <div v-if="product?.availableFeatures" class="absolute top-4 left-2">
              <ProductBoxFeature
                v-for="feature in product?.availableFeatures"
                :key="generateKey(`details-feature-${feature}`)" :feature="feature"
              />
            </div>
            <div class="absolute bottom-0 left-2">
              <div
                v-for="(award, i) in product?.awards.slice(0, 4)"
                :key="`${award.id}-${i}`"
                class="flex gap-1 items-center pr-1.5"
              >
                <ProductBoxAward :award="award" />
              </div>
            </div>
            <div class="absolute transform top-4 right-8">
              <CardLapel v-if="isOnSale" variant="simple" />
            </div>
            <div class="absolute bottom-0 right-0">
              <button
                type="button"
                :aria-label="isOnFavourite ? $t('enums.accessibility.role.REMOVE_FROM_WISHLIST') : $t('enums.accessibility.role.ADD_TO_WISHLIST')"
                @click="handleWishlist({ id: product?.id, isOnFavourite, gtmProductData: product?.gtmProductData })"
              >
                <VueSvgIcon
                  color="#d94965"
                  width="32"
                  height="32"
                  :data="isOnFavourite ? heartFullIcon : heartIcon"
                />
              </button>
            </div>
          </div>
          <!-- Content Section -->
          <div class="flex flex-col">
            <h1 class="h2 text-secondary <md:pt-8" v-text="product?.title" />
            <NuxtLink
              v-if="!isBundle && product?.vendor.toUpperCase() !== 'CALLMEWINE'"
              class="h3 w-max hover:text-primary-400"
              :to="localePath({ name: 'winery-handle', params: { handle: `${brand.handle}-${brandMetaFields.key}.htm` } })"
              prefetch
            >
              {{ product?.vendor }}
            </NuxtLink>
            <CmwTextAccordion line-clamp="3">
              <div class="prose text-sm leading-snug md:(text-base leading-normal)" v-html="strippedContent" />
            </CmwTextAccordion>
            <p v-if="!product?.availableForSale" class="text-primary-400">
              {{ $t('product.notAvailable') }}
            </p>
            <div v-if="isBundle && productDetails?.subCategoryName !== 'Mystery Box'" class="mb-4">
              <div class="h4 my-4" v-text="$t('bundle.whatIsInTheBox')" />
              <ul class="mb-4 text-sm text-body">
                <li v-for="({ product_name, quantity }) in product?.bundle" :key="generateKey(product_name)">
                  {{ quantity }} {{ product_name }}
                </li>
              </ul>
            </div>
            <!-- Klarna Scripts -->
            <template v-if="showKlarna">
              <script
                v-if="$cmwStore.isUk"
                data-environment="production" src="https://osm.klarnaservices.com/lib.js"
                data-client-id="c72bae1f-0d1c-5ed1-a3bb-b0fa3d12e442"
                async
              />

              <script
                v-else-if="$cmwStore.isDe"
                async
                data-environment="production" src="https://js.klarna.com/web-sdk/v1/klarna.js"
                data-client-id="11e7a9bf-129c-580b-9095-0d578515d571"
              />

              <script
                v-else-if="$cmwStore.isFr"
                async
                data-environment="production" src="https://js.klarna.com/web-sdk/v1/klarna.js"
                data-client-id="1e41d5a7-a0aa-55e1-86f2-00a1e155ac60"
              />

              <ClientOnly>
                <div v-if="finalPrice?.amount" class="my-4">
                  <klarna-placement
                    data-key="credit-promotion-badge"
                    :data-locale="localeProperties?.iso"
                    :data-purchase-amount="Number(finalPrice.amount).toFixed(2).replace(/[^0-9]/g, '')"
                  />
                </div>
              </ClientOnly>
            </template>
            <ProductDetailsVintages :sku="product?.sku" />
            <!-- MOBILE ADD_TO_CART BUTTON -->
            <div
              class="
            <md:(fixed bottom-0 left-0 w-full bg-white z-content shadow-elevation pl-3 pr-3 pt-2 pb-2)
            mt-auto grid grid-cols-[3fr_9fr] items-center
            md:my-8
"
            >
              <div>
                <div
                  v-if="isOnSale"
                  class="flex items-center gap-2"
                >
                  <ProductPriceListsCompareAtPrice v-if="isOnSale && Object.keys(compareAtPrice).length" :compare-at-price="compareAtPrice" />
                  <CmwChip
                    v-if="finalPrice?.amount"
                    color="secondary"
                    shape="rounded"
                    :label="`-${getPercent(+finalPrice.amount, +compareAtPrice?.amount)}%`"
                  />
                </div>
                <ProductPriceListsFinalPrice v-if="Object.keys(finalPrice).length" :final-price="finalPrice" />
                <div v-if="$cmwStore.isB2b" class="text-gray-dark text-sm">
                  iva esclusa
                </div>
                <div v-if="$cmwStore.isDe">
                  <span v-if="$cmwStore.isDe && priceByLiter" class="text-sm <md:hidden">
                    {{
                      $n(Number(priceByLiter), 'currency', getLocaleFromCurrencyCode(compareAtPrice?.currencyCode))
                    }}/liter</span>
                  <div v-if="$cmwStore.isDe" class="<md:hidden text-sm text-gray-dark">
                    Inkl. MwSt. Und St.
                  </div>
                </div>
              </div>
              <div class="ml-auto mr-2">
                <div class="">
                  <div v-if="!amountMax">
                    <p
                      v-if="product?.quantityAvailable > 0" class="text-success text-center"
                      :class="{ hidden: product?.quantityAvailable > 6 }"
                    >
                      {{ $t('product.available', { quantity: product?.quantityAvailable }) }}
                    </p>
                  </div>
                  <div v-if="product?.availableForSale" class="relative">
                    <div v-if="!amountMax">
                      <CmwButton
                        class="gap-2 pl-2 pr-3 py-2"
                        :aria-label="$t('enums.accessibility.role.ADD_TO_CART')"
                        @click.native="addProductToCustomerCart"
                      >
                        <VueSvgIcon :data="cartIcon" color="white" width="30" height="auto" />
                        <span class="text-sm" v-text="isDesktop ? $t('common.cta.addToCart') : $t('common.cta.addToCartSm')" />
                      </CmwButton>
                      <Badge
                        v-show="cartQuantity && !isOpen"
                        class="absolute top-0 left-full transform -translate-x-1/2 -translate-y-1/2"
                        bg-color="primary-400" :qty="cartQuantity"
                      />
                      <div
                        v-show="isOpen"
                        class="absolute grid grid-cols-[50px_auto_50px] items-center w-full h-[50px] top-0 left-0"
                        @mouseleave="isOpen = false"
                      >
                        <button
                          class="flex transition-colors w-[50px] h-[50px] bg-primary-400 rounded-l hover:(bg-primary)"
                          :aria-label="$t('enums.accessibility.role.REMOVE_FROM_CART')"
                          @click="removeProductFromCustomerCart"
                        >
                          <VueSvgIcon class="m-auto" :data="subtractIcon" width="14" height="14" color="white" />
                        </button>
                        <div class="flex h-[40px] bg-primary-400 text-white text-center">
                          <span class="m-auto text-sm">{{ cartQuantity }}</span>
                        </div>
                        <button
                          class="flex transition-colors w-[50px] h-[50px] bg-primary-400 rounded-r
                          hover:(bg-primary)
                          disabled:(bg-primary-100 cursor-not-allowed)"
                          :disabled="!canAddMore"
                          :aria-label="!canAddMore ? '' : $t('enums.accessibility.role.ADD_TO_CART')"
                          @click="addProductToCustomerCart"
                        >
                          <VueSvgIcon class="m-auto" :data="addIcon" width="14" height="14" color="white" />
                        </button>
                      </div>
                    </div>
                    <div v-else>
                      <CmwButton
                        class="gap-2 pl-2 pr-3 py-2"
                        :aria-label="$t('enums.accessibility.role.ADD_TO_CART')"
                        @click.native="addProductToCustomerCart"
                      >
                        <!--                        <VueSvgIcon :data="cartIcon" color="white" width="30" height="auto" /> -->
                        <span class="text-sm" v-text="isDesktop ? $t('common.cta.addToCart') : $t('common.cta.addToCartSm')" />
                      </CmwButton>
                      <Badge
                        v-show="cartQuantity && !isOpen"
                        class="absolute top-0 left-full transform -translate-x-1/2 -translate-y-1/2"
                        bg-color="primary-400" :qty="cartQuantity"
                      />
                      <div
                        v-show="isOpen"
                        class="absolute grid grid-cols-[50px_auto_50px] items-center w-full h-[50px] top-0 right-0"
                        @mouseleave="isOpen = false"
                      >
                        <button
                          class="flex transition-colors w-[50px] h-[50px] bg-primary-400 rounded-l hover:(bg-primary)"
                          :aria-label="$t('enums.accessibility.role.REMOVE_FROM_CART')"
                          @click="removeProductFromCustomerCart"
                        >
                          <VueSvgIcon class="m-auto" :data="subtractIcon" width="14" height="14" color="white" />
                        </button>
                        <div class="flex h-[40px] bg-primary-400 text-white text-center">
                          <span class="m-auto text-sm">{{ cartQuantity }}</span>
                        </div>
                        <button
                          class="flex transition-colors w-[50px] h-[50px] bg-primary-400 rounded-r
                              hover:(bg-primary)
                              disabled:(bg-primary-100 cursor-not-allowed)"
                          :disabled="!canAddMore"
                          :aria-label="!canAddMore ? '' : $t('enums.accessibility.role.ADD_TO_CART')"
                          @click="addProductToCustomerCart"
                        >
                          <VueSvgIcon class="m-auto" :data="addIcon" width="14" height="14" color="white" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div v-else>
                    <CmwButton
                      variant="ghost"
                      class="gap-2 pl-2 pr-3 py-2 <md:(w-[min(100%,_14rem)] ml-auto)"
                      :aria-label="$t('enums.accessibility.role.MODAL_OPEN')"
                      @click.native="() => handleShowRequestModal(productDetails?.feId)"
                    >
                      <VueSvgIcon :data="emailIcon" width="30" height="auto" />
                      <span class="text-sm leading-4" v-text="isDesktop ? $t('common.cta.notifyMe') : $t('common.cta.notifyMeSm')" />
                    </CmwButton>
                  </div>
                </div>
              </div>
              <ProductPriceListsLowestPrice
                v-if="Object.keys(lowestPrice).length && !$cmwStore.isProd"
                class="col-span-full"
                :lowest-price="lowestPrice"
              />
            </div>
            <template v-if="showScalaPay">
              <script type="module" src="https://cdn.scalapay.com/widget/v3/js/scalapay-widget.esm.js" />
              <script nomodule src="https://cdn.scalapay.com/widget/v3/js/scalapay-widget.js" />
              <ClientOnly>
                <div class="my-4">
                  <scalapay-widget
                    frequency-number="30"
                    number-of-installments="3"
                    hide="false"
                    hide-price="false"
                    min="5"
                    max="1500"
                    :amount="`${getCurrencySymbol('EUR')} ${finalPrice}`"
                    currency-position="before"
                    currency-display="symbol"
                    logo-size="100"
                    theme="primary"
                    :locale="$i18n.locale"
                  />
                </div>
              </ClientOnly>
            </template>
          </div>
        </div>

        <ProductDetailsTabs
          :product="product" :product-details="productDetails" :brand="brand"
          :brand-meta-fields="brandMetaFields"
        />

        <ClientOnly>
          <VendorProducts :vendor="brand.title" :tag="product?.source_id" :vendor-fe-id="productDetails?.brandId" />
          <RecommendedProducts :id="product?.shopify_product_id" />
          <RecentProducts :current-product="product?.source_id" />
        </ClientOnly>
      </div>
    </div>
  </div>
</template>
