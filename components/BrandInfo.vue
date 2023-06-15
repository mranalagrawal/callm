<script>
import { toRefs } from '@nuxtjs/composition-api'

export default {
  props: {
    metaFields: {
      type: Object,
    },
  },
  setup(props) {
    const { address, country, region, year, hectares, ownedGrapes, annualProduction } = toRefs(props.metaFields)
    return { address, country, region, year, hectares, ownedGrapes, annualProduction }
  },
}
</script>

<template>
  <table class="w-full">
    <tbody>
      <tr v-if="region && country">
        <th scope="row" v-text="$t('product.region')" />
        <td>{{ `${region} (${country})` }}</td>
      </tr>
      <tr v-if="year">
        <th scope="row" v-text="$t('product.foundation')" />
        <td v-text="year" />
      </tr>
      <tr v-if="hectares">
        <th scope="row" v-text="$t('product.vineyardHectares')" />
        <td v-text="hectares" />
      </tr>
      <tr v-if="ownedGrapes">
        <th scope="row" v-text="$t('product.proprietaryGrapes')" />
        <td v-text="ownedGrapes" />
      </tr>
      <tr v-if="annualProduction">
        <th scope="row" v-text="$t('product.annualProduction')" />
        <td v-text="annualProduction" />
      </tr>
      <tr v-if="address">
        <th scope="row" v-text="$t('product.address')" />
        <td v-text="address" />
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
  font-family: sans-serif;
  font-size: 0.8rem;
}
</style>
