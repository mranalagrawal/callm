<script>
import { computed, ref, useContext, useRouter } from '@nuxtjs/composition-api'
import { storeToRefs } from 'pinia'
import heartIcon from 'assets/svg/heart.svg'
import heartFullIcon from 'assets/svg/heart-full.svg'
import cartIcon from 'assets/svg/cart.svg'
import addIcon from 'assets/svg/add.svg'
import subtractIcon from 'assets/svg/subtract.svg'
import emailIcon from 'assets/svg/email.svg'
import { mapState } from 'vuex'
import useShowRequestModal from '@/components/ProductBox/useShowRequestModal'
import { productFeatures } from '~/utilities/mappedProduct'
import { useCustomer } from '~/store/customer'
import { pick } from '@/utilities/arrays'
import { isObject, regexRules } from '~/utilities/validators'
import { getCountryFromStore, getLocaleFromCurrencyCode } from '~/utilities/currency'
import { SweetAlertToast } from '~/utilities/Swal'
// noinspection JSUnusedGlobalSymbols
export default {
  name: 'ProductBoxVertical',
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
    const { $config, localeLocation, $gtm, $cmwGtmUtils } = useContext()
    const customerStore = useCustomer()
    const { wishlistArr, getCustomerType } = storeToRefs(customerStore)
    const { handleWishlist } = customerStore
    const { handleShowRequestModal } = useShowRequestModal()
    const router = useRouter()

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

    const isOnFavourite = computed(() => wishlistArr.value.includes(props.product.details.key))
    const isOnSale = computed(() => availableFeatures.value.includes('isInPromotion'))
    const finalPrice = computed(() => props.product.priceLists[$config.SALECHANNEL][getCustomerType.value] || 0)
    const gtmProductData = computed(() => ({
      ...props.product.gtmProductData,
      price: finalPrice.value,
    }))
    const handleWishlistClick = () => {
      handleWishlist({ id: props.product.details.key, isOnFavourite: isOnFavourite.value, gtmProductData: gtmProductData.value })
    }

    const handleProductCLick = () => {
      $gtm.push({
        event: 'productClick',
        ecommerce: {
          currencyCode: $nuxt.$config.STORE === 'CMW_UK' ? 'GBP' : 'EUR',
          click: {
            actionField: $cmwGtmUtils.getActionField(),
            products: [{
              ...props.product.gtmProductData,
              price: finalPrice.value,
              position: props.position,
            }],
          },
        },
      })

      $cmwGtmUtils.resetDatalayerFields(['ecommerce', 'actionField', 'impressions', 'pageType'])

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
  },
  methods: {
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
      const tag = this.product.tags.find(tag => new RegExp(regexRules('isProduct')).test(tag))
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
      })
    },
  },
}
</script>

<template>
  <div
    v-if="product.shopify_product_id"
    class="
    c-productBox cmw-relative cmw-transition cmw-transition-box-shadow cmw-bg-white cmw-rounded-sm cmw-border cmw-border-gray-light
    hover:cmw-shadow-elevation"
    :data-sku="product.sku"
    @mouseenter="isHovering = true"
    @mouseleave="isHovering = false"
  >
    <div class="c-productBox__grid cmw-grid cmw-h-full">
      <div class="c-productBox__image">
        <ClientOnly>
          <button class="cmw-block cmw-mx-auto" @click="handleProductCLick">
            <LoadingImage
              class="cmw-filter hover:cmw-contrast-150 cmw-mx-auto cmw-mt-4"
              :class="{ 'cmw-opacity-50': !product.availableForSale }"
              :thumbnail="product.image.thumbnail"
              :source="product.image.source"
              wrapper="span"
            />
          </button>
        </ClientOnly>
      </div>
      <div class="c-productBox__features cmw-py-2 cmw-pl-2">
        <div class="cmw-flex cmw-flex-col cmw-gap-y-1 cmw-w-max">
          <ProductBoxFeature v-for="feature in availableFeatures" :key="feature" :feature="feature" />
        </div>
      </div>
      <div class="c-productBox__awards cmw-place-self-end">
        <div
          v-for="(award, i) in product.awards.slice(0, 4)"
          :key="`${award.id}-${i}`"
          class="cmw-flex cmw-gap-1 cmw-items-center cmw-pr-1.5"
        >
          <ProductBoxAward :award="award" />
        </div>
      </div>
      <div class="c-productBox__wishlist cmw-place-self-end cmw-relative">
        <ButtonIcon
          :icon="isOnFavourite ? heartFullIcon : heartIcon"
          class="z-baseLow" :variant="isOnFavourite ? 'icon-primary' : 'icon'"
          :aria-label="isOnFavourite ? $t('enums.accessibility.role.REMOVE_FROM_WISHLIST') : $t('enums.accessibility.role.ADD_TO_WISHLIST')"
          @click.native="handleWishlistClick"
        />
      </div>
      <div class="c-productBox__title">
        <div class="cmw-mx-4 cmw-mt-4 cmw-min-h-[4.6em]">
          <button
            class="cmw-text-body cmw-text-left hover:(cmw-text-primary-400 cmw-no-underline)"
            @click="handleProductCLick"
            v-text="product.title"
          />
        </div>
      </div>
      <div class="c-productBox__price cmw-justify-self-start cmw-self-end">
        <div class="cmw-flex cmw-flex-col cmw-ml-4 cmw-mb-4">
          <span
            v-if="isOnSale"
            class="cmw-line-through cmw-text-gray cmw-text-sm"
          >
            {{
              $n(Number(product.compareAtPrice.amount), 'currency', getLocaleFromCurrencyCode(product.compareAtPrice.currencyCode))
            }}
          </span>
          <i18n-n
            v-if="finalPrice"
            class="cmw-inline-block" :value="finalPrice" :format="{ key: 'currency' }"
            :locale="getLocaleFromCurrencyCode(product.compareAtPrice.currencyCode)"
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
        </div>
      </div>
      <div class="c-productBox__cart cmw-place-self-end">
        <div v-if="product.availableForSale" class="cmw-mr-4 cmw-mb-4 cmw-relative">
          <ButtonIcon
            :icon="cartIcon"
            :aria-label="$t('enums.accessibility.role.ADD_TO_CART')"
            @click.native="addToUserCart"
          />
          <Badge
            v-show="cartQuantity && !isOpen"
            class="cmw-absolute cmw-top-0 cmw-left-full cmw-transform cmw-translate-x-[-50%] cmw-translate-y-[-50%]"
            bg-color="primary-400" :qty="cartQuantity"
          />
          <div
            v-show="isOpen"
            class="cmw-absolute cmw-w-full cmw-h-[120px] cmw-bottom-0 cmw-left-0"
            @mouseleave="isOpen = false"
          >
            <button
              class="cmw-flex cmw-transition-colors cmw-w-[40px] cmw-h-[40px] cmw-bg-primary-400 cmw-rounded-t-sm
               hover:(cmw-bg-primary)
               disabled:(cmw-bg-primary-100 cmw-cursor-not-allowed)"
              :disabled="!canAddMore"
              :aria-label="!canAddMore ? '' : $t('enums.accessibility.role.ADD_TO_CART')"
              @click="addToUserCart"
            >
              <VueSvgIcon class="cmw-m-auto" :data="addIcon" width="14" height="14" color="white" />
            </button>
            <div class="cmw-flex cmw-w-[40px] cmw-h-[40px] cmw-bg-primary-400 cmw-text-white text-center">
              <span class="cmw-m-auto cmw-text-sm">{{ cartQuantity }}</span>
            </div>
            <button
              class="cmw-flex cmw-transition-colors cmw-w-[40px] cmw-h-[40px] cmw-bg-primary-400 cmw-rounded-b-sm hover:(cmw-bg-primary)"
              :aria-label="$t('enums.accessibility.role.REMOVE_FROM_CART')"
              @click="removeFromUserCart"
            >
              <VueSvgIcon class="cmw-m-auto" :data="subtractIcon" width="14" height="14" color="white" />
            </button>
          </div>
        </div>
        <div v-else>
          <ButtonIcon
            class="cmw-mr-4 cmw-mb-4 cmw-relative"
            :icon="emailIcon"
            :aria-label="$t('enums.accessibility.role.MODAL_OPEN')"
            @click.native="() => handleShowRequestModal(product.details.feId)"
          />
        </div>
      </div>
    </div>
    <div class="c-productBox__lapel cmw-absolute cmw-top-$lapel-top cmw-right-10">
      <CardLapel v-if="isOnSale" />
    </div>
    <div
      v-if="!product.availableForSale && isHovering"
      class="cmw-absolute cmw-transform cmw-bg-black/70 cmw-rounded cmw-top-1/3 cmw-left-1/2 cmw-translate-y-[-50%] cmw-translate-x-[-50%]
       cmw-py-4 cmw-px-4 cmw-overline-2 cmw-uppercase cmw-text-white"
      v-text="$t('product.notAvailable2')"
    />
  </div>
</template>

<style scoped>
.c-productBox {
  container: product-box / inline-size;
  width: 100%;
  height: 100%;
}

.c-productBox__grid {
  grid-template-columns: 60px auto auto 60px;
  grid-template-rows: auto auto auto 110px;
  grid-template-areas:
  "features image image wishlist"
  "awards image image wishlist"
  "title title title title"
  "price price cart cart";
}

.c-productBox__features {
  grid-area: features;
}

.c-productBox__awards {
  grid-area: awards;
  grid-row: 1;
}

.c-productBox__image {
  grid-row: 1;
  grid-column: 1 / -1;
}

.c-productBox__image {
  height: 320px;
}

.c-productBox__image ::v-deep(img) {
  height: 320px;
  width: auto;
  margin: 0 auto;
}

.c-productBox__wishlist {
  grid-area: wishlist;
  grid-row: 1;
}

.c-productBox__wishlist button {
  margin-right: 1rem;
}

.c-productBox__title {
  grid-area: title;
}

.c-productBox__price {
  grid-area: price;
}

.c-productBox__cart {
  grid-area: cart;
}

.c-productBox__lapel {
  --lapel-top: -6px;
}

/* We are handling this piece skipping mobile-first to reduce the amount of CSS  */
@container product-box (max-width: 250px) {
  .c-productBox__image {
    height: 270px;
  }

  .c-productBox__image ::v-deep(img) {
    height: 270px;
  }

  .c-productBox__wishlist button {
    margin-right: 0.25rem;
  }

  .c-productBox__lapel {
    --lapel-top: -5px;
  }

  :deep(.c-lapel) {
    --lapel-height: 26px;
    --lapel-edge-width: 22px;
    --lapel-edge-left: -22px;
    --lapel-swg-width: 18px;
  }

  :deep(.c-lapel__label) {
    display: none;
  }
}
</style>
