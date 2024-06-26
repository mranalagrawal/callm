<script lang="ts">
import { computed, defineComponent } from '@nuxtjs/composition-api'
import type { PropType } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    inputParameters: {
      type: Object as PropType<Record<string, any>>,
      required: true,
    },
    aggregations: {
      type: Object as PropType<Record<string, any>>,
      required: true,
    },
  },
  emits: ['item-clicked'],
  setup(props, { emit }) {
    const aggMacros = computed(() => props.aggregations['agg-macros'].inner.result.buckets.map((item: any) => ({
      doc_count: item.doc_count,
      name: item.name.buckets[0].key,
      key: item.key,
      keyword: 'macros',
    })))

    const aggCategories = computed(() => props.aggregations['agg-categories'].inner.result.buckets.map((item: any) => ({
      doc_count: item.doc_count,
      name: item.name.buckets[0].key,
      key: item.key,
      keyword: 'categories',
    })))

    const hasMacrosSelected = computed(() => Object.keys(props.inputParameters).includes('macros'))
    const hasCategorySelected = computed(() => Object.keys(props.inputParameters).includes('categories'))

    const handleUpdateValue = (val: string) => {
      emit('item-clicked', val)
    }

    const mainFilters = computed(() => {
      let finalFilters = []
      if (!hasMacrosSelected.value && !hasCategorySelected.value) {
        finalFilters = aggMacros.value
      } else if (hasMacrosSelected.value && !hasCategorySelected.value) {
        finalFilters = aggCategories.value
      } else {
        finalFilters = aggCategories.value.filter((item: any) => `${item.key}` !== `${props.inputParameters.categories}`)
      }

      return finalFilters.slice(0, 15)
    })

    return {
      mainFilters,
      hasMacrosSelected,
      hasCategorySelected,
      handleUpdateValue,
    }
  },
})
</script>

<template>
  <div
    class="c-scrollbar flex overflow-auto gap-4 md:(flex-wrap) js-button-filter-list"
    :class="{ 'my-8': !!mainFilters.length }"
  >
    <button
      v-for="({ key, name, keyword }) in mainFilters" :key="key"
      class="
      btn-base
      text-sm rounded-sm px-3 py-1 flex-shrink-0 w-max border-primary-400 bg-white text-primary-400
      md:(px-4 py-[0.4rem])
      hover:(bg-primary-50)
"
      @click="handleUpdateValue(JSON.stringify({ id: key, keyword }))"
    >
      {{ name }}
    </button>
  </div>
</template>

<style scoped>
.c-scrollbar::-webkit-scrollbar {
  display:none;
}
</style>
