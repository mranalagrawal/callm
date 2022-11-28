<template>
  <div>
    <span
      v-for="macro in macrocategories"
      :key="macro.id"
      class="mx-1 btn rounded-pill border border-light-secondary py-0"
      :class="active == macro.id ? 'btn-light-secondary' : ''"
      @click="goto(macro.id)"
    >
      <span class="small">{{ macro.name }}</span>
    </span>
  </div>
</template>

<script>
export default {
  props: ["macrocategories", "keyword", "activeMacroCategories"],
  computed: {
    active() {
      return this.activeMacroCategories || this.$route.query[this.keyword];
    },
  },
  methods: {
    goto(id) {
      const query = Object.assign({}, this.$route.query);

      if (query[this.keyword] == id) {
        delete query[this.keyword];
      } else {
        query[this.keyword] = id;
      }

      if (id !== this.active) query["page"] = 1;

      this.$router.push({
        path: "catalog",
        query: query,
      });
    },
  },
};
</script>
