<template>
  <div
    class="container-fluid bg-dark-green py-2 text-white text-center position-relative"
    style="font-size: 12px; z-index: 1030"
  >
    <span v-if="data" v-html="data.data.text[0].text"></span>

    <span class="position-absolute" style="right: 10px">
      <nuxt-link
        class=""
        v-if="$i18n.locale !== 'en'"
        :to="switchLocalePath('en')"
      >
        🇬🇧
      </nuxt-link>

      <nuxt-link
        class=""
        v-if="$i18n.locale !== 'it'"
        :to="switchLocalePath('it')"
      >
        🇮🇹
      </nuxt-link>
    </span>
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
    console.log(this.$i18n.locale, "LAN");

    let lang = "";
    if (this.$i18n.locale == "en") {
      lang = "en-gb";
    } else {
      lang = "it-it";
    }
    this.data = await this.$prismic.api.getSingle("topbar", { lang: lang });
    /* console.log(this.data); */
  },
};
</script>
