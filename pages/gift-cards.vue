<script>
import {
  computed,
  defineComponent, onMounted,
  ref, useContext,
  useFetch,
  useMeta,
} from '@nuxtjs/composition-api'
import addIcon from 'assets/svg/add.svg'
import cartIcon from 'assets/svg/cart.svg'
import heartFullIcon from 'assets/svg/heart-full.svg'
import heartIcon from 'assets/svg/heart.svg'
import subtractIcon from 'assets/svg/subtract.svg'
import emailIcon from 'assets/svg/email.svg'
import { storeToRefs } from 'pinia'
import { mapState } from 'vuex'
import { generateKey } from '~/utilities/strings'
import { getLocaleFromCurrencyCode, getPercent } from '@/utilities/currency'
import { useCustomer } from '@/store/customer'

export default defineComponent({
  layout({ $config }) {
    return $config.STORE
  },
  setup() {
    const { $config, $cmwGtmUtils } = useContext()
    const customerStore = useCustomer()
    const { customer, customerId, getCustomerType } = storeToRefs(customerStore)
    const isOpen = ref(false)
    const product = ref({})
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
    const giftCardVariantSelected = ref({ id: '' }) // set a default?

    useFetch(async ({ $cmwRepo, $productMapping, $i18n, $handleApiErrors }) => {
      await $cmwRepo.products.getGiftCardByHandle({
        lang: $i18n.locale,
        handle: 'gift-cards', // or by route $route.value.name,
      })
        .then(({ product: shopifyProduct }) => {
          product.value = $productMapping.giftCard(shopifyProduct) // set product.value here ?
        })
        .catch(err => $handleApiErrors(`Something went wrong getting gift card from Shopify ${err}`))
    })

    const strippedContent = computed(() => {
      if (product.value.description) {
        // TODO - move in string.js utilities
        return product.value.description
          .replace('href', '')
          .replace('style', '')
      }
      return 'No description available.'
    })

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

    onMounted(() => {
      process.browser && $cmwGtmUtils.pushPage('product', {
        event: 'giftCardDetailView',
        ecommerce: {
          currencyCode: $config.STORE === 'CMW_UK' ? 'GBP' : 'EUR',
          detail: {
            products: [{ giftCard: 'undefined' }],
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
      link: product.value.href,
    }))
    return {
      customer,
      product,
      productVariant,
      productDetails,
      giftCardVariantSelected,
      strippedContent,
      isOpen,
      cartIcon,
      addIcon,
      subtractIcon,
      heartIcon,
      heartFullIcon,
      emailIcon,
      customerId,
      getCustomerType,
      generateMetaLink,
    }
  },
  head: {},
  computed: {
    ...mapState('userCart', {
      userCart: 'userCart',
    }),
    isOnCart() {
      return this.userCart.find(lineItem => lineItem.productVariantId === this.giftCardVariantSelected.id)
    },
    cartQuantity() {
      return this.isOnCart ? this.isOnCart.quantity : 0
    },
  },
  methods: {
    generateKey,
    getPercent,
    getLocaleFromCurrencyCode,
    async addToUserCart() {
      this.isOpen = true

      this.$store.commit('userCart/addProduct', {
        id: this.giftCardVariantSelected.id,
        singleAmount: parseFloat(this.giftCardVariantSelected.price.amount),
        singleAmountFullPrice: (this.giftCardVariantSelected.compareAtPrice)
          ? parseFloat(this.giftCardVariantSelected.compareAtPrice.amount)
          : parseFloat(this.giftCardVariantSelected.price.amount),
        tag: null, // TODO. a cosa serve nel cart/checkout, nella gift card probabilmente non c'è
        image: this.product.image.thumbnail.url,
        title: this.giftCardVariantSelected.title,
        totalInventory: 999, // TODO da discutere
        gtmProductData: { giftCard: this.giftCardVariantSelected.price.amount },
      })

      this.flashMessage.show({
        status: '',
        message: this.$i18n.t('common.feedback.OK.cartAdded', { product: `${this.product.title} ${this.giftCardVariantSelected.title}` }),
        icon: this.product.image.thumbnail.url,
        iconClass: 'bg-transparent ',
        time: 8000,
        blockClass: 'add-product-notification',
      })
    },
    async removeFromUserCart() {
      this.$store.commit('userCart/removeProduct', {
        id: this.giftCardVariantSelected.id,
        gtmProductData: { giftCard: this.giftCardVariantSelected.price.amount },
      })
    },
  },
})
</script>

<template>
  <div class="cmw-mt-4 cmw-max-w-screen-xl cmw-mx-auto <md:cmw-px-4">
    <div v-if="$fetchState.error" class="cmw-relative cmw-text-center cmw-mt-12">
      <div class="md:(cmw-grid cmw-grid-cols-2 cmw-items-center)">
        <img
          class="cmw-w-3/4 cmw-mx-auto" :src="require('assets/images/wine-stain.png')"
          alt="empty-bottles"
        >
        <div class="cmw-text-left">
          <h2 class="cmw-h1 cmw-text-secondary" v-text="$t('notFoundTitle')" />
          <p class="cmw-mb-8 md:cmw-w-3/5" v-text="$t('notFoundLine')" />
        </div>
      </div>
    </div>
    <template v-else>
      <div v-if="product.title">
        <TheBreadcrumbs v-if="product.breadcrumbs" :breadcrumbs="product.breadcrumbs" />

        <div class="md:(cmw-grid cmw-grid-cols-[40%_60%] cmw-max-h-[550px] cmw-my-4)">
          <!-- Image Section -->
          <div class="cmw-relative">
            <LoadingImage
              class="cmw-h-full"
              img-classes="cmw-max-h-[350px] md:cmw-max-h-[550px] cmw-mx-auto cmw-object-contain"
              :thumbnail="product.image.thumbnail"
              :source="product.image.source"
            />
          </div>
          <!-- Content Section -->
          <div class="cmw-flex cmw-flex-col">
            <h1 class="cmw-text-secondary <md:cmw-pt-8" v-text="product.title" />

            <div v-html="strippedContent" />
            <div>
              <div class="cmw-items-center cmw-mr-auto cmw-gap-2 cmw-flex">
                <div
                  v-for="variant in product.variants"
                  :key="variant.id"
                  class="cmw-relative"
                >
                  <input
                    :id="variant.id"
                    v-model="giftCardVariantSelected"
                    :aria-label="`select ${variant.title}`"
                    class="peer cmw-appearance-none cmw-absolute cmw-w-full cmw-h-full cmw-z-dante"
                    type="radio"
                    name="layout"
                    :value="variant"
                  >
                  <label
                    :for="variant.id"
                    class="
              cmw-flex cmw-rounded-sm cmw-shadow cmw-p-[0.40rem] cmw-mb-0 cmw-bg-white cmw-cursor-pointer
              peer-checked:(cmw-bg-gray-lightest cmw-shadow-none)"
                  >
                    <i18n-n
                      class="cmw-flex cmw-items-end cmw-leading-none"
                      :class="{ 'cmw-text-primary': variant.id === giftCardVariantSelected.id }"
                      :value="Number(variant.price.amount)" :format="{ key: 'currency' }"
                      :locale="getLocaleFromCurrencyCode(variant.price.currencyCode)"
                    >
                      <template #currency="slotProps">
                        <span class="cmw-text-sm md:cmw-text-base">{{ slotProps.currency }}</span>
                      </template>
                      <template #integer="slotProps">
                        <span class="cmw-text-2xl">{{ slotProps.integer }}</span>
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
            <md:(cmw-fixed cmw-bottom-0 cmw-left-0 cmw-w-full cmw-bg-white cmw-z-content cmw-shadow-elevation cmw-px-3 cmw-py-4)
            cmw-mt-auto cmw-flex cmw-items-end
            md:cmw-mb-8
"
            >
              <i18n-n
                v-if="giftCardVariantSelected.id"
                class="cmw-inline-block" :value="Number(giftCardVariantSelected.price.amount)"
                :format="{ key: 'currency' }"
                :locale="getLocaleFromCurrencyCode(giftCardVariantSelected.price.currencyCode)"
              >
                <template #currency="slotProps">
                  <span class="cmw-text-sm md:cmw-text-base">{{ slotProps.currency }}</span>
                </template>
                <template #integer="slotProps">
                  <span class="cmw-h1 cmw-font-bold !cmw-leading-none">{{ slotProps.integer }}</span>
                </template>
                <template #group="slotProps">
                  <span class="cmw-h1 cmw-font-bold !cmw-leading-none">{{ slotProps.group }}</span>
                </template>
                <template #fraction="slotProps">
                  <span class="cmw-text-sm md:cmw-text-base">{{ slotProps.fraction }}</span>
                </template>
              </i18n-n>
              <div class="cmw-ml-auto cmw-mr-4">
                <div class="">
                  <div v-if="product.availableForSale" class="cmw-relative">
                    <Button
                      class="cmw-gap-2 cmw-pl-2 cmw-pr-3 cmw-py-2"
                      :aria-label="$t('enums.accessibility.role.ADD_TO_CART')"
                      :disabled="!giftCardVariantSelected.id"
                      @click.native="addToUserCart"
                    >
                      <VueSvgIcon :data="cartIcon" color="white" width="30" height="auto" />
                      <span class="cmw-text-sm" v-text="$t('product.addToCart')" />
                    </Button>
                    <Badge
                      v-show="cartQuantity && !isOpen"
                      class="cmw-absolute cmw-top-0 cmw-left-full cmw-transform cmw-translate-x-[-50%] cmw-translate-y-[-50%]"
                      bg-color="primary-400" :qty="cartQuantity"
                    />
                    <div
                      v-show="isOpen"
                      class="cmw-absolute cmw-grid cmw-grid-cols-[50px_auto_50px] cmw-items-center cmw-w-full cmw-h-[50px] cmw-top-0 cmw-left-0"
                      @mouseleave="isOpen = false"
                    >
                      <button
                        class="cmw-flex cmw-transition-colors cmw-w-[50px] cmw-h-[50px] cmw-bg-primary-400 cmw-rounded-l hover:(cmw-bg-primary)"
                        :aria-label="$t('enums.accessibility.role.REMOVE_FROM_CART')"
                        @click="removeFromUserCart"
                      >
                        <VueSvgIcon class="cmw-m-auto" :data="subtractIcon" width="14" height="14" color="white" />
                      </button>
                      <div class="cmw-flex cmw-h-[40px] cmw-bg-primary-400 cmw-text-white text-center">
                        <span class="cmw-m-auto cmw-text-sm">{{ cartQuantity }}</span>
                      </div>
                      <button
                        class="cmw-flex cmw-transition-colors cmw-w-[50px] cmw-h-[50px] cmw-bg-primary-400 cmw-rounded-r
                        hover:(cmw-bg-primary)
                        disabled:(cmw-bg-primary-100 cmw-cursor-not-allowed)"
                        :aria-label="$t('enums.accessibility.role.ADD_TO_CART')"
                        @click="addToUserCart"
                      >
                        <VueSvgIcon class="cmw-m-auto" :data="addIcon" width="14" height="14" color="white" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ClientOnly>
          <RecentProducts />
          <RecommendedProducts :id="product.id" />
        </ClientOnly>
      </div>
    </template>
  </div>
</template>
