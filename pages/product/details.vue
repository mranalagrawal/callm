<script>
import {
  computed,
  defineComponent,
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
import { mapState } from 'vuex'
import { SweetAlertToast } from '@/utilities/Swal'
import { getLocaleFromCurrencyCode, getPercent } from '@/utilities/currency'
import { useRecentProductsStore } from '@/store/recent'
import { useCustomer } from '@/store/customer'
import useShowRequestModal from '@/components/ProductBox/useShowRequestModal'
import favouriteIcon from '~/assets/svg/selections/favourite.svg'
import getArticles from '~/graphql/queries/getArticles'
import { generateKey } from '~/utilities/strings'

export default defineComponent({
  layout({ $config }) {
    return $config.STORE
  },
  setup() {
    const { i18n, $config, $graphql, $cmwRepo, error, redirect, localeLocation, $cmwGtmUtils, $productMapping } = useContext()
    const customerStore = useCustomer()
    const recentProductsStore = useRecentProductsStore()
    const { recentProducts } = storeToRefs(recentProductsStore)

    const { customer, wishlistArr, customerId, getCustomerType } = storeToRefs(customerStore)

    const { handleWishlist } = customerStore
    const route = useRoute()
    const isOpen = ref(false)
    const showRequestModal = ref(false)
    const product = ref({
      source_id: '',
      availableFeatures: [],
      details: '',
      featuredImage: { altText: '', height: 0, url: '', width: 0 },
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
      awards: [],
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

    const { handleShowRequestModal } = useShowRequestModal()

    useFetch(async ({ $sentry }) => {
      await $cmwRepo.products.getAll({
        first: 1,
        query: `tag:P${route.value.params.id}`,
      })
        .then(async ({ products = { nodes: [] } }) => {
          if (products.nodes.length > 0 && products.nodes[0].handle) {
            product.value = await $productMapping.fromShopify([products.nodes[0]])[0]

            productVariant.value = products.nodes[0].variants.nodes[0]
            productDetails.value = JSON.parse(products.nodes[0].details.value)
            productBreadcrumbs.value = JSON.parse(products.nodes[0].breadcrumbs.value)
            productBreadcrumbs.value = !Object.keys(productBreadcrumbs.value).length
              ? []
              : $productMapping.breadcrumbs(productBreadcrumbs.value[i18n.locale])

            if (route.value.params.pathMatch !== product.value.handle)
              return redirect(301, localeLocation(`/${product.value.handle}-${productDetails.value.key}.htm`))

            if (!product.value.tags.find(tag => tag === 'active'))
              return redirect(301, localeLocation(`/${productDetails.value.redirectSeoUrl[i18n.locale]}`))

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
            return error({ statusCode: 404, message: 'No results' })
          }
        }).catch((err) => {
          $sentry.captureException(new Error(`Something went wrong ${err}`))
        })
    })

    const isOnSale = computed(() => {
      if (!productVariant.value)
        return false

      return product.value.availableFeatures.includes('isInPromotion')
    })

    const strippedContent = computed(() => {
      if (productDetails.value.shortDescription[i18n.locale]) {
        return productDetails.value.shortDescription[i18n.locale]
          .replace('href', '')
          .replace('style', '')
      }

      return 'No description available.'
    })

    const finalPrice = computed(() => {
      if (!productDetails.value.feId)
        return false
      return productDetails.value.priceLists[$config.SALECHANNEL][getCustomerType.value] || 0
    })

    const isOnFavourite = computed(() => {
      return [...wishlistArr.value].includes(product.value.source_id)
    })

    const gtmProductData = computed(() => ({
      ...product.value.gtmProductData,
      price: finalPrice.value,
    }))

    const generateMetaLink = (arr = []) => {
      const hrefLangArr = !!arr.length && arr.map(el => ({
        hid: `alternate-${el[0]}`,
        rel: 'alternate',
        href: el[1],
        hreflang: el[0],
      }))

      return [
        ...hrefLangArr,
        {
          rel: 'canonical',
          href: productDetails.value.canonical,
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
      customer,
      product,
      productVariant,
      productDetails,
      productBreadcrumbs,
      isOnSale,
      isOnFavourite,
      gtmProductData,
      finalPrice,
      strippedContent,
      wishlistArr,
      brandMetaFields,
      brand,
      isOpen,
      cartIcon,
      addIcon,
      subtractIcon,
      heartIcon,
      heartFullIcon,
      favouriteIcon,
      emailIcon,
      showRequestModal,
      customerId,
      getCustomerType,
      handleWishlist,
      handleShowRequestModal,
      generateMetaLink,
    }
  },
  head: {},
  computed: {
    ...mapState('userCart', {
      userCart: 'userCart',
    }),
    isOnCart() {
      return this.userCart.find(lineItem => lineItem.productVariantId === this.productVariant.id)
    },
    cartQuantity() {
      return this.isOnCart ? this.isOnCart.quantity : 0
    },
    canAddMore() {
      return this.product.quantityAvailable - this.cartQuantity > 0
    },
  },
  methods: {
    generateKey,
    getPercent,
    getLocaleFromCurrencyCode,
    async addToUserCart() {
      this.isOpen = true

      if (!this.canAddMore) {
        await SweetAlertToast.fire({
          icon: 'warning',
          text: this.$i18n.t('common.feedback.KO.addToCartReachLimit'),
        })
        return
      }

      const totalInventory = this.product.quantityAvailable
      const id = this.product.shopify_product_variant_id
      const amount = this.finalPrice
      const amountFullPrice = Number(
        this.productVariant.compareAtPriceV2.amount,
      )

      /* data.variants.nodes[0].compareAtPriceV2 */
      const tag = this.product.tags
      const image = this.product.image.thumbnail.url
      const title = this.product.title
      this.$store.commit('userCart/addProduct', {
        id,
        singleAmount: amount,
        singleAmountFullPrice: amountFullPrice,
        tag,
        image,
        title,
        totalInventory,
        gtmProductData: this.gtmProductData,
      })
      this.flashMessage.show({
        status: '',
        message: this.$i18n.t('common.feedback.OK.cartAdded', { product: `${this.product.title}` }),
        icon: this.product.image.thumbnail.url,
        iconClass: 'bg-transparent ',
        time: 8000,
        blockClass: 'add-product-notification',
      })
    },
    async removeFromUserCart() {
      this.$store.commit('userCart/removeProduct', {
        id: this.product.shopify_product_variant_id,
      })
    },
  },
})
</script>

<template>
  <div class="mt-4 max-w-screen-xl mx-auto <md:px-4">
    <div v-if="$fetchState.error" class="relative text-center mt-12">
      <div class="md:(grid grid-cols-2 items-center)">
        <img
          class="w-3/4 mx-auto" src="https://cdn.shopify.com/s/files/1/0668/1860/5335/files/wine-stain.png?width=900"
          alt="empty-bottles"
        >
        <div class="text-left">
          <h2 class="h1 text-secondary" v-text="$t('notFoundTitle')" />
          <p class="mb-8 md:w-3/5" v-text="$t('notFoundLine')" />
        </div>
      </div>
    </div>
    <template v-else>
      <div v-if="product.title && brandMetaFields">
        <TheBreadcrumbs v-if="!!productBreadcrumbs.length" :breadcrumbs="productBreadcrumbs" />
        <div class="md:(grid grid-cols-[40%_60%] max-h-[550px] my-4)">
          <!-- Image Section -->
          <div class="relative">
            <LoadingImage
              class="h-full"
              img-classes="max-h-[350px] md:max-h-[550px] mx-auto object-contain"
              :thumbnail="product.image.thumbnail"
              :source="product.image.source"
            />
            <div class="absolute top-4 left-2">
              <ProductBoxFeature v-for="feature in product.availableFeatures" :key="generateKey(`details-feature-${feature}`)" :feature="feature" />
            </div>
            <div class="absolute bottom-0 left-2">
              <div
                v-for="(award, i) in productDetails.awards.slice(0, 4)"
                :key="`${award.id}-${i}`"
                class="flex gap-1 items-center pr-1.5"
              >
                <ProductBoxAward :award="award" />
              </div>
            </div>
            <div class="absolute transform top-4 right-8">
              <CardLapel v-if="isOnSale" variant="simple" />
            </div>
          </div>
          <!-- Content Section -->
          <div class="flex flex-col">
            <h1 class="text-secondary <md:pt-8" v-text="product.title" />
            <NuxtLink
              class="h3 w-max hover:text-primary-400"
              :to="localePath({ name: 'winery-handle', params: { handle: `${brand.handle}-${brandMetaFields.key}.htm` } })"
              prefetch
            >
              {{ product.vendor }}
            </NuxtLink>
            <div v-html="strippedContent" />
            <script
              v-if="$config.STORE === 'CMW_UK'"
              data-environment="production" src="https://osm.klarnaservices.com/lib.js"
              data-client-id="c72bae1f-0d1c-5ed1-a3bb-b0fa3d12e442"
              async
            />
            <ClientOnly>
              <klarna-placement
                v-if="$config.STORE === 'CMW_UK'"
                data-key="credit-promotion-badge"
                data-locale="en-GB"
                :data-purchase-amount="String(Number(finalPrice)).replace(/[^0-9]/g, '')"
              />
            </ClientOnly>
            <ProductDetailsVintages :sku="product.sku" />
            <div
              class="
            <md:(fixed bottom-0 left-0 w-full bg-white z-content shadow-elevation px-3 py-4)
            mt-auto flex items-end
            md:mb-8
"
            >
              <div>
                <div
                  v-if="isOnSale"
                  class="flex items-center gap-2"
                >
                  <span class="line-through text-gray text-sm">
                    {{
                      $n(Number(productVariant.compareAtPriceV2.amount),
                         'currency',
                         getLocaleFromCurrencyCode(productVariant.compareAtPriceV2.currencyCode))
                    }}
                  </span>
                  <CmwChip
                    color="secondary"
                    shape="rounded"
                    :label="`-${getPercent(finalPrice, productVariant.compareAtPriceV2.amount)}%`"
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
                    <span class="h1 font-bold !leading-none">{{ slotProps.integer }}</span>
                  </template>
                  <template #group="slotProps">
                    <span class="h1 font-bold !leading-none">{{ slotProps.group }}</span>
                  </template>
                  <template #fraction="slotProps">
                    <span class="text-sm md:text-base">{{ slotProps.fraction }}</span>
                  </template>
                </i18n-n>
              </div>
              <div class="ml-auto mr-4">
                <div class="">
                  <p
                    v-if="product.quantityAvailable > 0" class="text-success text-center"
                    :class="{ hidden: product.quantityAvailable > 6 }"
                  >
                    {{ $t('product.available', { quantity: product.quantityAvailable }) }}
                  </p>
                  <p v-else class="text-primary-400">
                    {{ $t('product.notAvailable') }}
                  </p>
                  <div v-if="product.availableForSale" class="relative">
                    <Button
                      class="gap-2 pl-2 pr-3 py-2"
                      :aria-label="$t('enums.accessibility.role.ADD_TO_CART')"
                      @click.native="addToUserCart"
                    >
                      <VueSvgIcon :data="cartIcon" color="white" width="30" height="auto" />
                      <span class="text-sm" v-text="$t('product.addToCart')" />
                    </Button>
                    <Badge
                      v-show="cartQuantity && !isOpen"
                      class="absolute top-0 left-full transform translate-x-[-50%] translate-y-[-50%]"
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
                        @click="removeFromUserCart"
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
                        @click="addToUserCart"
                      >
                        <VueSvgIcon class="m-auto" :data="addIcon" width="14" height="14" color="white" />
                      </button>
                    </div>
                  </div>
                  <div v-else>
                    <Button
                      variant="ghost"
                      class="gap-2 pl-2 pr-3 py-2"
                      :aria-label="$t('enums.accessibility.role.MODAL_OPEN')"
                      @click.native="() => handleShowRequestModal(productDetails.feId)"
                    >
                      <VueSvgIcon :data="emailIcon" width="30" height="auto" />
                      <span class="text-sm" v-text="$t('common.cta.notifyMe')" />
                    </Button>
                  </div>
                </div>
              </div>
              <button
                type="button"
                class="mb-2"
                :aria-label="isOnFavourite ? $t('enums.accessibility.role.REMOVE_FROM_WISHLIST') : $t('enums.accessibility.role.ADD_TO_WISHLIST')"
                @click="handleWishlist({ id: productDetails.id, isOnFavourite, gtmProductData: product.gtmProductData })"
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
        </div>

        <ProductDetailsTabs :product="product" :product-details="productDetails" :brand="brand" :brand-meta-fields="brandMetaFields" />

        <ClientOnly>
          <RecentProducts />
          <VendorProducts :vendor="brand.title" :tag="product.source_id" />
          <RecommendedProducts :id="product.shopify_product_id" />
        </ClientOnly>
      </div>
    </template>
  </div>
</template>
