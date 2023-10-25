<script lang="ts">
import { computed, defineComponent, provide, ref, useContext } from '@nuxtjs/composition-api'
import type { PropType } from '@nuxtjs/composition-api'
import type { IProductMapped } from '~/types/product'
import { getUniqueListBy } from '~/utilities/arrays'
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
  setup(props) {
    const { i18n } = useContext()

    const tabs = computed(() => ([
      {
        key: 'description',
        label: i18n.t('product.description'),
        component: 'ProductDetailsTabDescription',
        available: props.product.descriptionHtml,
      },
      {
        key: 'toEnjoyBetter',
        label: i18n.t('product.toEnjoyBetter'),
        component: 'ProductDetailsTabToEnjoyBetter',
        available: props.productDetails.servingTemperature,
      },
      {
        key: 'awardsAndAcknowledgments',
        label: i18n.t('product.awardsAndAcknowledgments'),
        component: 'ProductDetailsTabAwardsAndAcknowledgments',
        available: props.product?.awards.length > 0,
      },
      {
        key: 'producer',
        label: i18n.t('product.producer'),
        component: 'ProductDetailsTabProducer',
        available: props.brand,
      },
      {
        key: 'pairings',
        label: i18n.t('product.pairings'),
        component: 'ProductDetailsTabPairings',
        available: props.productDetails && getUniqueListBy(props.productDetails.foodPairings, 'id'),
      },
    ]))

    const availableTabs = computed(() => tabs.value.filter(tab => tab.available))

    // on load, the first available tab
    const currentTab = ref<string>(tabs.value.find(tab => tab.available)?.component || 'ProductDetailsTabDescription')

    const componentMap = {
      ProductDetailsTabDescription: () => import('~/components/ProductDetails/ProductDetailsTabDescription.vue'),
      ProductDetailsTabToEnjoyBetter: () => import('~/components/ProductDetails/ProductDetailsTabToEnjoyBetter.vue'),
      ProductDetailsTabAwardsAndAcknowledgments: () => import('~/components/ProductDetails/ProductDetailsTabAwardsAndAcknowledgments.vue'),
      ProductDetailsTabProducer: () => import('~/components/ProductDetails/ProductDetailsTabProducer.vue'),
      ProductDetailsTabPairings: () => import('~/components/ProductDetails/ProductDetailsTabPairings.vue'),
    }

    provide('productCharacteristics', props.product.characteristics)

    return {
      availableTabs,
      componentMap,
      currentTab,
      tabs,
    }
  },
  methods: { generateKey },
})
</script>

<template>
  <div class="grid grid-flow-row gap-16 mt-6 md:(grid gap-20 grid-cols-[8fr_4fr] grid-flow-col-dense)">
    <ProductDetailsCharacteristics
      v-if="product.characteristics"
      class="col-start-1 md:col-start-2"
    />
    <div class="overflow-x-auto col-start-1">
      <div
        class="c-navigationTab font-sans justify-between w-full flex no-wrap overflow-x-auto
        border-b border-b-gray-dark mb-3 md:(mt-9)"
      >
        <div
          v-for="({ label, component }) in availableTabs" :key="generateKey(component)"
          class="relative py-2 flex-shrink-0 cmw-font-light text-sm
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
