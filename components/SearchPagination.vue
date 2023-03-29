<script>
import { computed, reactive, toRefs } from '@nuxtjs/composition-api'

export default {
  props: {
    totalPages: {
      type: Number,
      required: true,
    },
    currentPage: {
      type: Number,
    },
  },
  setup(props) {
    const pagination = reactive({
      prevPage: 0,
      nextPage: 0,
      currentPage: 1,
      pageNumbers: [],
    })

    const { totalPages, currentPage } = toRefs(props)

    const setPages = computed(() => {
      pagination.currentPage = Number(currentPage.value)
      pagination.prevPage = pagination.currentPage > 1 ? pagination.currentPage - 1 : null
      pagination.nextPage = totalPages ? (pagination.currentPage < totalPages.value ? pagination.currentPage + 1 : null) : pagination.currentPage + 1
      pagination.pageNumbers = Array.from({ length: totalPages.value }, (_, i) => i + 1)
        .filter(page => Math.abs(page - pagination.currentPage) < 4)
    })

    return { pagination, setPages }
  },
}
</script>

<template>
  <pre>{{ pagination }}</pre>
</template>

<style scoped>

</style>
