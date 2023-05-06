<script>
import { computed, ref, useContext, useRoute, useRouter } from '@nuxtjs/composition-api'
import { storeToRefs } from 'pinia'
import heartIcon from 'assets/svg/heart.svg'
import heartFullIcon from 'assets/svg/heart-full.svg'
import cartIcon from 'assets/svg/cart.svg'
import addIcon from 'assets/svg/add.svg'
import subtractIcon from 'assets/svg/subtract.svg'
import emailIcon from 'assets/svg/email.svg'
import { mapState } from 'vuex'
import { cleanRoutesLocales, stripHtml } from '@/utilities/strings'
import useShowRequestModal from '@/components/ProductBox/useShowRequestModal'
import { productFeatures } from '@/utilities/mappedProduct'
import { useCustomer } from '~/store/customer'
import { pick } from '@/utilities/arrays'
import { isObject } from '~/utilities/validators'
import { getCountryFromStore, getLocaleFromCurrencyCode } from '~/utilities/currency'
import { SweetAlertToast } from '~/utilities/Swal'
// noinspection JSUnusedGlobalSymbols
export default {
  name: 'ProductBoxHorizontalElastic',
  props: {
    /** @Type: {ProductVariantType.ProductVariant} */
    product: {
      required: true,
      validator(value) {
        return isObject(value)
      },
    },
    position: {
      type: [String, Number],
      default: '',
    },
  },
  setup(props) {
    const { $config, localeLocation, $gtm } = useContext()
    const customerStore = useCustomer()
    const { wishlistArr, getCustomerType } = storeToRefs(customerStore)
    const { handleWishlist } = customerStore
    const { handleShowRequestModal } = useShowRequestModal()
    const router = useRouter()
    const route = useRoute()

    const isOpen = ref(false)
    const showRequestModal = ref(false)
    const isHovering = ref(false)

    const availableFeatures = computed(() => {
      /* Todo: Definitely we need to use some enums here ... */
      let features = pick(props.product.details, productFeatures)

      features = Object.keys(features)
        .reduce((o, key) => {
          if (typeof features[key] === 'object')
            !!features[key][$config.SALECHANNEL] && (o[key] = features[key])
          else
            features[key] === true && (o[key] = features[key])

          return o
        }, {})

      return Object.keys(features).slice(0, 4)
    })

    const isOnFavourite = computed(() => wishlistArr.value.includes(`P${props.product.details.feId}`))
    const isOnSale = computed(() => availableFeatures.value.includes('isInPromotion'))
    const finalPrice = computed(() => props.product.priceLists[$config.SALECHANNEL][getCustomerType.value] || 0)
    const gtmProductData = computed(() => ({
      ...props.product.gtmProductData,
      price: finalPrice.value,
    }))
    const handleWishlistClick = () => {
      handleWishlist({ id: `P${props.product.details.feId}`, isOnFavourite: isOnFavourite.value, gtmProductData: gtmProductData.value })
    }

    const handleProductCLick = () => {
      $gtm.push({
        event: 'productClick',
        ecommerce: {
          currencyCode: $nuxt.$config.STORE === 'CMW_UK' ? 'GBP' : 'EUR',
          click: {
            actionField: { list: Object.keys(route.value.query).includes('search') ? 'search_results' : (route.value.meta?.actionField || cleanRoutesLocales(route.value.name)) },
            products: [{
              ...props.product.gtmProductData,
              price: finalPrice.value,
              position: props.position,
            }],
          },
        },
      })

      router.push(localeLocation(props.product.url))
    }

    return {
      wishlistArr,
      availableFeatures,
      isOnFavourite,
      isOnSale,
      getCustomerType,
      heartIcon,
      heartFullIcon,
      cartIcon,
      emailIcon,
      gtmProductData,
      addIcon,
      subtractIcon,
      isOpen,
      showRequestModal,
      isHovering,
      finalPrice,
      handleWishlist,
      handleWishlistClick,
      handleProductCLick,
      handleShowRequestModal,
    }
  },
  computed: {
    ...mapState('userCart', {
      userCart: 'userCart',
    }),
    isOnCart() {
      return this.userCart.find(lineItem => lineItem.productVariantId === this.product.shopify_product_variant_id)
    },
    cartQuantity() {
      return this.isOnCart ? this.isOnCart.quantity : 0
    },
    canAddMore() {
      return this.product.quantityAvailable - this.cartQuantity > 0
    },
    awardsMapped() {
      return this.product.awards.slice(0, 4).map(award => ({
        ...award,
        title: award[`name_${this.$i18n.locale}`],
        quote: {
          it: award.quote_it,
          en: award.quote_en,
          fr: award.quote_fr,
          de: award.quote_de,
        },
      }))
    },
  },
  methods: {
    stripHtml,
    getLocaleFromCurrencyCode,
    getCountryFromStore,
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
      const amountFullPrice = Number(this.product.compareAtPrice.amount)
      const tag = `P${this.product.details.feId}`
      const image = this.product.image.source.url
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
        message: `${this.product.title} è stato aggiunto al carrello!`,
        icon: this.product.image.source.url,
        iconClass: 'bg-transparent ',
        time: 8000,
        blockClass: 'add-product-notification',
      })
    },
    async removeFromUserCart() {
      this.$store.commit('userCart/removeProduct', {
        id: this.product.shopify_product_variant_id,
        gtmProductData: this.product.gtmProductData,
      })
    },
  },
}
</script>

<template>
  <div
    class="cmw-relative cmw-transition cmw-transition-box-shadow cmw-bg-white cmw-rounded-sm cmw-border cmw-border-gray-light cmw-p-2 cmw-grid cmw-grid-cols-[220px_auto_320px]
hover:cmw-shadow-elevation"
    :data-sku="product.sku"
  >
    <!-- Image Section -->
    <div class="cmw-relative cmw-p-2">
      <ClientOnly>
        <button class="cmw-block cmw-mx-auto" @click="handleProductCLick">
          <LoadingImage
            class="cmw-filter hover:cmw-contrast-150 cmw-mx-auto cmw-mt-4"
            :class="{ 'cmw-opacity-50': !product.availableForSale }"
            :thumbnail="product.image.thumbnail"
            :source="product.image.source"
            img-classes="cmw-w-full cmw-h-auto"
          />
        </button>
      </ClientOnly>
      <div class="cmw-absolute cmw-top-4 cmw-left-2 cmw-flex cmw-flex-col cmw-gap-y-1">
        <!-- Todo: create a global tooltip that change position base on mouse position -->
        <ProductBoxFeature v-for="feature in availableFeatures" :key="feature" :feature="feature" />
      </div>
      <button
        type="button"
        class="cmw-absolute cmw-top-4 cmw-right-2"
        :aria-label="isOnFavourite ? $t('enums.accessibility.role.REMOVE_FROM_WISHLIST') : $t('enums.accessibility.role.ADD_TO_WISHLIST')"
        @click="handleWishlistClick"
      >
        <VueSvgIcon
          color="#d94965"
          width="32"
          height="32"
          :data="isOnFavourite ? heartFullIcon : heartIcon"
        />
      </button>
    </div>
    <!-- Content Section -->
    <div class="cmw-p-2">
      <div class="h4 cmw-mt-4">
        <button
          class="cmw-text-body hover:(cmw-text-primary-400 cmw-no-underline)"
          @click="handleProductCLick"
          v-text="product.title"
        />
      </div>
      <!-- <div>TODO: RATING STARS </div> -->
      <div class="cmw-flex cmw-gap-3 cmw-my-8">
        <div
          v-for="(award, i) in awardsMapped"
          :key="`${award.id}-${i}`"
          class="cmw-flex cmw-gap-1 cmw-items-center cmw-pr-1.5"
          :class="{ 'cmw-border-r cmw-border-r-gray': ((i + 1) < awardsMapped.length) }"
        >
          <ProductBoxAward :award="award" />
        </div>
      </div>
      <div
        class="cmw-grid cmw-gap-x-8 cmw-gap-y-2 cmw-my-8 cmw-grid-cols-[auto_1fr] cmw-text-sm"
        :class="{ 'cmw-opacity-50': !product.availableForSale }"
      >
        <div
          class="cmw-font-bold"
          v-text="$t('product.vines')"
        />
        <div>{{ product.details.grapes }}</div>
        <div
          class="cmw-font-bold"
          v-text="$t('product.region')"
        />
        <div>{{ product.details.regionname }}</div>
        <div
          class="cmw-font-bold"
          v-text="$t('product.format')"
        />
        <div>
          <!-- FixMe: Backend needs to send the right data -->
          {{ product.details.sizes[`identifier_${$i18n.locale}`].split('|')[1] }}
        </div>
      </div>
      <div
        class="c-productBox__desc cmw-mb-4 cmw-line-clamp-5"
        :class="{ 'cmw-opacity-50': !product.availableForSale }"
        v-html="product.details.description && stripHtml(product.details.description)"
      />
    </div>
    <!-- CTA Section -->
    <div class="cmw-relative cmw-flex">
      <div class="cmw-m-auto cmw-text-center cmw-w-full px-4">
        <p
          v-if="!!product.quantityAvailable && product.quantityAvailable < 6"
          class="cmw-overline-2 cmw-text-success cmw-font-medium cmw-text-center cmw-uppercase"
          v-text="$t('product.available', { quantity: product.quantityAvailable })"
        />

        <span
          v-if="isOnSale"
          class="cmw-line-through cmw-text-gray cmw-text-sm cmw-mr-3"
        >
          {{ $n(Number(product.compareAtPrice.amount), 'currency', getLocaleFromCurrencyCode($config.STORE === "CMW_UK" ? "GBP" : "EUR")) }}
        </span>
        <i18n-n
          v-if="finalPrice"
          class="cmw-inline-block" :value="Number(finalPrice)" :format="{ key: 'currency' }"
          :locale="getLocaleFromCurrencyCode($config.STORE === 'CMW_UK' ? 'GBP' : 'EUR')"
        >
          <template #currency="slotProps">
            <span class="cmw-text-sm md:cmw-text-base">{{ slotProps.currency }}</span>
          </template>
          <template #integer="slotProps">
            <span class="cmw-h1 cmw-font-bold">{{ slotProps.integer }}</span>
          </template>
          <template #group="slotProps">
            <span class="cmw-h1 cmw-font-bold">{{ slotProps.group }}</span>
          </template>
          <template #fraction="slotProps">
            <span class="cmw-text-sm md:cmw-text-base">{{ slotProps.fraction }}</span>
          </template>
        </i18n-n>
        <div v-if="product.availableForSale" class="cmw-relative">
          <Button
            class="cmw-gap-2 cmw-pl-2 cmw-pr-3 cmw-py-2"
            :aria-label="$t('enums.accessibility.role.ADD_TO_CART')"
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
              :disabled="!canAddMore"
              :aria-label="!canAddMore ? '' : $t('enums.accessibility.role.ADD_TO_CART')"
              @click="addToUserCart"
            >
              <VueSvgIcon class="cmw-m-auto" :data="addIcon" width="14" height="14" color="white" />
            </button>
          </div>
        </div>
        <div v-else>
          <Button
            variant="ghost"
            class="cmw-gap-2 cmw-pl-2 cmw-pr-3 cmw-py-2"
            :aria-label="$t('enums.accessibility.role.MODAL_OPEN')"
            @click.native="() => handleShowRequestModal(product.details.feId)"
          >
            <VueSvgIcon :data="emailIcon" width="30" height="auto" />
            <span class="cmw-text-sm" v-text="$t('common.cta.notifyMe')" />
          </Button>
        </div>
      </div>
      <div class="cmw-absolute cmw-transform cmw-top-px cmw-left-1/2 cmw-translate-x-[-50%] cmw-translate-y-[-50%]">
        <CardLapel v-if="isOnSale" />
      </div>
    </div>
    <div
      v-if="!product.availableForSale"
      class="cmw-absolute cmw-transform cmw-bg-black/70 cmw-rounded cmw-top-1/2 cmw-left-12 cmw-translate-y-[-50%] cmw-py-4 cmw-px-24 cmw-overline-2 cmw-uppercase cmw-text-white"
      v-text="$t('product.notAvailable2')"
    />
  </div>
</template>

<style scoped>
/* FixMe: Temporary fix till we decide what to do with this section */
.c-productBox__desc a {
  color: theme('colors.success');
}
</style>
