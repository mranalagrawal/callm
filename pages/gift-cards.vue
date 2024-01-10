<script lang="ts">
import { computed, defineComponent, onMounted, ref, useContext, useFetch, useMeta } from '@nuxtjs/composition-api'
import { storeToRefs } from 'pinia'

import type { IGiftCardMapped } from '~/types/product'

import { getCountryFromStore, getLocaleFromCurrencyCode, getPercent } from '~/utilities/currency'
import addIcon from '~/assets/svg/add.svg'
import cartIcon from '~/assets/svg/cart.svg'
import emailIcon from '~/assets/svg/email.svg'
import { generateKey } from '~/utilities/strings'
import heartFullIcon from '~/assets/svg/heart-full.svg'
import heartIcon from '~/assets/svg/heart.svg'
import subtractIcon from '~/assets/svg/subtract.svg'
import { SweetAlertToast } from '~/utilities/Swal'
import { useCart } from '~/store/cart'
import { useCustomer } from '~/store/customer'

export default defineComponent({
  setup() {
    const { $cmwStore, $cmwGtmUtils, req } = useContext()
    const { customer, customerId, getCustomerType } = storeToRefs(useCustomer())
    const { cart } = storeToRefs(useCart())
    const { cartCreate, cartLinesAdd, cartLinesUpdate } = useCart()
    const isOpen = ref(false)
    const product = ref<IGiftCardMapped | null>(null)
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
    })
    const giftCardVariantSelected = ref<Record<string, any>>({ id: '' })
    const canonicalUrl = ref('')

    const amountMax = ref(50)

    const isOnCart = computed(() =>
      cart.value.lines.find(el => el.merchandise.id === giftCardVariantSelected.value.id))

    const cartQuantity = computed(() => isOnCart.value ? isOnCart.value.quantity : 0)

    const canAddMore = computed(() => ((amountMax.value - cartQuantity.value) > 0))

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

    const { fetchState } = useFetch(async ({ $cmwRepo, $productMapping, $handleApiErrors }) => {
      await $cmwRepo.products.getGiftCardByHandle({
        handle: 'gift-cards', // or by route $route.value.name,
      })
        .then(({ product: shopifyProduct }: any) => {
          product.value = shopifyProduct && $productMapping.giftCard(shopifyProduct) // set product.value here ?
        })
        .catch((err: Error) => $handleApiErrors(`Something went wrong getting gift card from Shopify ${err}`))
    })

    const strippedContent = computed(() => {
      if (product.value?.description) {
        // TODO - move in string.js utilities
        return product.value.description
          .replace('href', '')
          .replace('style', '')
      }
      return '' // empty like old.com
    })

    const generateMetaLink = (arr = []) => {
      const hrefLangArr = arr?.map(el => ({
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

    const removeProductFromCustomerCart = async () => {
      if (cartQuantity.value < 1) {
        return
      }

      const currentLineItem = cart.value.lines.find(el => el.merchandise.id === giftCardVariantSelected.value.id)

      if (!currentLineItem) {
        return
      }

      const lines = [{
        attributes: currentLineItem.attributes,
        id: currentLineItem.id,
        quantity: +currentLineItem.quantity - 1,
        merchandiseId: currentLineItem.merchandise.id,
      }]

      await cartLinesUpdate(cart.value.id, lines)
    }

    onMounted(() => {
      process.browser && $cmwGtmUtils.pushPage('product', {
        event: 'giftCardDetailView',
        ecommerce: {
          currencyCode: $cmwStore.isUk ? 'GBP' : 'EUR',
          detail: {
            products: [{ giftCard: 'undefined' }],
          },
        },
      })
    })

    useMeta(() => {
      let link: any[] = []
      const href = canonicalUrl.value ? canonicalUrl.value : ''

      if (href) {
        link = [{
          rel: 'canonical',
          href: canonicalUrl?.value,
        }]
      }

      return {
        title: product?.value?.seo?.title || '',
        meta: [
          {
            hid: 'description',
            name: 'description',
            content: product?.value?.seo?.description || '',
          },
        ],
        link,
      }
    })

    return {
      addIcon,
      amountMax,
      canAddMore,
      cart,
      cartCreate,
      cartIcon,
      cartLinesAdd,
      cartQuantity,
      customer,
      customerId,
      emailIcon,
      fetchState,
      generateMetaLink,
      getCustomerType,
      giftCardVariantSelected,
      heartFullIcon,
      heartIcon,
      isOnCart,
      isOpen,
      product,
      productDetails,
      productVariant,
      removeProductFromCustomerCart,
      strippedContent,
      subtractIcon,
    }
  },
  head: {},
  methods: {
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

      const cartInput = {
        buyerIdentity: {
          countryCode: getCountryFromStore(this.$cmwStore.settings.store),
          ...(this.customer.email && { email: this.customer.email }),
        },
        note: this.cart.note,
        lines: [{
          attributes: [
            {
              key: 'gtmProductData',
              value: this.giftCardVariantSelected.gtmProductData ? JSON.stringify(this.giftCardVariantSelected.gtmProductData) : 'false',
            },
            {
              key: 'bundle',
              value: (this.giftCardVariantSelected.tags) ? this.product?.tags.includes('BUNDLE').toString() : 'false',
            },
          ],
          quantity: 1,
          merchandiseId: this.giftCardVariantSelected.id,
        }],
      }

      if (!this.cart.id) {
        await this.cartCreate({
          ...cartInput,
          lineItems: [],
        })
      }

      this.cartLinesAdd(this.cart.id, cartInput.lines)
        .then(async () => {
          /* @ts-expect-error flashMessage doesn't seem to handle typescript */
          this.flashMessage.show({
            status: '',
            message: this.$i18n.t('common.feedback.OK.cartAdded', { product: `${this.product?.title} ${this.giftCardVariantSelected.title}` }),
            icon: this.product?.image.source.url,
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
  <div class="mt-4 max-w-screen-xl mx-auto <md:px-4">
    <div v-if="fetchState?.pending" :class="fetchState?.pending" class="sr-only" />
    <div v-else-if="fetchState?.error" class="relative text-center mt-12">
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
      <div v-if="product?.title">
        <TheBreadcrumbs v-if="product.breadcrumbs" :breadcrumbs="product.breadcrumbs" />

        <div class="md:(grid grid-cols-[40%_60%] max-h-[550px] my-4)">
          <!-- Image Section -->
          <div class="relative">
            <LoadingImage
              v-if="product?.image"
              class="h-full"
              img-classes="max-h-[350px] md:max-h-[550px] mx-auto object-contain"
              :thumbnail="product.image?.thumbnail"
              :source="product.image?.source"
            />
          </div>
          <!-- Content Section -->
          <div class="flex flex-col">
            <h1 class="text-secondary <md:pt-8" v-text="product?.title" />

            <div v-html="strippedContent" />
            <div>
              <div class="py-4 h4" v-text="$t('chooseGiftCard')" />
              <div class="items-center mr-auto gap-2 flex flex-wrap">
                <div
                  v-for="variant in product?.variants"
                  :key="variant.id"
                  class="relative"
                >
                  <input
                    :id="variant.id"
                    v-model="giftCardVariantSelected"
                    :aria-label="`select ${variant.title}`"
                    class="peer appearance-none absolute w-full h-full z-dante"
                    type="radio"
                    name="layout"
                    :value="variant"
                  >
                  <label
                    :for="variant.id"
                    class="btn-base btn-base-spacing text-sm cursor-pointer border-primary-400 text-primary-400 cmw-font-bold uppercase
                     hover:(bg-primary-50)"
                    :class="{ 'bg-primary-400': variant.id === giftCardVariantSelected.id }"
                  >
                    <i18n-n
                      class="flex items-end leading-none"
                      :class="{ 'text-white': variant.id === giftCardVariantSelected.id }"
                      :value="Number(variant.price.amount)" :format="{ key: 'currency' }"
                      :locale="getLocaleFromCurrencyCode(variant.price.currencyCode)"
                    >
                      <template #currency="slotProps">
                        <span class="text-sm md:text-base">{{ slotProps.currency }}</span>
                      </template>
                      <template #integer="slotProps">
                        <span class="text-2xl">{{ slotProps.integer }}</span>
                      </template>
                      <template #group="slotProps">
                        <span>{{ slotProps.group }}</span>
                      </template>
                      <template #fraction="slotProps">
                        <span>{{ slotProps.fraction }}</span>
                      </template>
                    </i18n-n>
                  </label>
                </div>
              </div>
            </div>
            <div
              class="
            <md:(fixed bottom-0 left-0 w-full bg-white z-content shadow-elevation px-3 py-4)
            mt-auto flex items-end
            md:mb-8
"
            >
              <i18n-n
                v-if="giftCardVariantSelected.id"
                class="inline-block" :value="Number(giftCardVariantSelected.price.amount)"
                :format="{ key: 'currency' }"
                :locale="getLocaleFromCurrencyCode(giftCardVariantSelected.price.currencyCode)"
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
              <div class="ml-auto mr-4">
                <div class="">
                  <div v-if="product?.availableForSale" class="relative">
                    <CmwButton
                      class="gap-2 pl-2 pr-3 py-2"
                      :aria-label="$t('enums.accessibility.role.ADD_TO_CART')"
                      :disabled="!giftCardVariantSelected.id"
                      @click.native="addProductToCustomerCart"
                    >
                      <VueSvgIcon :data="cartIcon" color="white" width="30" height="auto" />
                      <span class="text-sm" v-text="$t('common.cta.addToCart')" />
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
                        :aria-label="$t('enums.accessibility.role.ADD_TO_CART')"
                        @click="addProductToCustomerCart"
                      >
                        <VueSvgIcon class="m-auto" :data="addIcon" width="14" height="14" color="white" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ClientOnly>
          <RecommendedProducts v-if="product?.shopify_product_id" :id="product?.shopify_product_id" />
          <RecentProducts :current-product="product?.id" />
        </ClientOnly>
      </div>
    </template>
  </div>
</template>
