<script>
export default {
  props: ['label', 'items', 'keyword', 'inputParameters'],
  data() {
    return {
      search: '',
      visible: false,
      /* active: this.$route.query[this.keyword], */
    }
  },
  computed: {
    active() {
      return this.$route.query[this.keyword]
    },
    filteredItems() {
      if (this.search.length > 2) {
        return this.items.filter(el =>
          el.key[1].toLowerCase().includes(this.search.toLowerCase()),
        )
      } else {
        return this.items
      }
    },
    /* filteredItems: function () {
      if (this.search.length > 2) {
        // campo del json del dropdown corrispondente, kv
        const entries = Object.entries(
          this.$t(`elastic.${this.label.toLowerCase()}`)
        );

        // filtro questi kv per presenza, nel valore, del searched, ritorno l'id (numero)
        const xc = entries
          .filter((el) =>
            el[1].toLowerCase().includes(this.search.toLowerCase())
          )
          .map((el) => +el[0]);

        // filtro gli items in base al fatto che l'id (la key) sia presente nella lista di sopra
        const filtered = this.items.filter((el) => xc.includes(el.key[0]));
        return filtered;
      } else {
        return this.items;
      }
    }, */
  },
  methods: {
    isOnParameters(id) {
      return this.inputParameters && this.inputParameters[this.keyword] && this.inputParameters[this.keyword] === `${id}`
    },
    goto(id) {
      const query = Object.assign({}, { ...this.inputParameters, ...this.$route.query })

      /* query[this.keyword] = id; */

      if (query[this.keyword] == id)
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
  <div class="w-100 d-block">
    <!-- {{ items }} -->
    <button
      class="btn d-flex w-100 justify-content-between px-0"
      @click="visible = !visible"
    >
      <span class="small text-dark-secondary text-uppercase">{{ label }}</span>
      <span><i
        class="fal fa-chevron-down text-light-secondary mr-3"
        :class="visible ? 'fa-rotate-180' : ''"
      /></span>
    </button>
    <div v-if="visible" class="content mb-5">
      <div class="px-1 my-3">
        <b-form-input
          v-model="search"
          :placeholder="$t('search.search')"
        />
      </div>

      <div
        v-for="item in filteredItems"
        :key="item.key_as_string"
        class="text-left"
        @click="goto(item.key[0])"
      >
        <div
          class="content-item p-2 d-flex justify-content-between align-items-center pointer"
          :class="item.key[0] === active || isOnParameters(item.key[0]) ? 'active' : ''"
        >
          <div>
            <span>{{ item.key[1] }}</span>
            <!-- <span
              >trad:
              {{ $t(`elastic.${label.toLowerCase()}.${item.key[0]}`) }}</span
            > -->
            <span class="text-muted">({{ item.doc_count }})</span>
          </div>
          <i v-if="item.key[0] === active || isOnParameters(item.key[0])" class="fal fa-check float-right" />
        </div>
        <!-- <p>debug: {{ item.key_as_string }}</p> -->
      </div>
    </div>
  </div>
</template>

<style scoped>
.content {
  max-height: 350px;
  overflow: auto;
}

.content-item {
  font-size: 14px;
}
.content-item:hover {
  background: #fae4e8;
  color: var(--dark-secondary);
}
.active {
  background: #fae4e8;
  color: var(--dark-secondary);
}
</style>
