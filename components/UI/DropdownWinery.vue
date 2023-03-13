<script>
export default {
  props: ['label', 'items', 'keyword'],
  data() {
    return {
      search: '',
      visible: false,
    }
  },
  computed: {
    active() {
      return this.$route.query[this.keyword]
    },
    filteredItems() {
      if (this.search.length > 2)
        return this.items.filter(el => el.name.includes(this.search))
      else
        return this.items
    },
  },
  methods: {
    goto(id) {
      $nuxt.$emit('update-query', { id, keyword: this.keyword })
    },
  },
}
</script>

<template>
  <div class="w-100 d-block">
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
        <b-form-input v-model="search" placeholder="Cerca" />
      </div>

      <div
        v-for="item in filteredItems"
        :key="`${label}_${item.id}`"
        class="text-left"
      >
        <div
          class="content-item p-2 d-flex justify-content-between align-items-center pointer"
          :class="{ 'cmw-bg-primary-50': active === `${item.id}` }"
          @click="goto(item.id)"
        >
          <div>
            <span>{{ item.name }}</span>
          </div>
          <i v-if="active === `${item.id}`" class="fal fa-check float-right" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.content {
  max-height: 350px;
  overflow: auto;
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
