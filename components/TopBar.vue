<template>
  <div
    class="container-fluid bg-dark-green py-2 text-white text-center fixed-top"
    style="z-index: 1050"
  >
    <span class="small" v-if="data" v-html="data.data.text[0].text"></span>
  </div>
</template>

<script>
export default {
  watch: {
    "$i18n.locale": "$fetch",
  },
  data: () => ({
    selectedItem: "",
    selectedContent: null,
    data: null,
    document: null,
  }),
  async fetch() {
    let lang = "";
    if (this.$i18n.locale == "en") {
      lang = "en-gb";
    } else {
      lang = "it-it";
    }
    this.data = await this.$prismic.api.getSingle("topbar", { lang: lang });
  },
};
</script>
