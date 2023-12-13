<script lang="ts">
import type { PropType } from '@nuxtjs/composition-api'
import { computed, defineComponent, ref, useContext, useRoute, useRouter } from '@nuxtjs/composition-api'
import addIcon from 'assets/svg/add.svg'
import cartIcon from 'assets/svg/cart.svg'
import closeIcon from 'assets/svg/close.svg'
import emailIcon from 'assets/svg/email.svg'
import heartFullIcon from 'assets/svg/heart-full.svg'
import heartIcon from 'assets/svg/heart.svg'
import subtractIcon from 'assets/svg/subtract.svg'
import { storeToRefs } from 'pinia'
import type { IProductMapped } from '~/types/product'
import useShowRequestModal from '@/components/ProductBox/useShowRequestModal'
import { useCheckout } from '~/store/checkout'
import { useCustomer } from '~/store/customer'
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
      localePath,
      $gtm,
      $cmwGtmUtils,
    } = useContext()
    const {
      customer,
      customerId,
      getCustomerType,
      wishlistArr,
    } = storeToRefs(useCustomer())
    const { checkout } = storeToRefs(useCheckout())
    const { checkoutCreate, checkoutLineItemsAdd, checkoutLineItemsUpdate } = useCheckout()
    const { handleWishlist } = useCustomer()
    const { handleShowRequestModal } = useShowRequestModal()
    const router = useRouter()
    const route = useRoute()

    const isOpen = ref(false)
    const showRequestModal = ref(false)
    const isHovering = ref(false)

    const notActive = computed(() => props.product.tags.includes('not_active'))
    // @ts-expect-error When we type customer store we should get the right type from wishlistArr
    const isOnFavourite = computed(() => wishlistArr.value.includes(`'${props.product.source_id}'`))
    const isOnSale = computed(() => props.product.availableFeatures.includes('isInPromotion'))
    const finalPrice = computed(() => {
      if (!props.product.priceLists || !props.product.priceLists[$config.SALECHANNEL]) {
        return 0
      }
      return props.product.priceLists[$config.SALECHANNEL][getCustomerType.value] || 0
    })

    const amountMax = computed(() =>
      (Object.keys(props.product.details).length
        && props.product.details.amountMax
        && props.product.details.amountMax[$config.SALECHANNEL]
        && props.product.details.amountMax[$config.SALECHANNEL] <= props.product.quantityAvailable)
        ? props.product.details.amountMax[$config.SALECHANNEL]
        : props.product.quantityAvailable,
    )

    const isOnCart = computed(() =>
      checkout.value.lineItems.find(el => el.variant.id === props.product.shopify_product_variant_id))

    const cartQuantity = computed(() => isOnCart.value ? isOnCart.value.quantity : 0)

    const canAddMore = computed(() => (amountMax.value - cartQuantity.value) > 0)

    const gtmProductData = computed(() => ({
      ...props.product.gtmProductData,
      price: finalPrice.value,
    }))

    const priceByLiter = computed(() => {
      if ($config.STORE !== 'CMW_DE') {
        return 0
      } else {
        return ((finalPrice.value / props.product.milliliters) * 1000)
      }
    })

    const handleWishlistClick = () => {
      handleWishlist({
        id: props.product.id,
        isOnFavourite: isOnFavourite.value,
        gtmProductData: gtmProductData.value,
      })
    }

    const removeProductFromCustomerCheckout = async () => {
      if (cartQuantity.value < 1) {
        return
      }

      const currentLineItem = checkout.value.lineItems.find(el => el.variant.id === props.product.shopify_product_variant_id)

      if (!currentLineItem) {
        return
      }

      const lineItems = [{
        customAttributes: currentLineItem.customAttributes,
        id: currentLineItem.id,
        quantity: +currentLineItem.quantity - 1,
        variantId: currentLineItem.variant.id,
      }]

      await checkoutLineItemsUpdate(checkout.value.id, lineItems, true)
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

      const url = props.relatedVintage?.handle
        ? `/${props.relatedVintage.handle}-P${props.relatedVintage.feId}.htm`
        : props.product.url

      router.push(localePath(url))
    }

    const handleEmailClick = () => {
      handleShowRequestModal(props.product.details.feId)
    }

    return {
      addIcon,
      amountMax,
      canAddMore,
      cartIcon,
      cartQuantity,
      checkout,
      checkoutCreate,
      checkoutLineItemsAdd,
      closeIcon,
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
      isHovering,
      isOnCart,
      isOnFavourite,
      isOnSale,
      isOpen,
      notActive,
      priceByLiter,
      removeProductFromCustomerCheckout,
      showRequestModal,
      subtractIcon,
      wishlistArr,
    }
  },
  methods: {
    generateKey,
    getLocaleFromCurrencyCode,
    getCountryFromStore,
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
          quantity: 1,
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
          // Fixme: make flashMessage work along with typescript or use a better plugin
          /* @ts-expect-error flashMessage doesn't seem to handle typescript */
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
  <div
    v-if="product.shopify_product_id"
    class="
    c-productBox relative transition transition-box-shadow bg-white rounded-sm border border-gray-light
    hover:shadow-elevation"
    :class="`-${generateKey($cmwStore.settings.store)}`"
    :data-sku="product.sku"
    @mouseenter="isHovering = true"
    @mouseleave="isHovering = false"
  >
    <div class="c-productBox__grid grid h-full" :class="`-${generateKey($cmwStore.settings.store)}`">
      <div class="c-productBox__image relative">
        <ClientOnly>
          <NuxtLink
            :aria-label="$t('enums.accessibility.labels.GO_TO_PRODUCT_DETAIL_PAGE')"
            event="" class="block mx-auto" :to="localePath(relatedVintage?.handle
              ? `/${relatedVintage.handle}-P${relatedVintage.feId}.htm`
              : product.url)"
            @click.native="handleProductCLick"
          >
            <LoadingImage
              class="filter mx-auto mt-4"
              :class="[
                { 'opacity-50': !product.availableForSale },
                { 'hover:contrast-150': !product.image?.thumbnail.url?.includes('no-product-image') },
              ]"
              :thumbnail="product.image.thumbnail"
              :source="product.image.source"
              wrapper="span"
            />
          </NuxtLink>
        </ClientOnly>
        <div v-if="product.availableFeatures.length" class="c-productBox__features absolute top-2 left-2 md:left-4">
          <div class="flex flex-col gap-y-1 w-max">
            <ProductBoxFeature v-for="feature in product.availableFeatures" :key="feature" :feature="feature" />
          </div>
        </div>
        <div class="c-productBox__awards absolute bottom-2 left-2 md:left-4">
          <div
            v-for="(award, i) in product.awards.slice(0, 4)"
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
            :to="localePath(relatedVintage?.handle
              ? `/${relatedVintage.handle}-P${relatedVintage.feId}.htm`
              : product.url)"
            class="transition-colors text-body text-left hover:(text-primary-400)"
            @click.native="handleProductCLick"
          >
            <span class="line-clamp-2 text-sm md:text-base">{{ product.title }}</span>
          </NuxtLink>
          <NuxtLink class="block sr-only" :aria-label="$t('enums.accessibility.labels.GO_TO_PRODUCT_DETAIL_PAGE')" :to="(product?.url) ? localeLocation(product.url) : '/'" />
        </div>
      </div>
      <div class="c-productBox__price justify-self-baseline self-end">
        <div class="flex flex-col ml-3">
          <span class="flex gap-2">
            <span
              v-if="isOnSale"
              class="line-through text-gray text-sm"
            >
              {{
                $n(Number(product.compareAtPrice.amount), 'currency', getLocaleFromCurrencyCode(product.compareAtPrice.currencyCode))
              }}
            </span>
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
              <span class="h1 cmw-font-bold !leading-none">{{ slotProps.integer }}</span>
            </template>
            <template #group="slotProps">
              <span class="h1 cmw-font-bold !leading-none">{{ slotProps.group }}</span>
            </template>
            <template #fraction="slotProps">
              <span class="text-sm md:text-base">{{ slotProps.fraction }}</span>
            </template>
          </i18n-n>
        </div>
      </div>
      <div v-if="!notActive" class="c-productBox__cart justify-self-baseline place-self-end">
        <div v-if="product.availableForSale" class="mr-3 relative">
          <ButtonIcon
            variant="ghost"
            :icon="cartIcon"
            :aria-label="$t('enums.accessibility.role.ADD_TO_CART')"
            @click.native="addProductToCustomerCheckout"
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
              class="flex transition-colors w-[44px] h-[44px] bg-primary-400 rounded-t-sm
                 hover:(bg-primary)
                 disabled:(bg-primary-100 cursor-not-allowed)"
              :disabled="!canAddMore"
              :aria-label="!canAddMore ? '' : $t('enums.accessibility.role.ADD_TO_CART')"
              @click="addProductToCustomerCheckout"
            >
              <VueSvgIcon class="m-auto" :data="addIcon" width="14" height="14" color="white" />
            </button>
            <div class="flex w-[44px] h-[44px] bg-primary-400 text-white text-center">
              <span class="m-auto text-sm">{{ cartQuantity }}</span>
            </div>
            <button
              class="flex transition-colors w-[44px] h-[44px] bg-primary-400 rounded-b-sm hover:(bg-primary)"
              :aria-label="$t('enums.accessibility.role.REMOVE_FROM_CART')"
              @click="removeProductFromCustomerCheckout"
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
      <div v-if="$cmwStore.isDe" class="c-productBox__note mx-2">
        <span v-if="priceByLiter" class="text-gray">
          {{ $n(Number(priceByLiter), 'currency', getLocaleFromCurrencyCode(product.compareAtPrice.currencyCode)) }}/liter</span>
        <span v-if="$cmwStore.isDe" class="text-gray">Inkl. MwSt. Und St.</span>
      </div>
      <div v-if="$cmwStore.isB2b" class="text-sm text-gray-dark ml-2">
        iva esclusa
      </div>
    </div>
    <div v-if="isOnSale" class="c-productBox__lapel absolute top-$lapel-top right-8">
      <CardLapel />
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
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-template-rows: auto 60px 54px 12px;
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
  grid-template-rows: auto 60px 54px 40px;
}
/* We are handling this piece skipping mobile-first to reduce the amount of CSS  */
@container product-box (max-width: 250px) {
  .c-productBox.-cmw-de .c-productBox__grid, .c-productBox.-b-2-b .c-productBox__grid {
    grid-template-rows: auto auto 54px 26px;
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
