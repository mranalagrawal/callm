<script lang="ts">
import type { PropType } from '@nuxtjs/composition-api'
import { computed, defineComponent, inject, ref, useContext } from '@nuxtjs/composition-api'
import closeIcon from 'assets/svg/close.svg'
import { storeToRefs } from 'pinia'
import addIcon from 'assets/svg/add.svg'
import cartIcon from 'assets/svg/cart.svg'
import emailIcon from 'assets/svg/email.svg'
import subtractIcon from 'assets/svg/subtract.svg'
import { getCountryFromStore, getLocaleFromCurrencyCode } from '~/utilities/currency'
import Alert from '~/components/FeedBack/Alert.vue'
import useShowRequestModal from '~/components/ProductBox/useShowRequestModal'
import { useCheckout } from '~/store/checkout'
import { useCustomer } from '~/store/customer'
import type { IEventDay } from '~/pages/calendario-avvento-2023.vue'
import type { IProductMapped } from '~/types/product'
import type { TImage } from '~/types/types'
import { shopifyRichTextToHTML } from '~/utilities/shopify'
import { SweetAlertToast } from '~/utilities/Swal'

export default defineComponent({

  name: 'CurrentEvent',
  components: { Alert },
  inheritAttrs: false,
  props: {
    currentEvent: {
      type: Object as PropType<IEventDay['reference']>,
      required: true,
    },
    currentEventDay: {
      type: Number,
      required: true,
    },
    currentDay: {
      type: Number,
      required: true,
    },
  },
  emits: ['close-event'],
  setup(props) {
    const isDesktop = inject('isDesktop')
    const { $dayjs } = useContext()
    const { $productMapping, $cmwStore: { settings: { salesChannel } } } = useContext()
    const { customer } = storeToRefs(useCustomer())
    const { checkout } = storeToRefs(useCheckout())
    const { checkoutCreate, checkoutLineItemsAdd, checkoutLineItemsUpdate } = useCheckout()
    const { handleShowRequestModal } = useShowRequestModal()

    const isOpen = ref(false)
    const product = computed<IProductMapped>(() => $productMapping.fromShopify([props.currentEvent.product.reference])[0] || [])
    const description = computed(() => shopifyRichTextToHTML(props.currentEvent.description.value || ''))
    const giftDescription = computed(() => props.currentEvent.description?.value && shopifyRichTextToHTML(props.currentEvent.description.value))
    const isToday = computed(() => props.currentDay === $dayjs(props.currentEvent.date.value).get('D'))
    const isGift = computed(() => props.currentEvent.type.value === 'Gift')
    const productImage = computed<TImage>(() => props.currentEvent.image
      ? props.currentEvent.image.reference.image
      : (product.value.image.source || undefined),
    )
    const amountMax = computed(() => {
      if (!product.value.details.amountMax) { return 0 }

      return (product.value.details.amountMax[salesChannel]
          && product.value.details.amountMax[salesChannel] <= product.value.quantityAvailable)
        ? product.value.details.amountMax[salesChannel]
        : product.value.quantityAvailable
    })

    const isOnCart = computed(() =>
      checkout.value.lineItems.find(el => el.variant.id === product.value.shopify_product_variant_id))

    const cartQuantity = computed(() => isOnCart.value ? isOnCart.value.quantity : 0)

    const canAddMore = computed(() => (amountMax.value - cartQuantity.value) > 0)

    const removeProductFromCustomerCheckout = async () => {
      if (cartQuantity.value < 1) {
        return
      }

      const currentLineItem = checkout.value.lineItems.find(el => el.variant.id === product.value.shopify_product_variant_id)

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

    const price = computed(() => {
      if (props.currentEvent.price?.value) {
        return JSON.parse(props.currentEvent.price.value)
      }
    })

    const discount = computed(() => {
      if (props.currentEvent.discount?.value) {
        return JSON.parse(props.currentEvent.discount.value)
      }
    })

    const handleEmailClick = () => {
      handleShowRequestModal(product.value.details.feId)
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
      description,
      discount,
      emailIcon,
      giftDescription,
      handleEmailClick,
      handleShowRequestModal,
      isDesktop,
      isGift,
      isOpen,
      isToday,
      price,
      product,
      productImage,
      removeProductFromCustomerCheckout,
      subtractIcon,
    }
  },
  methods: {
    getLocaleFromCurrencyCode,
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
  <div class="c-calendar w-[min(100%,_40rem)] m-inline-auto bg-white relative p-4 rounded my-4 border border-primary">
    <ButtonIcon class="absolute top-2 right-2" :icon="closeIcon" variant="filled-white" @click.native="$emit('close-event')" />
    <div class="">
      <div class="text-2xl text-primary text-center cmw-font-bold py-4 px-4 md:px-8" v-text="currentEvent.title.value" />
      <div class="relative">
        <img
          v-if="productImage?.url"
          class="max-w-40 m-inline-auto" :src="productImage.url" :alt="productImage.altText"
        >
        <Alert
          v-if="!isToday"
          class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -rotate-12 w-max m-inline-auto"
          severity="error"
        >
          La promozione di questo giorno è terminata!
        </Alert>
      </div>
      <div v-if="!isGift" class="text-center px-4" v-html="description" />
      <div
        v-if="!isGift && currentEvent.price.value && currentEvent.discount.value"
        class="flex items-center justify-center gap-4"
      >
        <span class="text-xl">
          {{
            $n(Number(discount.amount), 'currency',
               getLocaleFromCurrencyCode(discount?.currency_code))
          }}
        </span>
        <span class="line-through text-gray text-sm">
          {{
            $n(Number(price.amount), 'currency',
               getLocaleFromCurrencyCode(price?.currency_code))
          }}
        </span>
      </div>
      <div v-if="currentEvent.type.value === 'Gift'" class="mt-8">
        <div class="text-center px-4" v-html="giftDescription" />
      </div>
      <div v-else class="mt-8">
        <div v-if="isToday" class="w-[min(100%,_60%)] m-inline-auto">
          <div v-if="!amountMax">
            <p
              v-if="product.quantityAvailable > 0" class="text-success text-center"
              :class="{ hidden: product.quantityAvailable > 6 }"
            >
              {{ $t('product.available', { quantity: product.quantityAvailable }) }}
            </p>
          </div>
          <div v-if="product.availableForSale" class="relative">
            <div v-if="!amountMax">
              <CmwButton
                class="gap-2 pl-2 pr-3 py-2"
                :aria-label="$t('enums.accessibility.role.ADD_TO_CART')"
                @click.native="addProductToCustomerCheckout"
              >
                <VueSvgIcon :data="cartIcon" color="white" width="30" height="auto" />
                <span class="text-sm" v-text="isDesktop ? $t('common.cta.addToCart') : $t('common.cta.addToCartSm')" />
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
                  @click="removeProductFromCustomerCheckout"
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
                  @click="addProductToCustomerCheckout"
                >
                  <VueSvgIcon class="m-auto" :data="addIcon" width="14" height="14" color="white" />
                </button>
              </div>
            </div>
            <div v-else>
              <CmwButton
                class="gap-2 pl-2 pr-3 py-2"
                :aria-label="$t('enums.accessibility.role.ADD_TO_CART')"
                @click.native="addProductToCustomerCheckout"
              >
                <VueSvgIcon :data="cartIcon" color="white" width="30" height="auto" />
                <span class="text-sm" v-text="isDesktop ? $t('common.cta.addToCart') : $t('common.cta.addToCartSm')" />
              </CmwButton>
              <Badge
                v-show="cartQuantity && !isOpen"
                class="absolute top-0 left-full transform -translate-x-1/2 -translate-y-1/2"
                bg-color="primary-400" :qty="cartQuantity"
              />
              <div
                v-show="isOpen"
                class="absolute grid grid-cols-[50px_auto_50px] items-center w-full h-[50px] top-0 right-0"
                @mouseleave="isOpen = false"
              >
                <button
                  class="flex transition-colors w-[50px] h-[50px] bg-primary-400 rounded-l hover:(bg-primary)"
                  :aria-label="$t('enums.accessibility.role.REMOVE_FROM_CART')"
                  @click="removeProductFromCustomerCheckout"
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
                  @click="addProductToCustomerCheckout"
                >
                  <VueSvgIcon class="m-auto" :data="addIcon" width="14" height="14" color="white" />
                </button>
              </div>
            </div>
          </div>

          <div v-else>
            <CmwButton
              variant="ghost"
              class="gap-2 pl-2 pr-3 py-2 <md:(w-[min(100%,_14rem)] ml-auto)"
              :aria-label="$t('enums.accessibility.role.MODAL_OPEN')"
              @click.native="handleEmailClick"
            >
              <VueSvgIcon :data="emailIcon" width="30" height="auto" />
              <span class="text-sm leading-4" v-text="isDesktop ? $t('common.cta.notifyMe') : $t('common.cta.notifyMeSm')" />
            </CmwButton>
          </div>
        </div>
      </div>
      <CmwButton :to="localePath('/')" variant="text" class="w-max m-inline-auto">
        <span>{{ $t('common.cta.continueShopping') }}</span>
      </CmwButton>
    </div>
  </div>
</template>

<style>
.c-calendar h1,
.c-calendar h2,
.c-calendar h3,
.c-calendar h4 {
  text-align: center;
}

.c-calendar em {
  color: lightgray;
  text-decoration: line-through;
}
</style>
