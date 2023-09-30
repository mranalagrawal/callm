<script>
import { computed, defineComponent, ref, useContext, useRoute, useRouter } from '@nuxtjs/composition-api'
import addIcon from 'assets/svg/add.svg'
import cartIcon from 'assets/svg/cart.svg'
import closeIcon from 'assets/svg/close.svg'
import emailIcon from 'assets/svg/email.svg'
import heartFullIcon from 'assets/svg/heart-full.svg'
import heartIcon from 'assets/svg/heart.svg'
import subtractIcon from 'assets/svg/subtract.svg'
import { storeToRefs } from 'pinia'
import useShowRequestModal from '@/components/ProductBox/useShowRequestModal'
import { useCustomer } from '~/store/customer'
import { useCustomerOrders } from '~/store/customerOrders.ts'
import { useShopifyCart } from '~/store/shopifyCart'
import { getCountryFromStore, getLocaleFromCurrencyCode } from '~/utilities/currency'
import { stripHtml } from '~/utilities/strings'
import { SweetAlertToast } from '~/utilities/Swal'
import { isObject } from '~/utilities/validators'

// noinspection JSUnusedGlobalSymbols
export default defineComponent({
  name: 'ProductBoxHorizontal',
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
    const customerOrders = useCustomerOrders()
    const { getCanOrder } = storeToRefs(customerOrders)
    const { shopifyCart } = storeToRefs(useShopifyCart())
    const { cartLinesAdd, createShopifyCart, cartLinesUpdate } = useShopifyCart()
    const { wishlistArr, getCustomerType, customerId } = storeToRefs(customerStore)
    const { handleWishlist } = customerStore
    const { handleShowRequestModal } = useShowRequestModal()
    const route = useRoute()
    const router = useRouter()

    const isOpen = ref(false)

    const isOnFavourite = computed(() => wishlistArr.value.includes(props.product.source_id))
    const isOnSale = computed(() => props.product.availableFeatures.includes('isInPromotion'))
    const finalPrice = computed(() => {
      if (!props.product.priceLists || !props.product.priceLists[$config.SALECHANNEL]) { return 0 }
      return props.product.priceLists[$config.SALECHANNEL][getCustomerType.value] || 0
    })
    const gtmProductData = computed(() => ({
      ...props.product.gtmProductData,
      price: finalPrice.value,
    }))
    const handleHeartClick = () => {
      handleWishlist({
        id: props.product.id,
        isOnFavourite: isOnFavourite.value,
        gtmProductData: gtmProductData.value,
      })
    }

    const handleStarAndCustomerCommentClick = ({ score = null, description = '' }) => {
      handleWishlist({
        id: props.product.id,
        isOnFavourite: false,
        gtmProductData: gtmProductData.value,
        score,
        description,
      })
    }

    const handleProductCLick = async (position = '') => {
      await $cmwGtmUtils.resetDatalayerFields()

      $gtm.push({
        event: 'productClick',
        ecommerce: {
          currencyCode: $nuxt.$config.STORE === 'CMW_UK' ? 'GBP' : 'EUR',
          click: {
            actionField: { list: $cmwGtmUtils.getActionField(route.value) },
            products: [{
              ...props.product.gtmProductData,
              price: finalPrice.value,
              position,
            }],
          },
        },
      })

      router.push(localeLocation(props.product.url))
    }

    const amountMax = computed(() => (Object.keys(props.product.details).length && props.product.details.amountMax[$config.SALECHANNEL]
      && props.product.details.amountMax[$config.SALECHANNEL] <= props.product.quantityAvailable)
      ? props.product.details.amountMax[$config.SALECHANNEL]
      : props.product.quantityAvailable,
    )

    const isOnCart = computed(() => {
      const product = shopifyCart.value?.lines?.edges.find(el => el.node.merchandise.id === props.product.shopify_product_variant_id)
      if (product) { return product.node }
      return null
    })

    const cartQuantity = computed(() => isOnCart.value ? isOnCart.value.quantity : 0)

    const canAddMore = computed(() => (amountMax.value - cartQuantity.value) > 0)

    const priceByLiter = computed(() => {
      if ($config.STORE !== 'CMW_DE') { return 0 } else { return ((finalPrice.value / props.product.milliliters) * 1000) }
    })

    return {
      addIcon,
      amountMax,
      canAddMore,
      cartIcon,
      cartLinesAdd,
      cartQuantity,
      closeIcon,
      createShopifyCart,
      customerId,
      emailIcon,
      finalPrice,
      getCanOrder,
      getCustomerType,
      gtmProductData,
      handleHeartClick,
      handleProductCLick,
      handleShowRequestModal,
      handleStarAndCustomerCommentClick,
      handleWishlist,
      heartFullIcon,
      heartIcon,
      isOnFavourite,
      isOnSale,
      isOpen,
      priceByLiter,
      shopifyCart,
      subtractIcon,
      cartLinesUpdate,
      wishlistArr,
    }
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

      if (!this.shopifyCart) { await this.createShopifyCart() }

      await this.cartLinesAdd(this.product, false, () => this.flashMessage.show({
        status: '',
        message: this.$i18n.t('common.feedback.OK.cartAdded', { product: `${this.product.title}` }),
        icon: this.product.image.source.url,
        iconClass: 'bg-transparent ',
        time: 8000,
        blockClass: 'add-product-notification',
      }))
    },
    async removeFromUserCart() {
      if (this.cartQuantity === 0) { return }

      await this.cartLinesUpdate(this.product, this.cartQuantity - 1)
    },
  },
})
</script>

<template>
  <div
    v-if="product.shopify_product_id"
    class="relative transition transition-box-shadow bg-white rounded-sm border border-gray-light p-2 grid grid-cols-[220px_auto_320px]
hover:shadow-elevation"
    :data-sku="product.sku"
  >
    <!-- Image Section -->
    <div class="relative p-2">
      <ClientOnly>
        <button class="block mx-auto" @click="handleProductCLick">
          <LoadingImage
            class="filter hover:contrast-150 mx-auto mt-4"
            img-classes="w-full h-auto"
            :class="{ 'opacity-50': !product.availableForSale }"
            :thumbnail="product.image.thumbnail"
            :source="product.image.source"
            wrapper="span"
          />
        </button>
      </ClientOnly>
      <div v-if="product.availableFeatures.length" class="absolute top-4 left-2 flex flex-col gap-y-1">
        <!-- Todo: create a global tooltip that change position base on mouse position -->
        <ProductBoxFeature v-for="feature in product.availableFeatures" :key="feature" :feature="feature" />
      </div>
      <ButtonIcon
        :icon="isOnFavourite ? heartFullIcon : heartIcon"
        class="absolute top-4 right-2" :variant="isOnFavourite ? 'icon-primary' : 'icon'"
        :aria-label="isOnFavourite ? $t('enums.accessibility.role.REMOVE_FROM_WISHLIST') : $t('enums.accessibility.role.ADD_TO_WISHLIST')"
        @click.native="handleHeartClick"
      />
    </div>
    <!-- Content Section -->
    <div class="p-2">
      <div class="relative h4 mt-4">
        <button
          class="text-body text-left hover:(text-primary-400)"
          :aria-label="$t('enums.accessibility.labels.GO_TO_PRODUCT_DETAIL_PAGE')"
          @click="handleProductCLick"
        >
          {{ product.title }}
        </button>
        <NuxtLink class="block sr-only" :aria-label="$t('enums.accessibility.labels.GO_TO_PRODUCT_DETAIL_PAGE')" :to="localeLocation(product.url)" />
      </div>
      <ProductUserRating v-if="customerId" :product-id="`${product.details.feId}`" @click-star="handleStarAndCustomerCommentClick" />
      <div class="flex gap-3 my-8">
        <div
          v-for="(award, i) in product.awards.slice(0, 4)"
          :key="`${award.id}-${i}`"
          class="flex gap-1 items-center pr-1.5"
          :class="{ 'border-r border-r-gray': ((i + 1) < product.awards.length) }"
        >
          <ProductBoxAward :award="award" />
        </div>
      </div>
      <div
        class="grid gap-x-8 gap-y-2 my-8 grid-cols-[auto_1fr] text-sm"
        :class="{ 'opacity-50': !product.availableForSale }"
      >
        <div
          class="cmw-font-bold"
          v-text="$t('product.grapes')"
        />
        <div>{{ product.tbd.grapes }}</div>
        <div
          class="cmw-font-bold"
          v-text="$t('product.regionCountry')"
        />
        <div>{{ product.tbd.regionName }}</div>
        <div
          class="cmw-font-bold"
          v-text="$t('product.size')"
        />
        <div v-if="product.tbd.size.length">
          {{ product.tbd.size }}
        </div>
      </div>
      <!-- Note: Why don't we use these fields from shopify? wouldn't be easier to handle locales? -->
      <!-- <div>{{ product.description }}</div>
      <div>{{ product.descriptionHtml }}</div> -->
      <div
        class="c-productBox__desc mb-4 line-clamp-6"
        :class="{ 'opacity-50': !product.availableForSale }"
        v-html="stripHtml(product.tbd.description)"
      />
      <ProductUserRatingDescription v-if="customerId" :product-id="`${product.details.feId}`" @submit-comment="handleStarAndCustomerCommentClick" />
    </div>
    <!-- CTA Section -->
    <div class="relative flex">
      <div class="m-auto text-center w-full px-4">
        <p
          v-if="!!product.quantityAvailable && product.quantityAvailable < 6"
          class="overline-2 text-success font-medium text-center uppercase"
          v-text="$t('product.available', { quantity: product.quantityAvailable })"
        />

        <span
          v-if="isOnSale"
          class="line-through text-gray text-sm mr-3"
        >
          {{ $n(Number(product.compareAtPrice.amount), 'currency', getLocaleFromCurrencyCode(product.compareAtPrice.currencyCode)) }}
        </span>
        <i18n-n
          v-if="finalPrice"
          class="inline-block mb-3" :value="finalPrice" :format="{ key: 'currency' }"
          :locale="getLocaleFromCurrencyCode(product.compareAtPrice.currencyCode)"
        >
          <template #currency="slotProps">
            <span class="text-sm md:text-base">{{ slotProps.currency }}</span>
          </template>
          <template #integer="slotProps">
            <span class="h1 cmw-font-bold">{{ slotProps.integer }}</span>
          </template>
          <template #group="slotProps">
            <span class="h1 cmw-font-bold">{{ slotProps.group }}</span>
          </template>
          <template #fraction="slotProps">
            <span class="text-sm md:text-base">{{ slotProps.fraction }}</span>
          </template>
        </i18n-n>
        <div v-if="product.availableForSale" class="relative">
          <CmwButton
            class="gap-2 pl-2 pr-3 py-2"
            :aria-label="$t('enums.accessibility.role.ADD_TO_CART')"
            @click.native="addToUserCart"
          >
            <VueSvgIcon :data="cartIcon" color="white" width="30" height="auto" />
            <span class="text-sm" v-text="$t('product.addToCart')" />
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
          <!-- Clarify: In case the user is not logged we could just ask for his email in the SweetAlert confirm and also invite the user to log  -->
          <!-- Clarify: Shall we open a SweetAlert confirmation modal first? or just send the email?  -->
          <!-- Todo: Implement send email functionality on Backend -->
          <!--
          <CmwButton v-else variant="ghost" class="gap-2 pl-2 pr-3 py-2" @click.native="() => {}">
            <VueSvgIcon :data="emailIcon" width="30" height="auto" />
            <span class="text-sm" v-text="$t('product.notifyMe')" />
          </CmwButton>
           -->
        </div>
        <div v-else>
          <CmwButton
            variant="ghost"
            class="gap-2 pl-2 pr-3 py-2"
            :aria-label="$t('enums.accessibility.role.MODAL_OPEN')"
            @click.native="handleShowRequestModal(product.details.feId)"
          >
            <VueSvgIcon :data="emailIcon" width="30" height="auto" />
            <span class="text-sm" v-text="$t('common.cta.notifyMe')" />
          </CmwButton>
        </div>
        <div>
          <span v-if="$config.STORE === 'CMW_DE' && priceByLiter" class="text-sm">
            {{ $n(Number(priceByLiter), 'currency', getLocaleFromCurrencyCode(product.compareAtPrice.currencyCode)) }}/liter</span>
          <small v-if="$config.STORE === 'CMW_DE'" class="text-gray">Inkl. MwSt. Und St.</small>
        </div>
      </div>
      <div class="absolute transform top-px left-1/2 -translate-x-1/2 -translate-y-1/2">
        <CardLapel v-if="isOnSale" />
      </div>
    </div>
    <div
      v-if="!product.availableForSale"
      class="absolute transform bg-black/70 rounded top-1/2 left-12 -translate-y-1/2 py-4 px-24 overline-2 uppercase text-white"
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
