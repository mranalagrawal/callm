<script lang="ts">
import type { PropType } from '@nuxtjs/composition-api'
import { computed, defineComponent, inject, ref, useContext } from '@nuxtjs/composition-api'
import closeIcon from 'assets/svg/close.svg'
import { storeToRefs } from 'pinia'
import addIcon from 'assets/svg/add.svg'
import cartIcon from 'assets/svg/cart.svg'
import emailIcon from 'assets/svg/email.svg'
import subtractIcon from 'assets/svg/subtract.svg'
import useShowRequestModal from '~/components/ProductBox/useShowRequestModal'
import { useShopifyCart } from '~/store/shopifyCart'
import type { IEventDay } from '~/pages/calendario-avvento-2023.vue'
import type { IProductMapped } from '~/types/product'
import { shopifyRichTextToHTML } from '~/utilities/shopify'
import { SweetAlertToast } from '~/utilities/Swal'

export default defineComponent({

  name: 'CurrentEvent',
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
    const { $productMapping, i18n, $cmwStore: { settings: { salesChannel } } } = useContext()
    const { shopifyCart } = storeToRefs(useShopifyCart())
    const { cartLinesAdd, createShopifyCart, cartLinesUpdate } = useShopifyCart()
    const { handleShowRequestModal } = useShowRequestModal()

    const isOpen = ref(false)
    const product = computed<IProductMapped>(() => $productMapping.fromShopify([props.currentEvent.product.reference])[0] || [])
    const description = computed(() => product.value.details?.shortDescription[i18n.locale] || '')
    const giftDescription = computed(() => props.currentEvent.description?.value && shopifyRichTextToHTML(props.currentEvent.description.value))

    const amountMax = computed(() => {
      if (!product.value.details.amountMax) { return 0 }

      return (product.value.details.amountMax[salesChannel]
          && product.value.details.amountMax[salesChannel] <= product.value.quantityAvailable)
        ? product.value.details.amountMax[salesChannel]
        : product.value.quantityAvailable
    })

    const isOnCart = computed(() => {
      // @ts-expect-error implicit type
      const productIncart = shopifyCart.value?.lines?.edges.find(el => el.node.merchandise.id === product.value.shopify_product_variant_id)
      if (productIncart) { return productIncart.node }

      return null
    })

    const cartQuantity = computed(() => isOnCart.value ? isOnCart.value.quantity : 0)

    const canAddMore = computed(() => (amountMax.value - cartQuantity.value) > 0)

    const handleEmailClick = () => {
      handleShowRequestModal(product.value.details.feId)
    }

    return {
      addIcon,
      amountMax,
      canAddMore,
      cartIcon,
      cartLinesAdd,
      cartLinesUpdate,
      cartQuantity,
      closeIcon,
      createShopifyCart,
      description,
      emailIcon,
      giftDescription,
      handleEmailClick,
      handleShowRequestModal,
      isDesktop,
      isOpen,
      product,
      shopifyCart,
      subtractIcon,
    }
  },
  methods: {
    shopifyRichTextToHTML,
    async addToUserCart() {
      if (this.currentEventDay !== this.currentDay) {
        await SweetAlertToast.fire({
          icon: 'warning',
          text: this.$i18n.t('common.feedback.KO.addToCartNotAvailable'),
        })
        return
      }

      if (!this.product) {
        await SweetAlertToast.fire({
          icon: 'warning',
          text: this.$i18n.t('common.feedback.KO.unknown'),
        })
        return
      }
      if (!this.shopifyCart) { await this.createShopifyCart() }

      // Fixme: make flashMessage work along with typescript or use a better plugin
      /* @ts-expect-error flashMessage doesn't seem to handle typescript */
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
  <div class="w-[min(100%,_40rem)] m-inline-auto bg-white relative p-4 rounded my-4 border border-primary">
    <ButtonIcon class="absolute top-2 right-2" :icon="closeIcon" variant="filled-white" @click.native="$emit('close-event')" />
    <div class="">
      <div class="text-2xl text-primary text-center cmw-font-bold py-4" v-text="currentEvent.title.value" />
      <img
        class="max-w-40 m-inline-auto" :src="currentEvent.image.reference.image.url" :alt="currentEvent.image.reference.image.altText"
      >
      <CmwTextAccordion line-clamp="3">
        <div v-html="description" />
      </CmwTextAccordion>
      <div v-if="currentEvent.type.value === 'Gift'" class="mt-8">
        <div class="text-xs" v-html="giftDescription" />
        <CmwButton variant="ghost" :to="localePath('/')" class="w-max m-inline-auto">
          <span>{{ $t('common.cta.continueShopping') }}</span>
        </CmwButton>
      </div>
      <div v-else class="mt-8">
        <div v-if="currentDay === $dayjs(currentEvent.date.value).get('D')" class="w-[min(100%,_60%)] m-inline-auto">
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
                @click.native="addToUserCart"
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
            </div>
            <div v-else>
              <CmwButton
                class="gap-2 pl-2 pr-3 py-2"
                :aria-label="$t('enums.accessibility.role.ADD_TO_CART')"
                @click.native="addToUserCart"
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
      <div>
        <div>YOU MISS IT MESSAGE HERE?</div>
      </div>
      <CmwButton :to="localePath('/')" variant="text" class="w-max m-inline-auto" @click.native="addToUserCart">
        <span>{{ $t('common.cta.continueShopping') }}</span>
      </CmwButton>
    </div>
  </div>
</template>
