<script>
import { computed, reactive } from '@nuxtjs/composition-api'

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

    const setPages = computed(() => {
      console.log(props.totalPages)
      pagination.currentPage = Number(props.currentPage)
      pagination.prevPage = pagination.currentPage > 1 ? (pagination.currentPage - 1) : null

      if (!props.totalPages)
        pagination.nextPage = pagination.currentPage ? (Number(pagination.currentPage) + 1) : 2
      else
        pagination.nextPage = pagination.currentPage < props.totalPages ? (Number(pagination.currentPage) + 1) : null

      for (let i = 0; i < 7; i++) {
        const _p = ((Number(pagination.currentPage) - 4) + i)
        if (_p > 0 && _p <= props.totalPages) {
          console.log(pagination.pageNumbers)
          pagination.pageNumbers.push(_p)
        }
      }
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
