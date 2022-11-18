<template>
  <div v-if="contents" class="container-fluid px-md-5 my-5">
    <div class="row">
      <div class="col-12 text-center my-3">
        <h4>{{ contents[0].data["call-to-action"][0].text }}</h4>
      </div>
    </div>
    <div
      class="row cta-banner py-5"
      :style="{
        backgroundImage:
          'linear-gradient(90deg,rgba(0,0,0,0) 10%,rgba(0,0,0,1), rgba(0,0,0,1)),url(' +
          contents[0].data.image.url +
          ')',
      }"
    >
      <div class="col-12 col-md-7 offset-md-5 py-3">
        <h2>{{ contents[0].data["title"][0].text }}</h2>
        <p class="lead">
          {{ contents[0].data.subtitle[0].text }}
        </p>
        <nuxt-link
          :to="contents[0].data.cta_link || '/'"
          class="btn btn-outline-light mt-5 px-5"
        >
          {{ contents[0].data.cta_button }}
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      contents: null,
    };
  },
  async fetch() {
    this.contents = (
      await this.$prismic.api.query(
        this.$prismic.predicates.at("document.type", "call-to-action")
      )
    ).results;
  },
};
</script>

<style scoped>
.cta-banner {
  border-radius: 10px;
  background-size: cover;
  color: white;
}
</style>
