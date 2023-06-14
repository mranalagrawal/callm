<script>
import { computed, onMounted, useContext, useRoute, watch } from '@nuxtjs/composition-api'

export default {
  layout(context) {
    return context.$config.STORE
  },
  setup() {
    const route = useRoute()
    const { $cmwGtmUtils } = useContext()

    const filtersObj = key => ({
      V: 'winelists',
      C: 'categories',
      R: 'regions',
      D: 'dosagecontents',
      B: 'brands',
      N: 'countries',
      M: 'macros',
      null: 'selections',
    })[key]

    const { filter_key_1, filter_key_2, filter_id_1, filter_id_2 } = route.value.params

    /* Merge all url parameters */
    const inputParameters = computed(() => ({
      ...route.value.query,
      ...((filter_key_1 && filter_id_1) && { [filtersObj(filter_key_1)]: filter_id_1 }),
      ...((filter_key_2 && filter_id_2) && { [filtersObj(filter_key_2)]: filter_id_2 }),
    }))

    const isSearchPage = computed(() => Object.keys(inputParameters.value).includes('search'))

    watch(() => inputParameters.value, () => {
      process.browser && $cmwGtmUtils.pushPage(isSearchPage.value ? 'searchresult' : 'list')
    })
    onMounted(() => {
      process.browser && $cmwGtmUtils.pushPage(isSearchPage.value ? 'searchresult' : 'list')
    })

    return { inputParameters, filtersObj }
  },
}
</script>

<template>
  <SearchFilter :input-parameters="inputParameters" />
</template>
