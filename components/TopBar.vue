<template>
  <div
    class="container-fluid bg-dark-primary py-2 text-white text-center fixed-top"
    style="z-index: 1050"
  >
    <span
      class="d-md-none"
      v-if="data"
      v-html="data.data.text[0].text"
      style="font-size: 9px"
    ></span>
    <span
      class="small d-none d-md-block"
      v-if="data"
      v-html="data.data.text[0].text"
    ></span>
  </div>
</template>

<script>
import documents from "../prismic-mapper";
import locales from "../locales-mapper";
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
    /* let lang = "";
    if (this.$i18n.locale == "en") {
      lang = "en-gb";
    } else if (this.$i18n.locale == "de") {
      lang = "de-de";
    } else {
      lang = "it-it";
    } */

    let lang = locales[this.$i18n.locale];
    if (lang == "en-gb" && this.$config.STORE == "CMW") {
      lang = "en-eu";
    }

    this.data = await this.$prismic.api.getSingle(
      documents[this.$config.STORE].topbar,
      { lang: lang }
    );
  },
};
</script>
