<script>
import { computed, useRoute } from '@nuxtjs/composition-api'

export default {
  layout(context) {
    return context.$config.STORE
  },
  setup() {
    const route = useRoute()

    const filtersObj = key => ({
      V: 'winelists',
      C: 'categories',
      R: 'regions',
      D: 'dosagecontents',
      B: 'brands',
      N: 'countries',
      M: 'macrocategories',
      null: 'selections',
    })[key]

    const { filter_key_1, filter_key_2, filter_id_1, filter_id_2 } = route.value.params

    /* Merge all url parameters */
    const inputParameters = computed(() => ({
      ...route.value.query,
      ...((filter_key_1 && filter_id_1) && { [filtersObj(filter_key_1)]: filter_id_1 }),
      ...((filter_key_2 && filter_id_2) && { [filtersObj(filter_key_2)]: filter_id_2 }),
    }))

    return { inputParameters, filtersObj }
  },
}
</script>

<template>
  <search-filter :input-parameters="inputParameters" />
</template>
