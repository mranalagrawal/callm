<template>
  <div class="container-fluid px-md-5 mt-5" v-if="data">
    <div class="row">
      <div class="col-12">
        <h1>{{ data.title }}</h1>
      </div>
      <div class="col-12">
        <img :src="data.image.url" class="img-fluid w-100" alt="" />
      </div>
    </div>
    <div class="row mt-5" v-for="(section, i) in data.section" :key="i">
      <div
        class="col-12"
        v-for="(content, j) in section.section_content"
        :key="j"
      >
        <!-- <prismic-rich-text :field="content.text" /> -->
        <prismic-rich-text :field="[content]" />

        <!-- {{ content }} -->
      </div>
    </div>
  </div>
</template>

<script>
import documents from "../prismic-mapper";

export default {
  layout(context) {
    return context.$config.STORE;
  },
  data() {
    return {
      data: null,
    };
  },
  async fetch() {
    let lang = "";
    if (this.$i18n.locale == "en") {
      lang = "en-gb";
    } else {
      lang = "it-it";
    }

    const data = await this.$prismic.api.getSingle(
      documents[this.$config.STORE].aboutUs,
      { lang: lang }
    );
    this.data = data.data;
  },
};
</script>
