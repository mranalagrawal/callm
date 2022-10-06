<template>
  <div class="container my-5">
    <div v-if="data" class="row">
      <div class="col-12">
        <div class="col-12 text-center mt-5 mb-5">
          <h2 class="text-center font-weight-bold text-dark-green">
            I nostri partners
          </h2>
        </div>
      </div>
      <div class="col-12 col-md-8 px-2 mb-3 mb-md-0">
        <div
          class="partners partners-first p-3 text-white d-flex flex-column justify-content-between"
          :style="{
            backgroundImage: `url(${mask_left}),url('${data[0].content.image.url}')`,
          }"
        >
          <div class="w-50">
            <p class="text-uppercase pt-5">
              {{ data[0].content.upper_text }}
            </p>
            <h3 class="my-3 font-weight-bold">
              {{ data[0].content.main_text }}
            </h3>
            <p class="">
              {{ data[0].content.lower_text }}
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
            backgroundImage: `url(${mask}), url('${data[1].content.image.url}')`,
          }"
        >
          <div class="">
            <p class="small text-uppercase">
              {{ data[1].content.upper_text }}
            </p>
            <h3 class="my-3">{{ data[1].content.main_text }}</h3>
            <p class="small">
              {{ data[1].content.lower_text }}
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
import mask_left from "assets/images/mask_left.svg";

export default {
  data() {
    return {
      contents: null,
      mask: mask,
      mask_left: mask_left,
      data: null,
    };
  },
  async fetch() {
    console.log(this.$i18n.locale, "LAN");

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
    console.log(data, "partners");
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
  background-position: -150px, center;
  background-repeat: no-repeat;
}
.partners-last {
  background-size: cover;
  background-position: 0px 60px, center, center;
  background-repeat: no-repeat;
}
</style>
