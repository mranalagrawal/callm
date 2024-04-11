<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

import favouriteIcon from '~/assets/svg/selections/favourite.svg'

export default defineComponent({
  props: {
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
    return { favouriteIcon }
  },
})
</script>

<template>
  <div class="mt-6">
    <div v-if="brand">
      <div v-if="brandMetaFields.isPartner" class="ribbon flex items-center">
        <!-- TODO: This will use the new lapel component -->
        <VueSvgIcon
          :data="favouriteIcon"
          class="svg-favourite"
          width="20" height="auto"
        />
        <span class="text-sm !top-0">{{
          $t('product.recommendedByCallmewine')
        }}</span>
      </div>
      <h3 class="text-primary-400">
        {{ brand.title }}
      </h3>
      <div class="grid gap-4 md:grid-cols-[8fr_4fr]">
        <table class="w-full">
          <tbody>
            <tr v-if="brandMetaFields.year">
              <th scope="row" v-text="$t('product.foundation')" />
              <td v-text="brandMetaFields.year" />
            </tr>
            <tr v-if="brandMetaFields.hectares">
              <th scope="row" v-text="$t('product.vineyardHectares')" />
              <td v-text="brandMetaFields.hectares" />
            </tr>
            <tr v-if="brandMetaFields.ownedGrapes">
              <th scope="row" v-text="$t('product.ownGrapes')" />
              <td v-text="brandMetaFields.ownedGrapes" />
            </tr>
            <tr v-if="brandMetaFields.annualProduction">
              <th scope="row" v-text="$t('product.annualProduction')" />
              <td v-text="brandMetaFields.annualProduction" />
            </tr>
            <tr v-if="brandMetaFields.oenologist">
              <th scope="row" v-text="$t('product.winemaker')" />
              <td v-text="brandMetaFields.oenologist" />
            </tr>
            <tr v-if="brandMetaFields.address">
              <th scope="row" v-text="$t('product.address')" />
              <td>{{ brandMetaFields.address }}</td>
            </tr>
          </tbody>
        </table>
        <img v-if="brand.image" :src="brand.image.url" alt="">
      </div>
    </div>
  </div>
</template>

<style scoped>
td,
th {
  border: 1px solid transparent;
  padding: 10px;
}

td {
  text-align: left;
}

tr:nth-child(odd) {
  background-color: theme('colors.gray.lightest');
}

th[scope='col'] {
  font-weight: bold;
}

th[scope='row'] {
  font-weight: bold;
}

table {
  align-self: baseline;
  border-collapse: collapse;
  border: 2px solid transparent;
  letter-spacing: 1px;
  font-family: sans-serif;
  font-size: 0.8rem;
}
</style>
