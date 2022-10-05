<template>
  <div class="container my-5">
    <div v-if="contents" class="row">
      <div class="col-12">
        <div class="col-12 text-center">
          <h2>I nostri partners</h2>
        </div>
      </div>
      <div class="col-12 col-md-8 px-2 mb-3 mb-md-0">
        <div
          class="partners partners-first p-3 text-white d-flex flex-column justify-content-between"
          :style="{
            backgroundImage:
              'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)),url(' +
              contents[1].data.image.url +
              ')',
          }"
        >
          <div class="">
            <p class="small text-uppercase">
              {{ contents[1].data.subtitle[0].text }}
            </p>
            <h3 class="my-3">{{ contents[1].data.title[0].text }}</h3>
            <p class="small">
              {{ contents[1].data.description[0].text }}
            </p>
          </div>
          <div>
            <button class="btn btn-outline-light">Scopri di più</button>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-4 px-2">
        <div
          class="partners partners-last p-3 text-white d-flex flex-column justify-content-end"
          :style="{
            backgroundImage: `url(${mask}),linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)),url('${contents[1].data.image.url}')`,
          }"
        >
          <div class="">
            <p class="small text-uppercase">
              {{ contents[0].data.subtitle[0].text }}
            </p>
            <h3 class="my-3">{{ contents[0].data.title[0].text }}</h3>
            <p class="small">
              {{ contents[0].data.description[0].text }}
            </p>
          </div>
          <div>
            <button class="btn btn-outline-light">Scopri di più</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mask from "assets/images/mask_small.svg";

export default {
  data() {
    return {
      contents: null,
      mask: mask,
    };
  },
  async fetch() {
    this.contents = (
      await this.$prismic.api.query(
        this.$prismic.predicates.at("document.type", "partner")
      )
    ).results;
  },
};
</script>

<style scoped>
.partners {
  border-radius: 10px;
  height: 400px;
}

.partners-first {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
.partners-last {
  background-size: cover;
  background-position: 0px 30px, center, center;
  background-repeat: no-repeat;
}
</style>
