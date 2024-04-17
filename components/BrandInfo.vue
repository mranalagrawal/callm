<script lang="ts">
import type { PropType } from '@nuxtjs/composition-api'
import { defineComponent, toRefs } from '@nuxtjs/composition-api'

import type { IWineryMapped } from '~/types/winery/winery-front-end'

export default defineComponent({
  props: {
    winery: {
      type: Object as PropType<IWineryMapped>,
      required: true,
    },
  },
  setup(props) {
    const {
      address,
      year,
      hectares,
      ownedGrapes,
      annualProduction,
      oenologist,
      masterDistiller,
    } = toRefs(props.winery)

    return {
      address,
      year,
      hectares,
      ownedGrapes,
      annualProduction,
      oenologist,
      masterDistiller,
    }
  },
})
</script>

<template>
  <table class="w-full">
    <tbody>
      <tr v-if="address.region && address.country">
        <th scope="row" v-text="$t('product.regionCountry')" />
        <td>{{ `${address.region} (${address.country})` }}</td>
      </tr>
      <tr v-if="year">
        <th scope="row" v-text="$t('product.foundation')" />
        <td v-text="year" />
      </tr>
      <tr v-if="hectares">
        <th scope="row" v-text="$t('product.vineyardHectares')" />
        <td v-text="hectares" />
      </tr>
      <tr v-if="annualProduction">
        <th scope="row" v-text="$t('product.annualProduction')" />
        <td v-text="annualProduction" />
      </tr>
      <tr v-if="address.formattedAddress">
        <th scope="row" v-text="$t('product.address')" />
        <td v-text="address.formattedAddress" />
      </tr>
      <tr v-if="oenologist">
        <th scope="row" v-text="$t('winery.oenologist')" />
        <td v-text="oenologist" />
      </tr>
      <tr v-if="masterDistiller">
        <th scope="row" v-text="$t('winery.masterDistiller')" />
        <td v-text="masterDistiller" />
      </tr>
    </tbody>
  </table>
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
  font-size: 0.9rem;
}
</style>
