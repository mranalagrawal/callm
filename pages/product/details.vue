<script>
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
import addIcon from 'assets/svg/add.svg'
import cartIcon from 'assets/svg/cart.svg'
import emailIcon from 'assets/svg/email.svg'
import heartFullIcon from 'assets/svg/heart-full.svg'
import heartIcon from 'assets/svg/heart.svg'
import subtractIcon from 'assets/svg/subtract.svg'
import { storeToRefs } from 'pinia'
import { SweetAlertToast } from '@/utilities/Swal'
import { getCountryFromStore, getCurrencySymbol, getLocaleFromCurrencyCode, getPercent } from '@/utilities/currency'
import { useRecentProductsStore } from '@/store/recent'
import { useCustomer } from '@/store/customer'
import useShowRequestModal from '@/components/ProductBox/useShowRequestModal'
import favouriteIcon from '~/assets/svg/selections/favourite.svg'
import getArticles from '~/graphql/queries/getArticles'
import { useCheckout } from '~/store/checkout'
import { generateKey, stripHtmlAnchors } from '~/utilities/strings'

export default defineComponent({
  setup() {
    if (process.client) { window.scrollTo(0, 0) }

    const {
      i18n,
      $config,
      $graphql,
      $cmwStore,
      $cmwRepo,
      error,
      redirect,
      localeLocation,
      $cmwGtmUtils,
      $productMapping,
      req,
    } = useContext()
    const customerStore = useCustomer()
    const { checkout } = storeToRefs(useCheckout())
    const { checkoutCreate, checkoutLineItemsAdd, checkoutLineItemsUpdate } = useCheckout()
    const isDesktop = inject('isDesktop')
    const recentProductsStore = useRecentProductsStore()
    const { recentProducts } = storeToRefs(recentProductsStore)

    const {
      customer,
      wishlistArr,
      customerId,
      getCustomerType,
    } = storeToRefs(customerStore)

    const { handleWishlist } = customerStore
    const route = useRoute()
    const isOpen = ref(false)
    const showRequestModal = ref(false)
    const product = ref({
      source_id: '',
      availableFeatures: [],
      bundle: [],
      details: {},
      featuredImage: {
        altText: '',
        height: 0,
        url: '',
        width: 0,
      },
      handle: '',
      id: '',
      variants: { nodes: [] },
      title: '',
      tags: [],
      seo: {
        description: '',
        title: '',
      },
      gtmProductData: { id: '' },
    })
    const productVariant = ref()
    const productDetails = ref({
      brandId: '',
      canonical: '',
      feId: '',
      hrefLang: {},
      shortDescription: '',
      priceLists: {},
      redirectSeoUrl: {},
      foodPairings: [],
    })
    const productBreadcrumbs = ref([])
    const brandMetaFields = ref({
      key: '',
      subtitle: '',
      images: [],
      hrefLang: {},
      isPartner: false,
    })

    const brand = ref({
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

    if (process.server && req?.headers && req?.url) { canonicalUrl.value = `https://${req.headers.host}${req.url}` }

    if (process.client && typeof window !== 'undefined') {
      const {
        origin,
        pathname,
        search,
      } = window.location
      const encodedPath = pathname || ''
      const encodedSearch = search || ''
      canonicalUrl.value = `${origin}${encodedPath}${encodedSearch}`
    }

    const { handleShowRequestModal } = useShowRequestModal()

    const { fetchState } = useFetch(async ({ $sentry }) => {
      await $cmwRepo.products.getAll({
        first: 1,
        query: `tag:P${route.value.params.id}`,
      })
        .then(async ({ products = { nodes: [] } }) => {
          if (!!products.nodes.length && products.nodes[0].handle) {
            product.value = await $productMapping.fromShopify([products.nodes[0]])[0]

            productVariant.value = products.nodes[0].variants.nodes[0]
            productDetails.value = JSON.parse(products.nodes[0].details.value)
            productBreadcrumbs.value = JSON.parse(products.nodes[0].breadcrumbs.value)
            productBreadcrumbs.value = !Object.keys(productBreadcrumbs.value).length
              ? []
              : $productMapping.breadcrumbs(productBreadcrumbs.value[i18n.locale])

            if (route.value.params.pathMatch !== product.value.handle.toLowerCase()) { return redirect(301, localeLocation(`/${product.value.handle.toLowerCase()}-${productDetails.value.key}.htm`), route.value.query) }

            if (product.value.tags.includes('not_active')) {
              if (productDetails.value.redirectSeoUrl && productDetails.value.redirectSeoUrl[i18n.locale]) { return redirect(301, localeLocation(`/${productDetails.value.redirectSeoUrl[i18n.locale]}`), route.value.query) }
              return redirect(301, '/') // redirect to home if redirectSeoUrl is missing
            }

            // if (!productDetails.value.enabled)
            //   return redirect(301, productDetails.value.canonicalProductId ||
            //   `/winery/${product.value.vendor.replace(' ', '-').toLowerCase()}-B-${productDetails.value.brandId}.htm`)

            recentProductsStore.$patch({
              recentProducts: recentProducts.value?.length > 11
                ? [...new Set([...recentProducts.value, productDetails.value.key])].slice(-12)
                : [...new Set([...recentProducts.value, productDetails.value.key])],
            })

            const { articles } = await $graphql.default.request(getArticles, {
              lang: i18n.locale.toUpperCase(),
              first: 1,
              query: `tag:B${productDetails.value.brandId}`, // route.value.params.handle,
            })

            if (articles.nodes[0]) {
              brand.value = articles.nodes[0]
              brandMetaFields.value = articles.nodes[0].details && JSON.parse(articles.nodes[0].details.value)
            }
          } else {
            return error({
              statusCode: 404,
              message: 'No results',
            })
          }
        }).catch((err) => {
          $sentry.captureException(new Error(`Something went wrong ${err}`))
        })
    })

    const showScalaPay = computed(() => $cmwStore.isIt || $cmwStore.isB2b)

    const showKlarna = computed(() => $cmwStore.isUk || $cmwStore.isFr || $cmwStore.isDe)

    const isOnSale = computed(() => {
      if (!productVariant.value) { return false }

      return product.value.availableFeatures.includes('isInPromotion')
    })

    const strippedContent = computed(() => {
      if (productDetails.value.shortDescription[i18n.locale]) {
        if ($config.SALECHANNEL === 'cmw_uk_b2c') {
          return stripHtmlAnchors(productDetails.value.shortDescription[i18n.locale])
        } else {
          return productDetails.value.shortDescription[i18n.locale]
        }
        /*
        return productDetails.value.shortDescription[i18n.locale]
          .replace('href', '')
          .replace('style', '')
        */
      }

      return ''// empty like old.com
    })

    const amountMax = computed(() => {
      if (!product.value.details.amountMax) { return 0 }

      return (product.value.details.amountMax[$config.SALECHANNEL]
              && product.value.details.amountMax[$config.SALECHANNEL] <= product.value.quantityAvailable)
        ? product.value.details.amountMax[$config.SALECHANNEL]
        : product.value.quantityAvailable
    })

    const isOnCart = computed(() =>
      checkout.value.lineItems.find(el => el.variant.id === product.value.shopify_product_variant_id))

    const cartQuantity = computed(() => isOnCart.value ? isOnCart.value.quantity : 0)

    const canAddMore = computed(() => (amountMax.value - cartQuantity.value) > 0)

    const isBundle = computed(() => !!product.value.bundle.length)

    const finalPrice = computed(() => {
      if (!productDetails.value.feId) { return false }

      return productDetails.value.priceLists[$config.SALECHANNEL][getCustomerType.value] || 0
    })

    const isOnFavourite = computed(() => {
      return [...wishlistArr.value].includes(`'${product.value.source_id}'`)
    })

    const priceByLiter = computed(() => {
      if ($config.STORE !== 'CMW_DE') { return 0 } else { return ((finalPrice.value / productDetails.value.milliliters) * 1000) }
    })

    const gtmProductData = computed(() => ({
      ...product.value.gtmProductData,
      price: finalPrice.value,
    }))

    const removeProductFromCustomerCheckout = async () => {
      if (cartQuantity.value < 1) {
        return
      }

      const currentLineItem = checkout.value.lineItems.nodes.find(el => el.variant.id === product.value.shopify_product_variant_id)

      if (!currentLineItem) {
        return
      }

      const lineItems = [{
        customAttributes: currentLineItem.customAttributes,
        id: currentLineItem.id,
        quantity: +currentLineItem.quantity - 1,
        variantId: currentLineItem.variant.id,
      }]

      await checkoutLineItemsUpdate(checkout.value.id, lineItems)
    }

    const generateMetaLink = (arr = []) => {
      const hrefLangArr = !!arr.length && arr.map(el => ({
        hid: `alternate-${el[0]}`,
        rel: 'alternate',
        href: el[1],
        hreflang: el[0],
      }))

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

    watch(() => gtmProductData.value.id, () => {
      process.browser && $cmwGtmUtils.pushPage('product', {
        event: 'productDetailView',
        ecommerce: {
          currencyCode: $config.STORE === 'CMW_UK' ? 'GBP' : 'EUR',
          detail: {
            products: [{ ...product.value.gtmProductData }],
          },
        },
      })
    })

    useMeta(() => ({
      title: product?.value?.seo?.title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: product?.value?.seo?.description,
        },
      ],
      link: productDetails.value
        && productDetails.value.hrefLang
        && Object.keys(productDetails.value?.hrefLang).length
        && generateMetaLink(Object.entries(productDetails.value?.hrefLang)),
    }))

    return {
      addIcon,
      amountMax,
      brand,
      brandMetaFields,
      canAddMore,
      cartIcon,
      cartQuantity,
      checkout,
      checkoutCreate,
      checkoutLineItemsAdd,
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
      priceByLiter,
      product,
      productBreadcrumbs,
      productDetails,
      productVariant,
      removeProductFromCustomerCheckout,
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
    async addProductToCustomerCheckout() {
      this.isOpen = true

      // check for availability
      if (!this.canAddMore) {
        await SweetAlertToast.fire({
          icon: 'warning',
          text: this.$i18n.t('common.feedback.KO.addToCartReachLimit'),
        })
        return
      }

      const checkoutCreateInput = {
        buyerIdentity: {
          countryCode: getCountryFromStore(this.$cmwStore.settings.store),
        },
        ...(this.customer.email && { email: this.customer.email }),
        note: this.checkout.note,
        lineItems: [{
          customAttributes: [
            {
              key: 'gtmProductData',
              value: this.product.gtmProductData ? JSON.stringify(this.product.gtmProductData) : 'false',
            },
            {
              key: 'bundle',
              value: (this.product.tags) ? this.product.tags.includes('BUNDLE').toString() : 'false',
            },
          ],
          quantity: this.product.quantity || 1,
          variantId: this.product.shopify_product_variant_id,
        }],
      }

      if (!this.checkout.id) {
        await this.checkoutCreate({
          ...checkoutCreateInput,
          lineItems: [],
        })
      }

      this.checkoutLineItemsAdd(this.checkout.id, checkoutCreateInput.lineItems)
        .then(async () => {
          this.flashMessage.show({
            status: '',
            message: this.$i18n.t('common.feedback.OK.cartAdded', { product: `${this.product.title}` }),
            icon: this.product.image.source.url,
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
    <div v-if="fetchState.pending" :class="fetchState?.pending" class="sr-only" />
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
              :thumbnail="product.image.thumbnail"
              :source="product.image.hd"
            />
            <div v-if="$cmwStore.isDe" class="md:hidden transform absolute w-full bottom-0 flex items-center justify-center left-1/2 -translate-x-1/2 translate-y-8">
              <i18n-n
                v-if="finalPrice && !isOnSale"
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
                  $n(Number(priceByLiter), 'currency', getLocaleFromCurrencyCode(product.compareAtPrice.currencyCode))
                }}/liter</span>
              <div v-if="$cmwStore.isDe" class="md:hidden text-sm text-gray ml-1">
                Inkl. MwSt. Und St.
              </div>
            </div>
            <div v-if="product.availableFeatures" class="absolute top-4 left-2">
              <ProductBoxFeature
                v-for="feature in product.availableFeatures"
                :key="generateKey(`details-feature-${feature}`)" :feature="feature"
              />
            </div>
            <div class="absolute bottom-0 left-2">
              <div
                v-for="(award, i) in product.awards.slice(0, 4)"
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
                @click="handleWishlist({ id: product.id, isOnFavourite, gtmProductData: product.gtmProductData })"
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
            <h1 class="h2 text-secondary <md:pt-8" v-text="product.title" />
            <NuxtLink
              v-if="!isBundle && product.vendor.toUpperCase() !== 'CALLMEWINE'"
              class="h3 w-max hover:text-primary-400"
              :to="localePath({ name: 'winery-handle', params: { handle: `${brand.handle}-${brandMetaFields.key}.htm` } })"
              prefetch
            >
              {{ product.vendor }}
            </NuxtLink>
            <CmwTextAccordion line-clamp="3">
              <div class="prose text-sm leading-snug md:(text-base leading-normal)" v-html="strippedContent" />
            </CmwTextAccordion>
            <p v-if="!product.availableForSale" class="text-primary-400">
              {{ $t('product.notAvailable') }}
            </p>
            <div v-if="isBundle && productDetails.subCategoryName !== 'Mystery Box'" class="mb-4">
              <div class="h4 my-4" v-text="$t('bundle.whatIsInTheBox')" />
              <ul class="mb-4 text-sm text-body">
                <li v-for="({ product_name, quantity }) in product.bundle" :key="generateKey(product_name)">
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
                <div v-if="finalPrice" class="my-4">
                  <klarna-placement
                    data-key="credit-promotion-badge"
                    :data-locale="$i18n.localeProperties.iso"
                    :data-purchase-amount="finalPrice.toFixed(2).replace(/[^0-9]/g, '')"
                  />
                </div>
              </ClientOnly>
            </template>
            <ProductDetailsVintages :sku="product.sku" />
            <!-- MOBILE ADD_TO_CART BUTTON -->
            <div
              class="
            <md:(fixed bottom-0 left-0 w-full bg-white z-content shadow-elevation px-3 py-4)
            mt-auto flex items-end
            md:my-8
"
            >
              <div>
                <div
                  v-if="isOnSale"
                  class="flex items-center gap-2"
                >
                  <span class="line-through text-gray text-sm">
                    {{
                      $n(Number(productVariant.compareAtPrice.amount),
                         'currency',
                         getLocaleFromCurrencyCode(productVariant.compareAtPrice.currencyCode))
                    }}
                  </span>
                  <CmwChip
                    color="secondary"
                    shape="rounded"
                    :label="`-${getPercent(finalPrice, productVariant.compareAtPrice.amount)}%`"
                  />
                </div>
                <i18n-n
                  v-if="finalPrice"
                  class="inline-block" :value="Number(finalPrice)"
                  :format="{ key: 'currency' }"
                  :locale="getLocaleFromCurrencyCode(productVariant.price.currencyCode)"
                >
                  <template #currency="slotProps">
                    <span class="text-sm md:text-base">{{ slotProps.currency }}</span>
                  </template>
                  <template #integer="slotProps">
                    <span class="h1 cmw-font-bold !leading-none">{{ slotProps.integer }}</span>
                  </template>
                  <template #group="slotProps">
                    <span class="h1 cmw-font-bold !leading-none">{{ slotProps.group }}</span>
                  </template>
                  <template #fraction="slotProps">
                    <span class="text-sm md:text-base">{{ slotProps.fraction }}</span>
                  </template>
                </i18n-n>
                <div v-if="$cmwStore.isB2b" class="text-gray-dark">
                  iva esclusa
                </div>
                <div v-if="$cmwStore.isDe">
                  <span v-if="$cmwStore.isDe && priceByLiter" class="text-sm <md:hidden">
                    {{
                      $n(Number(priceByLiter), 'currency', getLocaleFromCurrencyCode(product.compareAtPrice.currencyCode))
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
                      v-if="product.quantityAvailable > 0" class="text-success text-center"
                      :class="{ hidden: product.quantityAvailable > 6 }"
                    >
                      {{ $t('product.available', { quantity: product.quantityAvailable }) }}
                    </p>
                  </div>
                  <div v-if="product.availableForSale" class="relative">
                    <div v-if="!amountMax">
                      <CmwButton
                        class="gap-2 pl-2 pr-3 py-2"
                        :aria-label="$t('enums.accessibility.role.ADD_TO_CART')"
                        @click.native="addProductToCustomerCheckout"
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
                          @click="removeProductFromCustomerCheckout"
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
                          @click="addProductToCustomerCheckout"
                        >
                          <VueSvgIcon class="m-auto" :data="addIcon" width="14" height="14" color="white" />
                        </button>
                      </div>
                    </div>
                    <div v-else>
                      <CmwButton
                        class="gap-2 pl-2 pr-3 py-2"
                        :aria-label="$t('enums.accessibility.role.ADD_TO_CART')"
                        @click.native="addProductToCustomerCheckout"
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
                        class="absolute grid grid-cols-[50px_auto_50px] items-center w-full h-[50px] top-0 right-0"
                        @mouseleave="isOpen = false"
                      >
                        <button
                          class="flex transition-colors w-[50px] h-[50px] bg-primary-400 rounded-l hover:(bg-primary)"
                          :aria-label="$t('enums.accessibility.role.REMOVE_FROM_CART')"
                          @click="removeProductFromCustomerCheckout"
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
                          @click="addProductToCustomerCheckout"
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
                      @click.native="() => handleShowRequestModal(productDetails.feId)"
                    >
                      <VueSvgIcon :data="emailIcon" width="30" height="auto" />
                      <span class="text-sm leading-4" v-text="isDesktop ? $t('common.cta.notifyMe') : $t('common.cta.notifyMeSm')" />
                    </CmwButton>
                  </div>
                </div>
              </div>
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
          <VendorProducts :vendor="brand.title" :tag="product.source_id" :vendor-fe-id="productDetails.brandId" />
          <RecommendedProducts :id="product.shopify_product_id" />
          <RecentProducts :current-product="product.source_id" />
        </ClientOnly>
      </div>
    </div>
  </div>
</template>
