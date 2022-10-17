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

      <div v-for="item in filteredItems" :key="item.key" class="text-left">
        <div
          class="content-item p-2 d-flex justify-content-between align-items-center pointer"
          @click="goto(item)"
        >
          <div class="small">
            <span>{{ item.name }}</span>
            <span>{{ item.key }}</span>
            <span class="text-muted">({{ item.count }})</span>
          </div>
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
      visible: true,
      /* active: this.$route.query[this.keyword], */
    };
  },
  computed: {
    /* active() {
      return this.$route.query[this.keyword];
    }, */
    filteredItems: function () {
      if (this.search.length > 2) {
        return this.items.filter((el) => el.name.includes(this.search));
      } else {
        return this.items;
      }
    },
  },
  methods: {
    goto(item) {
      const path = this.$route.path;
      return;
      // se filtro non attivo, crealo e appendilo
      const rule = new RegExp(`[${this.keyword}][0-9]+`);

      /* return; */
      if (!path.match(rule)) {
        let newPath = path + this.keyword + item.key;
        this.$router.push({
          path: newPath,
        });
      } else {
        let newPath = path.replace(rule, this.keyword + item.key);
        /* newPath = path.replace() */
        this.$router.push({
          path: newPath,
        });
      }
    },
  },
};
</script>
