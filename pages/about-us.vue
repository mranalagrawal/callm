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
export default {
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
    const response = await this.$prismic.api.getSingle("about_us", {
      lang: lang,
    });
    const data = response.data;
    this.data = data;
    console.log(data, "data");
  },
};
</script>