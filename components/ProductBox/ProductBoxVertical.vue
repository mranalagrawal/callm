<script>
// import type { PropType } from '@nuxtjs/composition-api'
// import type { RawLocation } from 'vue-router'
// import type { IProductMapped } from '~/types/product'
import { computed, defineComponent, ref, useContext, useRoute, useRouter } from '@nuxtjs/composition-api'
import addIcon from 'assets/svg/add.svg'
import cartIcon from 'assets/svg/cart.svg'
import emailIcon from 'assets/svg/email.svg'
import heartFullIcon from 'assets/svg/heart-full.svg'
import heartIcon from 'assets/svg/heart.svg'
import subtractIcon from 'assets/svg/subtract.svg'
import { storeToRefs } from 'pinia'
import useShowRequestModal from '@/components/ProductBox/useShowRequestModal'
import { useCustomer } from '~/store/customer'
import { useShopifyCart } from '~/store/shopifyCart'
import { getCountryFromStore, getLocaleFromCurrencyCode } from '~/utilities/currency'
import { generateKey } from '~/utilities/strings'
import { SweetAlertToast } from '~/utilities/Swal'
import { useCustomerOrders } from '~/store/customerOrders.ts'

export default defineComponent({
  name: 'ProductBoxVertical',
  props: {
    product: {
      required: true,
      type: Object, // as PropType<IProductMapped>,
    },
    position: {
      type: [String, Number],
      default: '',
    },
  },
  setup(props) {
    const { $config, localeLocation, $gtm, $cmwGtmUtils } = useContext()
    const customerStore = useCustomer()
    const { wishlistArr, getCustomerType, customerId } = storeToRefs(customerStore)

    const customerOrders = useCustomerOrders()
    const { getCanOrder } = storeToRefs(customerOrders)

    const shopifyCart = useShopifyCart()
    // TODO: Fix me
    // const { shopifyCart } = storeToRefs(useShopifyCart())
    // const { addProductToCart, getShopifyCart, createShopifyCart, updateItemInCart } = useShopifyCart()
    const { handleWishlist } = customerStore
    const { handleShowRequestModal } = useShowRequestModal()
    const router = useRouter()
    const route = useRoute()

    const isOpen = ref(false)
    const showRequestModal = ref(false)
    const isHovering = ref(false)

    const isOnFavourite = computed(() => wishlistArr.value.includes(props.product.source_id))
    const isOnSale = computed(() => props.product.availableFeatures.includes('isInPromotion'))
    const finalPrice = computed(() => {
      if (!props.product.priceLists[$config.SALECHANNEL])
        return 0
      return props.product.priceLists[$config.SALECHANNEL][getCustomerType.value] || 0
    })

    const amountMax = computed(() => props.product.details.amountMax[$config.SALECHANNEL])

    const canOrder = computed(() => {
      // product is limited and user is not logged
      if (amountMax && !customerId)
        return false

      return true
    })

    const gtmProductData = computed(() => ({
      ...props.product.gtmProductData,
      price: finalPrice.value,
    }))
    const handleWishlistClick = () => {
      handleWishlist({ id: props.product.id, isOnFavourite: isOnFavourite.value, gtmProductData: gtmProductData.value })
    }

    const handleProductCLick = async () => {
      await $cmwGtmUtils.resetDatalayerFields()

      $gtm.push({
        event: 'productClick',
        ecommerce: {
          currencyCode: $config.STORE === 'CMW_UK' ? 'GBP' : 'EUR',
          click: {
            actionField: { list: $cmwGtmUtils.getActionField(route.value) },
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

    const show = ref(false)
    const handleMouseEnter = () => show.value = true
    const handleMouseLeave = () => show.value = false

    return {
      // addProductToCart,
      // createShopifyCart,
      // getShopifyCart,
      // isOnCart,
      // updateItemInCart,
      addIcon,
      canOrder,
      cartIcon,
      emailIcon,
      finalPrice,
      getCanOrder,
      getCustomerType,
      gtmProductData,
      handleMouseEnter,
      handleMouseLeave,
      handleProductCLick,
      handleShowRequestModal,
      handleWishlist,
      handleWishlistClick,
      heartFullIcon,
      heartIcon,
      isHovering,
      isOnFavourite,
      isOnSale,
      isOpen,
      shopifyCart,
      showRequestModal,
      subtractIcon,
      wishlistArr,
    }
  },
  computed: {
    // ...mapState('userCart', {
    //   userCart: 'userCart',
    // }),
    /* ...mapState('shopifyCart', {
      shopifyCart: 'shopifyCart',
    }), */
    isOnCart() {
      const product = this.shopifyCart?.shopifyCart?.lines?.edges.find(el => el.node.merchandise.id === this.product.shopify_product_variant_id)
      if (product)
        return product.node
      return null
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
    getLocaleFromCurrencyCode,
    getCountryFromStore,
    async addToUserCart() {
      this.isOpen = true

      // check for availability
      if (!this.canAddMore) {
        await SweetAlertToast.fire({
          icon: 'warning',
          text: this.$i18n.t('common.feedback.KO.addToCartReachLimit'),
        })
        return
      }

      // check for logged user and product has amountMax...
      if (this.amountMax && this.customerId) {
        // ... and can order amountMax
        const amountMax = this.amountMax
        const variantId = this.product.shopify_product_variant_id
        const query = `processed_at:>${this.$dayjs().subtract(4, 'weeks').format('YYYY-MM-DD')}`
        const canOrder = await this.getCanOrder(variantId, amountMax, query)

        if (!canOrder) {
          await SweetAlertToast.fire({
            icon: 'warning',
            text: this.$i18n.t('common.feedback.KO.maxQuantityReached'),
          })
          return
        }
      }

      const shopifyCart = this.shopifyCart

      if (!shopifyCart.shopifyCart) {
        const newCart = await this.shopifyCart.createShopifyCart()
        shopifyCart.shopifyCart = newCart
        this.$cookies.set('cartId', shopifyCart.shopifyCart.id)
      }

      // add product to cart
      const updated = await this.shopifyCart.addProductToCart(this.product)
      shopifyCart.shopifyCart = updated

      this.flashMessage.show({
        status: '',
        message: this.$i18n.t('common.feedback.OK.cartAdded', { product: `${this.product.title}` }),
        icon: this.product.image.source.url,
        iconClass: 'bg-transparent ',
        time: 8000,
        blockClass: 'add-product-notification',
      })
    },
    async removeFromUserCart() {
      if (this.cartQuantity === 0)
        return

      const updated = await this.shopifyCart.updateItemInCart(this.product, this.cartQuantity - 1)
      const shopifyCart = this.shopifyCart
      shopifyCart.shopifyCart = updated
    },
  },
})
</script>

<template>
  <div
    v-if="product.shopify_product_id"
    class="
    c-productBox relative transition transition-box-shadow bg-white rounded-sm border border-gray-light
    hover:shadow-elevation"
    :data-sku="product.sku"
    @mouseenter="isHovering = true"
    @mouseleave="isHovering = false"
  >
    <div class="c-productBox__grid grid h-full">
      <div class="c-productBox__image">
        <ClientOnly>
          <button class="block mx-auto" @click="handleProductCLick">
            <LoadingImage
              class="filter hover:contrast-150 mx-auto mt-4"
              :class="{ 'opacity-50': !product.availableForSale }"
              :thumbnail="product.image.thumbnail"
              :source="product.image.source"
              wrapper="span"
            />
          </button>
        </ClientOnly>
      </div>
      <div class="c-productBox__features py-2 pl-2">
        <div class="flex flex-col gap-y-1 w-max">
          <ProductBoxFeature v-for="feature in product.availableFeatures" :key="feature" :feature="feature" />
        </div>
      </div>
      <div class="c-productBox__awards place-self-end">
        <div
          v-for="(award, i) in product.awards.slice(0, 4)"
          :key="generateKey(`${award.id}-${i}`)"
          class="flex gap-1 items-center pr-1.5"
        >
          <ProductBoxAward :award="award" />
        </div>
      </div>
      <div class="c-productBox__wishlist place-self-end relative">
        <ButtonIcon
          :icon="isOnFavourite ? heartFullIcon : heartIcon"
          class="z-baseLow" :variant="isOnFavourite ? 'icon-primary' : 'icon'"
          :aria-label="isOnFavourite ? $t('enums.accessibility.role.REMOVE_FROM_WISHLIST') : $t('enums.accessibility.role.ADD_TO_WISHLIST')"
          @click.native="handleWishlistClick"
        />
      </div>
      <div class="c-productBox__title">
        <div class="mx-4 mt-1">
          <button
            class="transition-colors text-body text-left hover:(text-primary-400)"
            @click="handleProductCLick"
          >
            <span class="line-clamp-2">{{ product.title }}</span>
          </button>
        </div>
      </div>
      <div class="c-productBox__price justify-self-start self-end">
        <div class="flex flex-col ml-4 mb-4">
          <span
            v-if="isOnSale"
            class="line-through text-gray text-sm"
          >
            {{
              $n(Number(product.compareAtPrice.amount), 'currency', getLocaleFromCurrencyCode(product.compareAtPrice.currencyCode))
            }}
          </span>
          <i18n-n
            v-if="finalPrice"
            class="inline-block" :value="finalPrice" :format="{ key: 'currency' }"
            :locale="getLocaleFromCurrencyCode(product.compareAtPrice.currencyCode)"
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
      </div>
      <div class="c-productBox__cart place-self-end">
        <div v-if="product.availableForSale" class="mr-4 mb-4 relative">
          <div v-if="canOrder">
            <ButtonIcon
              :icon="cartIcon"
              :aria-label="$t('enums.accessibility.role.ADD_TO_CART')"
              @click.native="addToUserCart"
            />
            <Badge
              v-show="cartQuantity && !isOpen"
              class="absolute top-0 left-full transform -translate-x-1/2 -translate-y-1/2"
              bg-color="primary-400" :qty="cartQuantity"
            />
            <div
              v-show="isOpen"
              class="absolute w-full h-[120px] bottom-0 left-0"
              @mouseleave="isOpen = false"
            >
              <button
                class="flex transition-colors w-[40px] h-[40px] bg-primary-400 rounded-t-sm
                 hover:(bg-primary)
                 disabled:(bg-primary-100 cursor-not-allowed)"
                :disabled="!canAddMore"
                :aria-label="!canAddMore ? '' : $t('enums.accessibility.role.ADD_TO_CART')"
                @click="addToUserCart"
              >
                <VueSvgIcon class="m-auto" :data="addIcon" width="14" height="14" color="white" />
              </button>
              <div class="flex w-[40px] h-[40px] bg-primary-400 text-white text-center">
                <span class="m-auto text-sm">{{ cartQuantity }}</span>
              </div>
              <button
                class="flex transition-colors w-[40px] h-[40px] bg-primary-400 rounded-b-sm hover:(bg-primary)"
                :aria-label="$t('enums.accessibility.role.REMOVE_FROM_CART')"
                @click="removeFromUserCart"
              >
                <VueSvgIcon class="m-auto" :data="subtractIcon" width="14" height="14" color="white" />
              </button>
            </div>
          </div>
          <div v-else class="relative" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
            <ButtonIcon
              class="mr-4 mb-4 relative"
              :icon="closeIcon"
              disabled
            />
            <div v-if="show" class="absolute w-max transform rounded-sm -translate-x-10 translate-y-0 bottom-full mb-2 right-0">
              <div class="relative bg-gray-lightest rounded-sm py-3 pl-3 pr-8 shadow-lg text-xs ">
                {{ $t('common.cta.cannot_order') }}
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <ButtonIcon
            class="mr-4 mb-4 relative"
            :icon="emailIcon"
            :aria-label="$t('enums.accessibility.role.MODAL_OPEN')"
            @click.native="() => handleShowRequestModal(product.details.feId)"
          />
        </div>
      </div>
    </div>
    <div class="c-productBox__lapel absolute top-$lapel-top right-10">
      <CardLapel v-if="isOnSale" />
    </div>
    <div
      v-if="!product.availableForSale && isHovering"
      class="absolute transform bg-black/70 rounded top-1/3 left-1/2 -translate-y-1/2 -translate-x-1/2
       py-4 px-4 overline-2 uppercase text-white"
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
  grid-template-rows: auto auto 72px 62px;
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
  width: auto;
  margin-inline: auto;
  height: 300px;
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
    height: 260px;
  }

  .c-productBox__image ::v-deep(img) {
    height: 260px;
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
