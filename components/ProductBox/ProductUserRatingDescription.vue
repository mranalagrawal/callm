<script lang="ts">
import { computed, defineComponent, inject, ref } from '@nuxtjs/composition-api'
import { storeToRefs } from 'pinia'

import type { IProductRating } from '~/types/product'

import { generateKey } from '~/utilities/strings'
import ratingEmpty from '~/assets/svg/rating-empty.svg'
import ratingFilled from '~/assets/svg/rating-filled.svg'
import { useCustomerWishlist } from '~/store/customerWishlist'

export default defineComponent({
  props: {
    productId: {
      type: [Number, String],
      required: true,
    },
  },
  emits: ['submit-comment'],
  setup(props, { emit }) {
    const customerWishlist = useCustomerWishlist()
    const { elements } = storeToRefs(customerWishlist)
    const isDesktop = inject('isDesktop')
    const currentHoveredStar = ref(0)
    const hasFocus = ref(false)
    const formEl = ref<HTMLFormElement | null>(null)

    const currentProduct = computed<IProductRating | undefined>(() => elements.value.find(
      (w: Record<string, any>) => `'P${props.productId}'` === `'P${w.productFeId}'`))

    const customerMessage = ref(currentProduct.value?.description || '')

    const handleReset = () => {
      hasFocus.value = false
      customerMessage.value = currentProduct.value?.description || ''
    }

    const onSubmit = async () => {
      const { isValid } = await formEl.value?.validateWithInfo()

      if (!isValid) { return }

      hasFocus.value = false
      emit('submit-comment', {
        score: currentProduct.value?.score || 0,
        description: customerMessage.value,
      })
    }

    return {
      currentHoveredStar,
      currentProduct,
      customerMessage,
      elements,
      formEl,
      handleReset,
      hasFocus,
      isDesktop,
      onSubmit,
      ratingEmpty,
      ratingFilled,
    }
  },
  methods: { generateKey },
})
</script>

<template>
  <ValidationObserver ref="formEl" slim>
    <form
      class="my-2"
      @submit.prevent="onSubmit"
    >
      <ValidationProvider
        v-slot="{ errors }"
        vid="message"
        :rules="{ required: false }"
        name="message"
        slim
      >
        <div class="relative">
          <textarea
            :id="generateKey(`${productId}-message`)"
            v-model="customerMessage"
            :placeholder="$t('profile.ratingMessage')"
            :rows="hasFocus || customerMessage ? '3' : isDesktop ? '1' : '2'"
            class="
              peer px-4 text-gray-dark py-3 w-full bg-transparent border border-gray-light
              rounded transition-colors
              hover:(border-gray)
              focus:(outline-none border-gray-dark placeholder-gray-light)
              autofill:(text-body border-info text-base)
              disabled:(border-gray-light/70 cursor-not-allowed)
"
            @focus="hasFocus = true"
          />
          <label
            :for="generateKey(`${productId}-message`)"
            class="sr-only"
          >{{ $t('profile.ratingMessage') }}</label>
        </div>
        <span v-if="!!errors.length" class="block text-sm text-error">{{ errors[0] }}</span>
      </validationprovider>
      <div v-if="hasFocus" class="flex ml-auto max-w-1/3">
        <CmwButton :label="$t('common.cta.cancel')" type="button" size="sm" variant="text" @click.native="handleReset" />
        <CmwButton :label="$t('common.cta.save')" type="submit" size="sm" variant="text" />
      </div>
    </form>
  </ValidationObserver>
</template>
