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

    return { tabs, currentTab, componentMap }
  },
  methods: { generateKey },
})
</script>

<template>
  <div class="cmw-mt-6 md:(cmw-grid cmw-gap-4 cmw-grid-cols-[8fr_4fr])">
    <div>
      <div
        class="c-navigationTab cmw-font-sans cmw-justify-between cmw-w-full cmw-flex cmw-no-wrap cmw-overflow-x-auto
        cmw-border-b cmw-border-b-gray-dark cmw-mb-3 md:(cmw-mt-9 cmw-max-w-10/12)"
      >
        <div
          v-for="({ label, component }) in tabs" :key="generateKey(component)"
          class="cmw-relative cmw-py-2 cmw-flex-shrink-0 cmw-font-light cmw-text-sm
                hover:(cmw-no-underline)
                hover:after:(cmw-bg-primary cmw-text-primary cmw-w-full)
                after:(cmw-content-DEFAULT cmw-transform cmw-absolute cmw-bottom-0 cmw-left-1/2 cmw-h-1 cmw-transition-progress-bar cmw-translate-x-[-50%])"
          :class="component === currentTab ? 'after:(cmw-bg-primary cmw-text-primary cmw-w-full)' : 'after:(cmw-w-0 cmw-bg-primary-400)'"
        >
          <input
            :id="generateKey(component)"
            v-model="currentTab" class="peer cmw-appearance-none cmw-absolute cmw-top-0 cmw-left-0 cmw-w-full cmw-h-full cmw-cursor-pointer"
            :value="component" type="radio" name="component"
          >
          <label
            :for="generateKey(component)"
            class="cmw-w-max cmw-px-4 hover:cmw-text-primary cmw-cursor-pointer cmw-text-gray-dark peer-checked:cmw-text-primary"
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
    <div class="cmw-block">
      <div style="width: 80%" class="bg-light p-3 mx-auto cmw-rounded">
        <h3 class="mb-5">
          {{ $t('product.features') }}
        </h3>

        <div v-if="productDetails.denomination[$i18n.locale]">
          <p class="font-weight-bold mb-0">
            {{ $t('product.denomination') }}
          </p>
          <p class="mb-4">
            {{ productDetails.denomination[$i18n.locale] }}
          </p>
          <hr>
        </div>
        <div v-if="productDetails.grapes[$i18n.locale]">
          <p class="font-weight-bold mb-0">
            {{ $t('product.vines') }}
          </p>
          <p class="mb-4">
            {{ productDetails.grapes[$i18n.locale] }}
          </p>
          <hr>
        </div>

        <div
          v-if="
            productDetails.countryName[$i18n.locale]
              || productDetails.countryRegionName
          "
        >
          <p class="font-weight-bold mb-0">
            {{ $t('product.region') }}
          </p>
          <p class="mb-4">
            {{ productDetails.countryRegionName }}
            {{ productDetails.countryName[$i18n.locale] }}
          </p>
          <hr>
        </div>
        <div v-if="productDetails.alcoholContent">
          <p class="font-weight-bold mb-0">
            {{ $t('product.alcoholContent') }}
          </p>
          <p class="mb-4">
            {{ productDetails.alcoholContent }}%
          </p>
          <hr>
        </div>
        <div v-if="productDetails.size[$i18n.locale]">
          <p class="font-weight-bold mb-0">
            {{ $t('product.format') }}
          </p>
          <p class="mb-4">
            {{ productDetails.size[$i18n.locale] }}
          </p>
          <hr>
        </div>
        <div v-if="productDetails.winemaking[$i18n.locale]">
          <p class="font-weight-bold mb-0">
            {{ $t('product.vinification') }}
          </p>
          <p class="mb-4">
            {{ productDetails.winemaking[$i18n.locale] }}
          </p>
          <hr>
        </div>
        <div v-if="productDetails.agingDescription[$i18n.locale]">
          <p class="font-weight-bold mb-0">
            {{ $t('product.refinement') }}
          </p>
          <p class="mb-4">
            {{ productDetails.agingDescription[$i18n.locale] }}
          </p>
          <hr>
        </div>
        <div v-if="productDetails.productInformations[$i18n.locale]">
          <p class="font-weight-bold mb-0">
            {{ $t('product.additionalNotes') }}
          </p>
          <p class="mb-4">
            {{ productDetails.productInformations[$i18n.locale] }}
          </p>
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
