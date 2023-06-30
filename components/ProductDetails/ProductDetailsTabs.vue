<script lang="ts">
import { defineComponent, ref, useContext } from '@nuxtjs/composition-api'
import type { PropType } from '@nuxtjs/composition-api'
import type { IProductMapped } from '~/types/product'
import { generateKey } from '~/utilities/strings'

export default defineComponent({
  props: {
    product: {
      type: Object as PropType<IProductMapped>,
      required: true,
    },
    productDetails: {
      type: Object,
      required: true,
    },
    brand: {
      type: Object,
      required: false,
    },
    brandMetaFields: {
      type: Object,
      required: false,
    },
  },
  setup() {
    const { i18n } = useContext()

    const tabs = [
      {
        key: 'description',
        label: i18n.t('product.description'),
        component: 'ProductDetailsTabDescription',
      },
      {
        key: 'toEnjoyBetter',
        label: i18n.t('product.toEnjoyBetter'),
        component: 'ProductDetailsTabToEnjoyBetter',
      },
      {
        key: 'awardsAndAcknowledgments',
        label: i18n.t('product.awardsAndAcknowledgments'),
        component: 'ProductDetailsTabAwardsAndAcknowledgments',
      },
      {
        key: 'producer',
        label: i18n.t('product.producer'),
        component: 'ProductDetailsTabProducer',
      },
      {
        key: 'pairings',
        label: i18n.t('product.pairings'),
        component: 'ProductDetailsTabPairings',
      },
    ]

    const currentTab = ref('ProductDetailsTabDescription')

    const componentMap = {
      ProductDetailsTabDescription: () => import('~/components/ProductDetails/ProductDetailsTabDescription.vue'),
      ProductDetailsTabToEnjoyBetter: () => import('~/components/ProductDetails/ProductDetailsTabToEnjoyBetter.vue'),
      ProductDetailsTabAwardsAndAcknowledgments: () => import('~/components/ProductDetails/ProductDetailsTabAwardsAndAcknowledgments.vue'),
      ProductDetailsTabProducer: () => import('~/components/ProductDetails/ProductDetailsTabProducer.vue'),
      ProductDetailsTabPairings: () => import('~/components/ProductDetails/ProductDetailsTabPairings.vue'),
    }

    return {
      tabs,
      currentTab,
      componentMap,
    }
  },
  methods: { generateKey },
})
</script>

<template>
  <div class="mt-6 md:(grid gap-4 grid-cols-[8fr_4fr])">
    <div>
      <div
        class="c-navigationTab font-sans justify-between w-full flex no-wrap overflow-x-auto
        border-b border-b-gray-dark mb-3 md:(mt-9)"
      >
        <div
          v-for="({ label, component }) in tabs" :key="generateKey(component)"
          class="relative py-2 flex-shrink-0 font-light text-sm
                hover:after:(bg-primary text-primary w-full)
                after:(content-DEFAULT transform absolute bottom-0 left-1/2 h-1 transition-progress-bar -translate-x-1/2)"
          :class="component === currentTab ? 'after:(bg-primary text-primary w-full)' : 'after:(w-0 bg-primary-400)'"
        >
          <input
            :id="generateKey(component)"
            v-model="currentTab"
            class="peer appearance-none absolute top-0 left-0 w-full h-full cursor-pointer"
            :value="component" type="radio" name="component"
          >
          <label
            :for="generateKey(component)"
            class="w-max px-4 hover:text-primary cursor-pointer text-gray-dark peer-checked:text-primary"
            v-text="label"
          />
        </div>
      </div>
      <transition>
        <component
          :is="componentMap[currentTab]" v-if="componentMap[currentTab]"
          :product="product" :product-details="productDetails" :brand="brand" :brand-meta-fields="brandMetaFields"
        />
      </transition>
    </div>
    <div class="block">
      <div class="bg-gray-lightest rounded px-6 py-3 mx-auto">
        <h3 class="mb-5" v-text="$t('product.features')" />

        <div v-if="productDetails.denomination[$i18n.locale]">
          <p class="font-bold mb-0" v-text="$t('product.denomination')" />
          <p class="mb-4" v-text="productDetails.denomination[$i18n.locale]" />
          <hr class="border-gray-light">
        </div>
        <div v-if="productDetails.grapes[$i18n.locale]">
          <p class="font-bold mb-0" v-text="$t('product.vines')" />
          <p class="mb-4" v-text="productDetails.grapes[$i18n.locale]" />
          <hr class="border-gray-light">
        </div>

        <div v-if="productDetails.countryName[$i18n.locale] || productDetails.countryRegionName">
          <p class="font-bold mb-0" v-text="$t('product.region')" />
          <p class="mb-4">
            {{ productDetails.countryRegionName }}
            {{ productDetails.countryName[$i18n.locale] }}
          </p>
          <hr class="border-gray-light">
        </div>
        <div v-if="productDetails.alcoholContent">
          <p class="font-bold mb-0" v-text="$t('product.alcoholContent')" />
          <p class="mb-4" v-text="`${productDetails.alcoholContent}%`" />
          <hr class="border-gray-light">
        </div>
        <div v-if="productDetails.size[$i18n.locale]">
          <p class="font-bold mb-0" v-text="$t('product.format')" />
          <p class="mb-4" v-text="productDetails.size[$i18n.locale]" />
          <hr class="border-gray-light">
        </div>
        <div v-if="productDetails.winemaking[$i18n.locale]">
          <p class="font-bold mb-0" v-text="$t('product.vinification')" />
          <p class="mb-4" v-text="productDetails.winemaking[$i18n.locale]" />
          <hr class="border-gray-light">
        </div>
        <div v-if="productDetails.agingDescription[$i18n.locale]">
          <p class="font-bold mb-0" v-text="$t('product.refinement')" />
          <p class="mb-4" v-text="productDetails.agingDescription[$i18n.locale]" />
          <hr class="border-gray-light">
        </div>
        <div v-if="productDetails.productInformations[$i18n.locale]">
          <p class="font-bold mb-0" v-text="$t('product.additionalNotes')" />
          <p class="mb-4" v-text="productDetails.productInformations[$i18n.locale]" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.c-navigationTab::-webkit-scrollbar {
  height: 0;
}

.c-navigationTab::-webkit-scrollbar-track {
  background-color: transparent;
}

.c-navigationTab::-webkit-scrollbar-thumb {
  background-color: transparent;
}
</style>
