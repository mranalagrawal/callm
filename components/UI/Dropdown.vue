<template>
  <div class="w-100 d-block">
    <button
      class="btn d-flex w-100 justify-content-between px-0"
      @click="visible = !visible"
    >
      <span class="small text-dark-red text-uppercase">{{ label }}</span>
      <span
        ><i
          class="fal fa-chevron-down text-light-red mr-3"
          :class="visible ? 'fa-rotate-180' : ''"
        ></i
      ></span>
    </button>
    <div v-if="visible" class="content mb-5">
      <div class="px-1 my-3">
        <b-form-input v-model="search" placeholder="Cerca"></b-form-input>
      </div>

      <div
        v-for="item in filteredItems"
        :key="item.key_as_string"
        class="text-left"
        @click="goto(item.key[0])"
      >
        <div
          class="content-item p-2 d-flex justify-content-between align-items-center pointer"
          :class="item.key[0] == active ? 'active' : ''"
        >
          <div>
            <span>{{ item.key[1] }}</span>
            <span class="text-muted">({{ item.doc_count }})</span>
          </div>
          <i class="fal fa-check float-right" v-if="item.key[0] == active"></i>
        </div>
        <!-- <p>debug: {{ item.key_as_string }}</p> -->
      </div>
    </div>
  </div>
</template>

<style scoped>
.content {
  max-height: 350px;
  overflow: scroll;
}
.content-item:hover {
  background: #fae4e8;
  color: var(--dark-red);
}
.active {
  background: #fae4e8;
  color: var(--dark-red);
}
</style>

<script>
export default {
  props: ["label", "items", "keyword"],
  data() {
    return {
      search: "",
      visible: false,
      /* active: this.$route.query[this.keyword], */
    };
  },
  computed: {
    active() {
      return this.$route.query[this.keyword];
    },
    filteredItems: function () {
      if (this.search.length > 2) {
        return this.items.filter((el) => el.key[1].includes(this.search));
      } else {
        return this.items;
      }
    },
  },
  methods: {
    goto(id) {
      const query = Object.assign({}, this.$route.query);

      /* query[this.keyword] = id; */

      if (query[this.keyword] == id) {
        delete query[this.keyword];
      } else {
        query[this.keyword] = id;
      }

      if (id !== this.active) query["page"] = 1;

      this.$router.push({
        path: "search",
        query: query,
      });
    },
  },
};
</script>
