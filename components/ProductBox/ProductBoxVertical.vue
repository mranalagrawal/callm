<script lang="ts">
import { computed, defineComponent, ref, useContext, useFetch, useRoute, useRouter, watch } from '@nuxtjs/composition-api'
import type { PropType } from '@nuxtjs/composition-api'
import { storeToRefs } from 'pinia'

import { useCart } from '~/store/cart'
import { useCustomer } from '~/store/customer'
import { useCustomerWishlist } from '~/store/customerWishlist'

import addIcon from '~/assets/svg/add.svg'
import cartIcon from '~/assets/svg/cart.svg'
import closeIcon from '~/assets/svg/close.svg'
import emailIcon from '~/assets/svg/email.svg'
import heartFullIcon from '~/assets/svg/heart-full.svg'
import heartIcon from '~/assets/svg/heart.svg'
import subtractIcon from '~/assets/svg/subtract.svg'

import useShowRequestModal from '@/components/ProductBox/useShowRequestModal'
import type { IMoneyV2 } from '~/types/common-objects'
import type { IProductMapped } from '~/types/product'
import { getCountryFromStore, getLocaleFromCurrencyCode } from '~/utilities/currency'
import { generateKey } from '~/utilities/strings'
import { SweetAlertToast } from '~/utilities/Swal'

export default defineComponent({
  name: 'ProductBoxVertical',
  props: {
    product: {
      required: true,
      type: Object as PropType<IProductMapped>,
    },
    relatedVintage: {
      type: Object as any,
      default: null,
    },
    position: {
      type: [String, Number],
      default: '',
    },
  },
  setup(props) {
    const {
      $config,
      $cmwStore,
      localePath,
      $gtm,
      $cmwGtmUtils,
    } = useContext()
    const {
      customer,
      customerId,
      getCustomerType,
    } = storeToRefs(useCustomer())
    const { wishlistArr } = storeToRefs(useCustomerWishlist())
    const { cart } = storeToRefs(useCart())
    const { cartCreate, cartLinesAdd, cartLinesUpdate } = useCart()
    const { handleWishlist } = useCustomerWishlist()
    const { handleShowRequestModal } = useShowRequestModal()
    const router = useRouter()
    const route = useRoute()

    const isOpen = ref(false)
    const isBundle = ref(false)
    const showRequestModal = ref(false)
    const isHovering = ref(false)
    const mappedRelatedVintage = ref<Maybe<IProductMapped>>(null)
    const finalPrice = ref<Partial<IMoneyV2>>({})
    const lowestPrice = ref<Partial<IMoneyV2>>({})
    const compareAtPrice = ref<Partial<IMoneyV2>>({})

    // get a mapped product from shopify if relatedVintage is passed
    useFetch(({ $cmwRepo, $productMapping }) => {
      if (props.relatedVintage?.handle) {
        $cmwRepo.products.getAll({
          first: 1,
          query: `tag:P${props.relatedVintage.feId}`,
        })
          .then(async ({ products = { nodes: [] } }) => {
            if (!products.nodes.length) { return }

            const { handle } = products.nodes[0]

            if (handle) {
              mappedRelatedVintage.value = $productMapping.fromShopify([products.nodes[0]])[0]
            }
          })
      }
    })

    const templateProduct = computed<IProductMapped>(() => mappedRelatedVintage.value || props.product)

    const notActive = computed(() => props.product.tags.includes('not_active'))
    const isRelatedVintageWithHandle = computed(() => !!props.relatedVintage?.handle)
    const isOnFavourite = computed(() => wishlistArr.value.includes(`'${props.product.source_id}'`))
    const isOnSale = computed(() => {
      const currentProduct = mappedRelatedVintage.value || props.product
      return currentProduct.availableFeatures.includes('isInPromotion')
    })

    const amountMax = computed(() => {
      const currentProduct = mappedRelatedVintage.value || props.product

      return (Object.keys(currentProduct.details).length
        && currentProduct.details.amountMax
        && currentProduct.details.amountMax[$config.SALECHANNEL]
        && currentProduct.details.amountMax[$config.SALECHANNEL] <= currentProduct.quantityAvailable)
        ? currentProduct.details.amountMax[$config.SALECHANNEL]
        : currentProduct.quantityAvailable
    })
    const isOnCart = computed(() => {
      const currentProduct = mappedRelatedVintage.value || props.product
      return cart.value.lines.find(el => el.merchandise.id === currentProduct.shopify_product_variant_id)
    })

    const cartQuantity = computed(() => isOnCart.value ? isOnCart.value.quantity : 0)

    const canAddMore = computed(() => (amountMax.value - cartQuantity.value) > 0)

    const gtmProductData = computed(() => {
      const currentProduct = mappedRelatedVintage.value || props.product

      return {
        ...currentProduct.gtmProductData,
        price: finalPrice.value,
      }
    })

    const priceByLiter = computed(() => {
      const currentProduct = mappedRelatedVintage.value || props.product

      if (!$cmwStore.isDe) {
        return 0
      } else {
        return ((+(finalPrice.value?.amount || 0) / currentProduct.milliliters) * 1000)
      }
    })

    const handleWishlistClick = () => {
      handleWishlist({
        id: props.product.id,
        isOnFavourite: isOnFavourite.value,
        gtmProductData: gtmProductData.value,
      })
    }

    const removeProductFromCustomerCart = async () => {
      if (cartQuantity.value < 1) {
        return
      }

      const currentProduct = mappedRelatedVintage.value || props.product

      const currentLineItem = cart.value.lines.find(el => el.merchandise.id === currentProduct.shopify_product_variant_id)

      if (!currentLineItem) {
        return
      }

      const lines = [{
        attributes: currentLineItem.attributes,
        id: currentLineItem.id,
        quantity: +currentLineItem.quantity - 1,
        merchandiseId: currentLineItem.merchandise.id,
      }]

      await cartLinesUpdate(cart.value.id, lines, true)
    }

    const handleProductCLick = async () => {
      await $cmwGtmUtils.resetDatalayerFields()

      const currentProduct = mappedRelatedVintage.value || props.product

      $gtm.push({
        event: 'productClick',
        ecommerce: {
          currencyCode: $cmwStore.isUk ? 'GBP' : 'EUR',
          click: {
            actionField: { list: $cmwGtmUtils.getActionField(route.value) },
            products: [{
              ...currentProduct.gtmProductData,
              price: finalPrice.value,
              position: props.position,
            }],
          },
        },
      })

      const url = props.relatedVintage?.handle
        ? `/${props.relatedVintage.handle}-P${props.relatedVintage.feId}.htm`
        : props.product.url

      router.push(localePath(url))
    }

    const handleEmailClick = () => {
      handleShowRequestModal(!isRelatedVintageWithHandle.value
        ? props.product.details.feId
        : props.relatedVintage.feId)
    }

    watch([
      () => getCustomerType.value,
      () => templateProduct.value?.source_id,
    ], () => {
      if (!templateProduct.value?.source_id) { return false }

      const priceLists = templateProduct.value?.priceLists ? templateProduct.value?.priceLists[getCustomerType.value] : null

      finalPrice.value = (priceLists?.price?.amount && priceLists?.price?.currencyCode) ? priceLists.price : {}
      lowestPrice.value = (isOnSale.value && priceLists?.lowestPrice?.amount && priceLists?.lowestPrice?.currencyCode) ? priceLists.lowestPrice : {}
      compareAtPrice.value = (priceLists?.compareAtPrice?.amount && priceLists?.compareAtPrice?.currencyCode) ? priceLists.compareAtPrice : {}

      isBundle.value = templateProduct.value?.tags.includes('BUNDLE')
    }, { immediate: true })


    return {
      addIcon,
      amountMax,
      canAddMore,
      cart,
      cartCreate,
      cartIcon,
      cartLinesAdd,
      cartLinesUpdate,
      cartQuantity,
      closeIcon,
      compareAtPrice,
      customer,
      customerId,
      emailIcon,
      finalPrice,
      getCustomerType,
      gtmProductData,
      handleEmailClick,
      handleProductCLick,
      handleShowRequestModal,
      handleWishlist,
      handleWishlistClick,
      heartFullIcon,
      heartIcon,
      isBundle,
      isHovering,
      isOnCart,
      isOnFavourite,
      isOnSale,
      isOpen,
      isRelatedVintageWithHandle,
      lowestPrice,
      mappedRelatedVintage,
      notActive,
      priceByLiter,
      removeProductFromCustomerCart,
      showRequestModal,
      subtractIcon,
      templateProduct,
      wishlistArr,
    }
  },
  methods: {
    generateKey,
    getLocaleFromCurrencyCode,
    getCountryFromStore,
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

      const currentProduct = this.mappedRelatedVintage || this.product

      const cartInput = {
        buyerIdentity: {
          countryCode: getCountryFromStore(this.$cmwStore.settings.store),
          ...(this.customer.email && { email: this.customer.email }),
        },
        note: this.cart.note ?? '',
        lines: [{
          attributes: [
            {
              key: '_gtmProductData',
              value: currentProduct.gtmProductData ? JSON.stringify(currentProduct.gtmProductData) : 'false',
            },
            {
              key: 'bundle',
              value: (currentProduct.tags) ? currentProduct.tags.includes('BUNDLE').toString() : 'false',
            },
          ],
          quantity: 1,
          merchandiseId: currentProduct.shopify_product_variant_id || '',
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
          // Fixme: make flashMessage work along with typescript or use a better plugin
          /* @ts-expect-error flashMessage doesn't seem to handle typescript */
          this.flashMessage.show({
            status: '',
            message: this.$i18n.t('common.feedback.OK.cartAdded', { product: `${currentProduct.title}` }),
            icon: currentProduct.image?.source.url,
            iconClass: 'bg-transparent ',
            time: 4000,
            blockClass: 'add-product-notification',
          })
        })
    },
  },
})
</script>

<template>
  <div
    v-if="templateProduct.shopify_product_id"
    class="
    c-productBox relative transition transition-box-shadow bg-white rounded-sm border border-gray-light
    hover:shadow-elevation"
    :class="`-${generateKey($cmwStore.settings.store)}`"
    :data-sku="templateProduct.sku"
    @mouseenter="isHovering = true"
    @mouseleave="isHovering = false"
  >
    <div class="c-productBox__grid grid h-full" :class="`-${generateKey($cmwStore.settings.store)}`">
      <div class="c-productBox__image relative">
        <ClientOnly>
          <NuxtLink
            :aria-label="$t('enums.accessibility.labels.GO_TO_PRODUCT_DETAIL_PAGE')"
            event=""
            class="block mx-auto"
            :to="localePath(templateProduct.url)"
            @click.native="handleProductCLick"
          >
            <LoadingImage
              class="filter mx-auto mt-4"
              :class="[
                { 'opacity-50': !templateProduct.availableForSale },
                { 'hover:contrast-150': !templateProduct.image?.thumbnail.url?.includes('no-product-image') },
              ]"
              :thumbnail="templateProduct.image?.thumbnail"
              :source="templateProduct.image?.source"
              wrapper="span"
            />
          </NuxtLink>
        </ClientOnly>
        <div v-if="templateProduct.availableFeatures.length" class="c-productBox__features absolute top-2 left-2 md:left-4">
          <div class="flex flex-col gap-y-1 w-max">
            <ProductBoxFeature v-for="feature in templateProduct.availableFeatures" :key="feature" :feature="feature" />
          </div>
        </div>
        <div class="c-productBox__awards absolute bottom-2 left-2 md:left-4">
          <div
            v-for="(award, i) in templateProduct.awards.slice(0, 4)"
            :key="generateKey(`${award.id}-${i}`)"
            class="flex gap-1 items-center pr-1.5"
          >
            <ProductBoxAward :award="award" />
          </div>
        </div>
        <div class="c-productBox__wishlist absolute bottom-2 right-2 md:right-2">
          <ButtonIcon
            :icon="isOnFavourite ? heartFullIcon : heartIcon"
            class="z-baseLow" :variant="isOnFavourite ? 'icon-primary' : 'icon'"
            :class="isOnFavourite ? 'js-remove-from-wishlist' : 'js-add-to-wishlist'"
            :aria-label="isOnFavourite ? $t('enums.accessibility.role.REMOVE_FROM_WISHLIST') : $t('enums.accessibility.role.ADD_TO_WISHLIST')"
            @click.native="handleWishlistClick"
          />
        </div>
      </div>
      <div class="c-productBox__title">
        <div class="relative mx-4 mt-1">
          <NuxtLink
            v-if="relatedVintage?.handle"
            :to="localePath(`/${relatedVintage.handle}-P${relatedVintage.feId}.htm`)"
            class="block text-xs text-gray-dark"
          >
            {{ $t('product.otherVintagesSale', { vintage: relatedVintage.vintageyear }) }}
          </NuxtLink>
          <NuxtLink
            :aria-label="$t('enums.accessibility.labels.GO_TO_PRODUCT_DETAIL_PAGE')"
            event=""
            :to="localePath(templateProduct.url)"
            class="transition-colors text-body text-left hover:(text-primary-400)"
            @click.native="handleProductCLick"
          >
            <span class="line-clamp-2 text-sm md:text-base">{{ product.title }}</span>
          </NuxtLink>
        </div>
      </div>
      <div class="c-productBox__price justify-self-baseline self-end">
        <div class="flex flex-col ml-3">
          <span class="flex gap-2">
            <ProductPriceListsCompareAtPrice v-if="isOnSale && Object.keys(compareAtPrice).length" :compare-at-price="compareAtPrice" />
          </span>
          <ProductPriceListsFinalPrice v-if="Object.keys(finalPrice).length" :final-price="finalPrice" use-font-size-reducer />
        </div>
      </div>
      <div v-if="!notActive || isRelatedVintageWithHandle" class="c-productBox__cart justify-self-baseline place-self-end">
        <div v-if="product.availableForSale || (isRelatedVintageWithHandle && mappedRelatedVintage?.availableForSale)" class="mr-3 relative">
          <ButtonIcon
            class="js-add-to-cart"
            variant="ghost"
            :icon="cartIcon"
            :aria-label="$t('enums.accessibility.role.ADD_TO_CART')"
            @click.native="addProductToCustomerCart"
          />
          <Badge
            v-show="cartQuantity && !isOpen"
            class="absolute top-0 left-full transform -translate-x-1/2 -translate-y-1/2"
            bg-color="primary-400" :qty="cartQuantity"
          />
          <div
            v-show="isOpen"
            class="absolute w-full h-[132px] bottom-0 left-0"
            @mouseleave="isOpen = false"
          >
            <button
              class="
              flex transition-colors w-[44px] h-[44px] bg-primary-400 rounded-t-sm
              js-add-to-cart
              hover:(bg-primary)
              disabled:(bg-primary-100 cursor-not-allowed)"
              :disabled="!canAddMore"
              :aria-label="!canAddMore ? '' : $t('enums.accessibility.role.ADD_TO_CART')"
              @click="addProductToCustomerCart"
            >
              <VueSvgIcon class="m-auto" :data="addIcon" width="14" height="14" color="white" />
            </button>
            <div class="flex w-[44px] h-[44px] bg-primary-400 text-white text-center">
              <span class="m-auto text-sm">{{ cartQuantity }}</span>
            </div>
            <button
              class="
              flex transition-colors w-[44px] h-[44px] bg-primary-400 rounded-b-sm
              js-remove-from-cart
              hover:(bg-primary)"
              :aria-label="$t('enums.accessibility.role.REMOVE_FROM_CART')"
              @click="removeProductFromCustomerCart"
            >
              <VueSvgIcon class="m-auto" :data="subtractIcon" width="14" height="14" color="white" />
            </button>
          </div>
        </div>
        <div v-else>
          <ButtonIcon
            variant="ghost"
            class="mr-3 relative"
            :icon="emailIcon"
            :aria-label="$t('enums.accessibility.role.MODAL_OPEN')"
            @click.native="handleEmailClick"
          />
        </div>
      </div>
      <div class="c-productBox__note mx-2">
        <ProductPriceListsLowestPrice
          v-if="Object.keys(lowestPrice).length && !isBundle"
          :lowest-price="lowestPrice"
        />
        <span v-if="$cmwStore.isDe && priceByLiter && finalPrice?.currencyCode" class="text-gray">
          {{ $n(Number(priceByLiter), 'currency', getLocaleFromCurrencyCode(finalPrice.currencyCode)) }}/liter</span>
        <span v-if="$cmwStore.isDe" class="text-gray">Inkl. MwSt. Und St.</span>
        <div v-if="$cmwStore.isB2b" class="text-sm text-gray-dark ml-2">
          iva esclusa
        </div>
      </div>
    </div>
    <div v-if="isOnSale" class="c-productBox__lapel absolute top-$lapel-top right-8">
      <CardLapel />
    </div>
    <div
      v-if="!templateProduct.availableForSale && isHovering"
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
  grid-template-columns: auto 62px;
  grid-template-rows: auto 3lh 60px 1.4lh;
  grid-template-areas:
  "image image"
  "title title"
  "price cart"
  "note note";
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

.c-productBox__title {
  grid-area: title;
}

.c-productBox__price {
  grid-area: price;
}

.c-productBox__cart {
  grid-area: cart;
}

.c-productBox__note {
  grid-area: note;
  font-size: 0.8rem;
  align-self: center;
}

.c-productBox__lapel {
  --lapel-top: -6px;
}

/* DE Modifiers */
.c-productBox.-cmw-de .c-productBox__grid, .c-productBox.-b-2-b .c-productBox__grid {
  grid-template-rows: auto 3lh 70px 2lh;
}

/* We are handling this piece skipping mobile-first to reduce the amount of CSS  */
@container product-box (max-width: 250px) {
  .c-productBox.-cmw-de .c-productBox__grid, .c-productBox.-b-2-b .c-productBox__grid {
    grid-template-rows: auto 2.8lh 50px 1.8lh;
  }

  .c-productBox__image {
    height: 260px;
  }

  .c-productBox__image ::v-deep(img) {
    height: 260px;
  }

  .c-productBox__note {
    font-size: 0.6rem;
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
