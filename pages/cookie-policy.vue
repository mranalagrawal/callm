<template>
  <div class="container-fluid px-md-5 mt-5" v-if="data">
    <div class="row">
      <div class="col-12">
        <h1>{{ data.title }}</h1>
      </div>
      <div class="col-12">
        <img
          v-if="data.image.url"
          :src="data.image.url"
          class="img-fluid w-100"
          alt=""
        />
      </div>
    </div>
    <div class="row mt-5">
      <div class="col-12" v-for="(content, j) in data.section" :key="j">
        <prismic-rich-text :field="[content]" />
      </div>
    </div>
  </div>
</template>

<script>
import documents from "../prismic-mapper";

export default {
  data() {
    return {
      data: null,
    };
  },
  layout(context) {
    return context.$config.STORE;
  },
  async fetch() {
    let lang = "";
    if (this.$i18n.locale == "en") {
      lang = "en-gb";
    } else {
      lang = "it-it";
    }
    const response = await this.$prismic.api.getSingle(
      documents[this.$config.STORE].cookiePage,
      {
        lang: lang,
      }
    );
    const data = response.data;
    this.data = data;
  },
};
</script>
