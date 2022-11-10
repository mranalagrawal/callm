<template>
  <div class="container my-5">
    <div v-if="data" class="row px-3">
      <div class="col-12">
        <div class="col-12 text-center mt-5 mb-5">
          <h2 class="text-center font-weight-bold text-dark-primary">
            {{ label }}
          </h2>
        </div>
      </div>
      <div class="col-12 col-md-8 px-0 mb-3 mb-md-0">
        <div
          class="partners partners-first p-3 text-white d-flex flex-column justify-content-end"
          :style="{
            backgroundImage: `url(${mask_left}),url('${data[0].content.image.url}')`,
          }"
        >
          <div class="w-50">
            <h3 class="mb-5 font-weight-bold">
              {{ data[0].content.main_text }}
            </h3>
          </div>
          <div>
            <nuxt-link
              :to="data[0].content.cta_link"
              class="btn btn-cta mb-3 px-5 py-2"
            >
              {{ data[0].content.cta_text }}
            </nuxt-link>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-4 px-0 pl-md-4">
        <div
          class="partners partners-last p-3 text-white d-flex flex-column justify-content-end"
          :style="{
            backgroundImage: `url(${mask}), url('${data[1].content.image.url}')`,
          }"
        >
          <div class="w-75">
            <h3 class="mb-5 font-weight-bold">
              {{ data[1].content.main_text }}
            </h3>
          </div>
          <div>
            <nuxt-link
              :to="data[1].content.cta_link"
              class="btn btn-cta mb-3 px-5 py-2"
            >
              {{ data[1].content.cta_text }}
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mask from "assets/images/mask_small.svg";
import mask_left from "assets/images/mask_left.svg";

export default {
  data() {
    return {
      contents: null,
      mask: mask,
      mask_left: mask_left,
      data: null,
      label: null,
    };
  },
  async fetch() {
    let lang = "";
    if (this.$i18n.locale == "en") {
      lang = "en-gb";
    } else {
      lang = "it-it";
    }
    const response = await this.$prismic.api.getSingle("partners", {
      lang: lang,
    });
    const data = response.data.body.map((el) => {
      return {
        id: el.id,
        content: el.items[0],
      };
    });
    this.data = data;
    console.log(data);
    this.label = response.data.body[0].primary.label;
  },
};
</script>

<style scoped>
.btn-cta {
  text-transform: uppercase;
  padding-top: 12px !important;
  padding-bottom: 12px !important;
  border-radius: 10px;
  font-weight: 600;
  border: 2px solid white;
  color: white;
}
.btn-cta:hover {
  background: #da4865;
}

.partners {
  height: 400px;
}

.partners-first {
  background-size: cover;
  background-position: -150px, center;
  background-repeat: no-repeat;
  border-radius: 0px 0px 10px 10px;
}
.partners-last {
  background-size: cover;
  background-position: 0px 60px, center, center;
  background-repeat: no-repeat;
  border-radius: 0px 0px 10px 10px;
}
</style>
