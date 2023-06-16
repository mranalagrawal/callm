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

    useFetch(async ({ $cmwRepo, $productMapping, $handleApiErrors }) => {
      await $cmwRepo.products.getGiftCardByHandle({
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
        tag: this.giftCardVariantSelected.tags || [],
        image: this.product.image.source.url,
        title: this.giftCardVariantSelected.title,
        totalInventory: 999, // TODO da discutere
        gtmProductData: { giftCard: this.giftCardVariantSelected.price.amount },
      })

      this.flashMessage.show({
        status: '',
        message: this.$i18n.t('common.feedback.OK.cartAdded', { product: `${this.product.title} ${this.giftCardVariantSelected.title}` }),
        icon: this.product.image.source.url,
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
      <div v-if="product.title">
        <TheBreadcrumbs v-if="product.breadcrumbs" :breadcrumbs="product.breadcrumbs" />

        <div class="md:(grid grid-cols-[40%_60%] max-h-[550px] my-4)">
          <!-- Image Section -->
          <div class="relative">
            <LoadingImage
              class="h-full"
              img-classes="max-h-[350px] md:max-h-[550px] mx-auto object-contain"
              :thumbnail="product.image.thumbnail"
              :source="product.image.source"
            />
          </div>
          <!-- Content Section -->
          <div class="flex flex-col">
            <h1 class="text-secondary <md:pt-8" v-text="product.title" />

            <div v-html="strippedContent" />
            <div>
              <div class="py-4 h4" v-text="$t('search.chooseGiftCard')" />
              <div class="items-center mr-auto gap-2 flex">
                <div
                  v-for="variant in product.variants"
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
                    class="btn-base btn-base-spacing text-sm cursor-pointer border-primary-400 text-primary-400 font-bold uppercase
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
                  <span class="h1 font-bold !leading-none">{{ slotProps.integer }}</span>
                </template>
                <template #group="slotProps">
                  <span class="h1 font-bold !leading-none">{{ slotProps.group }}</span>
                </template>
                <template #fraction="slotProps">
                  <span class="text-sm md:text-base">{{ slotProps.fraction }}</span>
                </template>
              </i18n-n>
              <div class="ml-auto mr-4">
                <div class="">
                  <div v-if="product.availableForSale" class="relative">
                    <Button
                      class="gap-2 pl-2 pr-3 py-2"
                      :aria-label="$t('enums.accessibility.role.ADD_TO_CART')"
                      :disabled="!giftCardVariantSelected.id"
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
                        :aria-label="$t('enums.accessibility.role.ADD_TO_CART')"
                        @click="addToUserCart"
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
          <RecentProducts />
          <RecommendedProducts :id="product.id" />
        </ClientOnly>
      </div>
    </template>
  </div>
</template>
