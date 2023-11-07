<script lang="ts">
import type { PropType } from '@nuxtjs/composition-api'
import { computed, defineComponent, useContext } from '@nuxtjs/composition-api'
import closeIcon from 'assets/svg/close.svg'
import { storeToRefs } from 'pinia'
import { useShopifyCart } from '~/store/shopifyCart'
import { shopifyRichTextToHTML } from '~/utilities/shopify'
import type { IEventDay } from '~/pages/calendario-avvento-2023.vue'
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
    const { $productMapping } = useContext()
    const { shopifyCart } = storeToRefs(useShopifyCart())
    const { cartLinesAdd, createShopifyCart } = useShopifyCart()
    const description = computed(() => shopifyRichTextToHTML(props.currentEvent.description?.value || ''))
    const product = computed(() => $productMapping.fromShopify([props.currentEvent.product.reference])[0] || [])

    return {
      cartLinesAdd,
      closeIcon,
      createShopifyCart,
      description,
      product,
      shopifyCart,
    }
  },
  methods: {
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
  },
})
</script>

<template>
  <div class="w-[min(100%,_40rem)] m-inline-auto bg-white relative p-4 rounded my-4 border border-primary">
    <ButtonIcon class="absolute top-2 right-2" :icon="closeIcon" variant="filled-white" @click.native="$emit('close-event')" />
    <div class="">
      <div class="text-2xl text-primary text-center cmw-font-bold py-8" v-text="currentEvent.title.value" />
      <img
        class="max-w-40 m-inline-auto" :src="currentEvent.image.reference.image.url" :alt="currentEvent.image.reference.image.altText"
      >
      <div v-html="description" />
      <CmwButton v-if="currentEvent.type.value === 'Gift'" variant="ghost" class="w-max m-inline-auto mt-8">
        <span>{{ $t('common.cta.continueShopping') }}</span>
      </CmwButton>
      <CmwButton v-else variant="ghost" class="w-max m-inline-auto mt-8" @click.native="addToUserCart">
        <span>{{ $t('common.cta.addToCart') }}</span>
      </CmwButton>
    </div>
  </div>
</template>
