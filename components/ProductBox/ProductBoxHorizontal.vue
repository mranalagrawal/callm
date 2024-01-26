<script lang="ts">
import {
  computed,
  defineComponent,
  type PropType,
  ref,
  useContext,
  useFetch,
  useRoute,
  useRouter,
} from '@nuxtjs/composition-api'
import { storeToRefs } from 'pinia'

import type { IProductMapped } from '~/types/product'

import { getCountryFromStore, getLocaleFromCurrencyCode } from '~/utilities/currency'
import addIcon from '~/assets/svg/add.svg'
import cartIcon from '~/assets/svg/cart.svg'
import closeIcon from '~/assets/svg/close.svg'
import emailIcon from '~/assets/svg/email.svg'
import heartFullIcon from '~/assets/svg/heart-full.svg'
import heartIcon from '~/assets/svg/heart.svg'
import { stripHtml } from '~/utilities/strings'
import subtractIcon from '~/assets/svg/subtract.svg'
import { SweetAlertToast } from '~/utilities/Swal'
import { useCart } from '~/store/cart'
import { useCustomer } from '~/store/customer'
import { useCustomerWishlist } from '~/store/customerWishlist'
import useShowRequestModal from '~/components/ProductBox/useShowRequestModal'

export default defineComponent({
  name: 'ProductBoxHorizontal',
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
    const mappedRelatedVintage = ref<IProductMapped | null>(null)

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

    const finalPrice = computed(() => {
      const currentProduct = mappedRelatedVintage.value || props.product

      if (!currentProduct.priceLists || !currentProduct.priceLists[$config.SALECHANNEL]) {
        return 0
      }
      return currentProduct.priceLists[$config.SALECHANNEL][getCustomerType.value] || 0
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
        return ((finalPrice.value / currentProduct.milliliters) * 1000)
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

      const lineItems = [{
        attributes: currentLineItem.attributes,
        id: currentLineItem.id,
        quantity: +currentLineItem.quantity - 1,
        merchandiseId: currentLineItem.merchandise.id,
      }]

      await cartLinesUpdate(cart.value.id, lineItems, true)
    }

    const handleStarAndCustomerCommentClick = ({ score = null, description = '' }) => {
      handleWishlist({
        id: templateProduct.value.id,
        isOnFavourite: false,
        isUpdating: true,
        gtmProductData: gtmProductData.value,
        score,
        description,
      })
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
      customer,
      customerId,
      emailIcon,
      finalPrice,
      getCustomerType,
      gtmProductData,
      handleProductCLick,
      handleShowRequestModal,
      handleStarAndCustomerCommentClick,
      handleWishlist,
      handleWishlistClick,
      heartFullIcon,
      heartIcon,
      isOnFavourite,
      isOnSale,
      isOpen,
      isRelatedVintageWithHandle,
      mappedRelatedVintage,
      notActive,
      priceByLiter,
      removeProductFromCustomerCart,
      subtractIcon,
      templateProduct,
    }
  },
  methods: {
    stripHtml,
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
        note: this.cart.note,
        lines: [{
          attributes: [
            {
              key: 'gtmProductData',
              value: currentProduct.gtmProductData ? JSON.stringify(currentProduct.gtmProductData) : 'false',
            },
            {
              key: 'bundle',
              value: (currentProduct.tags) ? currentProduct.tags.includes('BUNDLE').toString() : 'false',
            },
          ],
          quantity: 1,
          merchandiseId: currentProduct.shopify_product_variant_id,
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
            icon: currentProduct.image.source.url,
            iconClass: 'bg-transparent',
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
    class="relative transition transition-box-shadow bg-white rounded-sm border border-gray-light p-2
     grid grid-cols-[1fr_2fr] lg:grid-cols-[220px_auto_320px]
     hover:shadow-elevation"
    :data-sku="templateProduct.sku"
  >
    <!-- Image Section -->
    <div class="relative p-2">
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
            img-classes="w-full h-auto"
            :class="[
              { 'opacity-50': !templateProduct.availableForSale },
              { 'hover:contrast-150': !templateProduct.image?.thumbnail.url?.includes('no-product-image') },
            ]"
            :thumbnail="templateProduct.image.thumbnail"
            :source="templateProduct.image.source"
            wrapper="span"
          />
        </NuxtLink>
      </ClientOnly>
      <div v-if="templateProduct.availableFeatures.length" class="absolute top-4 left-2 flex flex-col gap-y-1">
        <!-- Todo: create a global tooltip that change position base on mouse position -->
        <ProductBoxFeature v-for="feature in templateProduct.availableFeatures" :key="feature" :feature="feature" />
      </div>
      <ButtonIcon
        :icon="isOnFavourite ? heartFullIcon : heartIcon"
        class="absolute top-4 right-2" :variant="isOnFavourite ? 'icon-primary' : 'icon'"
        :aria-label="isOnFavourite ? $t('enums.accessibility.role.REMOVE_FROM_WISHLIST') : $t('enums.accessibility.role.ADD_TO_WISHLIST')"
        @click.native="handleWishlistClick"
      />
    </div>
    <!-- Content Section -->
    <div class="p-2">
      <div class="relative mt-4">
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
          class="h4 mt-4 text-body text-left hover:(text-primary-400)"
          :to="localePath(templateProduct.url)"
          @click.native="handleProductCLick"
        >
          {{ product.title }}
        </NuxtLink>
      </div>
      <ProductUserRating v-if="customerId" :product-id="`${templateProduct.details.feId}`" @click-star="handleStarAndCustomerCommentClick" />
      <div class="flex gap-3" :class="!templateProduct.awards.length ? 'my-2' : 'my-8'">
        <div
          v-for="(award, i) in templateProduct.awards.slice(0, 4)"
          :key="`${award.id}-${i}`"
          class="flex gap-1 items-center pr-1.5"
          :class="{ 'border-r border-r-gray': ((i + 1) < templateProduct.awards.length) }"
        >
          <ProductBoxAward :award="award" />
        </div>
      </div>
      <div
        class="grid md:(grid-cols-[auto_1fr] gap-x-8 gap-y-2) text-sm"
        :class="{
          'opacity-50': !product.availableForSale,
          'my-8': templateProduct.tbd?.grapes || templateProduct.tbd?.regionName || templateProduct.tbd?.size?.id,
        }"
      >
        <div
          v-if="templateProduct.tbd?.grapes"
          class="cmw-font-bold"
          v-text="$t('product.grapes')"
        />
        <div v-if="templateProduct.tbd?.grapes">
          {{ templateProduct.tbd?.grapes }}
        </div>
        <div
          v-if="templateProduct.tbd?.regionName"
          class="<md:mt-2 cmw-font-bold"
          v-text="$t('product.regionCountry')"
        />
        <div v-if="templateProduct.tbd?.regionName">
          {{ templateProduct.tbd.regionName }} <span v-if="templateProduct.tbd?.countryName">( {{ templateProduct.tbd.countryName }} )</span>
        </div>
        <div
          v-if="templateProduct.tbd?.size"
          class="<md:mt-2 cmw-font-bold"
          v-text="$t('product.size')"
        />
        <div v-if="templateProduct.tbd?.size">
          {{ product.tbd.size }}
        </div>
      </div>
      <!-- Note: Why don't we use these fields from shopify? wouldn't be easier to handle locales? -->
      <!-- <div>{{ product.description }}</div>
      <div>{{ product.descriptionHtml }}</div> -->
      <div
        class="c-productBox__desc mb-4 line-clamp-6"
        :class="{ 'opacity-50': !templateProduct.availableForSale }"
        v-html="stripHtml(templateProduct.tbd.description)"
      />
      <ProductUserRatingDescription v-if="customerId" :product-id="`${templateProduct.details.feId}`" @submit-comment="handleStarAndCustomerCommentClick" />
    </div>
    <!-- CTA Section -->
    <div class="relative flex <lg:col-span-full">
      <div class="m-auto text-center w-full px-4">
        <p
          v-if="!!templateProduct.quantityAvailable && templateProduct.quantityAvailable < 6"
          class="overline-2 text-success font-medium text-center uppercase"
          v-text="$t('product.available', { quantity: templateProduct.quantityAvailable })"
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
        <div v-if="$cmwStore.isB2b" class="text-sm text-gray-dark  mb-3">
          iva esclusa
        </div>
        <div v-if="!notActive || isRelatedVintageWithHandle">
          <div v-if="product.availableForSale || (isRelatedVintageWithHandle && mappedRelatedVintage?.availableForSale)" class="relative">
            <CmwButton
              class="gap-2 pl-2 pr-3 py-2"
              :aria-label="$t('enums.accessibility.role.ADD_TO_CART')"
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
                :disabled="!canAddMore"
                :aria-label="!canAddMore ? '' : $t('enums.accessibility.role.ADD_TO_CART')"
                @click="addProductToCustomerCart"
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
              @click.native="handleShowRequestModal(templateProduct.details.feId)"
            >
              <VueSvgIcon :data="emailIcon" width="30" height="auto" />
              <span class="text-sm" v-text="$t('common.cta.notifyMe')" />
            </CmwButton>
          </div>
        </div>
        <div>
          <span v-if="$cmwStore.isDe && priceByLiter" class="text-sm">
            {{ $n(Number(priceByLiter), 'currency', getLocaleFromCurrencyCode(product.compareAtPrice.currencyCode)) }}/liter</span>
          <small v-if="$cmwStore.isDe" class="text-gray">Inkl. MwSt. Und St.</small>
        </div>
      </div>
      <div class="hidden lg:block absolute transform top-px left-1/2 -translate-x-1/2 -translate-y-1/2">
        <CardLapel v-if="isOnSale" />
      </div>
    </div>
    <div
      v-if="!templateProduct.availableForSale"
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
