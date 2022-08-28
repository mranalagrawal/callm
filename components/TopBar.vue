<template>
  <div
    class="container-fluid bg-dark-green py-2 text-white text-center"
    style="font-size: 12px"
  >
    <span v-if="data" v-html="data.data.text[0].text"></span>
  </div>
</template>

<script>
export default {
  data: () => ({
    selectedItem: "",
    selectedContent: null,
    data: null,
    document: null,
  }),
  async fetch() {
    this.data = await this.$prismic.api.getSingle("topbar");
  },
};
</script>
