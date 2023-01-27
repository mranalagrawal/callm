<script>
export default {
  props: ['macrocategories', 'keyword', 'activeMacroCategories'],
  computed: {
    active() {
      return this.activeMacroCategories || this.$route.query[this.keyword]
    },
  },
  methods: {
    goto(id) {
      const query = Object.assign({}, this.$route.query)

      if (query[this.keyword] === id.toString())
        delete query[this.keyword]
      else
        query[this.keyword] = id

      if (id !== this.active)
        query.page = 1

      this.$router.push({
        path: 'catalog',
        query,
      })
    },
  },
}
</script>

<template>
  <div>
    <span
      v-for="macro in macrocategories"
      :key="macro.id"
      class="
      cmw-flex cmw-w-max cmw-rounded cmw-border-2 cmw-px-6 cmw-py-2 cmw-border-primary-400 cmw-cursor-pointer
       cmw-bg-white cmw-text-primary-400 cmw-transition-colors
      hover:(cmw-bg-primary-400 cmw-text-white)"
      @click="goto(macro.id)"
    >
      <span class="cmw-m-auto cmw-select-none">{{ macro.name }}</span>
    </span>
  </div>
</template>
