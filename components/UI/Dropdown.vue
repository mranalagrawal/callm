<template>
  <b-dropdown variant="white" no-caret no-flip>
    <template #button-content>
      <span class="small text-dark-red text-uppercase">{{ label }}</span>
      <i class="fal fa-chevron-down ml-3 text-light-red"></i>
    </template>

    <div class="px-4 my-3">
      <b-form-input v-model="search" placeholder="Cerca"></b-form-input>
    </div>

    <b-dropdown-item
      v-for="(item, i) in filteredItems"
      :key="i"
      class="mb-2"
      :href="item.label"
      ><span>{{ item.label }}</span>
      <span>({{ item.link }})</span></b-dropdown-item
    >
  </b-dropdown>
</template>

<script>
export default {
  props: ["label", "items"],
  data() {
    return {
      search: "",
    };
  },
  computed: {
    filteredItems: function () {
      if (this.search.length > 2) {
        return this.items.filter((el) => el.label.includes(this.search));
      } else {
        return this.items;
      }
    },
  },
};
</script>
