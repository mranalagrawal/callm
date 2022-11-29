<template>
  <div class="container-fluid my-5 bg-light py-5" v-if="data">
    <div class="row py-5 px-0">
      <div class="col-12 text-center">
        <h2 class="font-weight-bold text-dark-primary">{{ label }}</h2>
      </div>
      <div class="col-12 px-0 py-4" v-if="data">
        <VueSlickCarousel v-bind="settings" ref="carousel">
          <div v-for="(item, i) in data" :key="i" class="px-2">
            <div class="selection-card px-3 text-decoration-none">
              <img
                :src="item.icon.url"
                width="24px"
                height="24px"
                class="mr-2"
                style=""
                :style="{ filter: 'contrast(0) brightness(5) !important' }"
              />
              <nuxt-link
                :to="item.link"
                class="text-decoration-none text-white"
              >
                {{ item.label }}
              </nuxt-link>
            </div>
          </div>
        </VueSlickCarousel>
      </div>
    </div>
  </div>
</template>

<script>
import VueSlickCarousel from "vue-slick-carousel";
import "vue-slick-carousel/dist/vue-slick-carousel.css";
// optional style for arrows & dots
import "vue-slick-carousel/dist/vue-slick-carousel-theme.css";
import locales from "../../locales-mapper";

export default {
  components: { VueSlickCarousel },
  data: () => ({
    data: null,
    label: null,
    settings: {
      arrows: false,
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 5.5,
      slidesToScroll: 2,
      autoplay: true,
      speed: 8000,
      autoplaySpeed: 0,
      cssEase: "linear",
      responsive: [
        {
          breakpoint: 1025,
          settings: {
            slidesToShow: 3.5,
          },
        },
        {
          breakpoint: 770,
          settings: {
            slidesToShow: 2.5,
          },
        },
        {
          breakpoint: 420,
          settings: {
            slidesToShow: 1.5,
          },
        },
      ],
    },
  }),
  async fetch() {
    let lang = locales[this.$i18n.locale];

    if (lang == "en-gb" && this.$config.STORE == "CMW") {
      lang = "en-eu";
    }

    const response = await this.$prismic.api.getSingle("selections", {
      lang: lang,
    });

    const items = response.data.body[0].items;
    this.data = items.concat(items).concat(items);
    this.label = response.data.body[0].primary.label;
  },
};
</script>

<style scoped>
.selection-card {
  background: linear-gradient(
    76deg,
    var(--dark-secondary) 1%,
    var(--light-secondary) 95%
  );
  border-radius: 12px;
  height: 88px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  /* pointer-events: none !important; */
}

:deep(.slick-arrow.slick-prev) {
  width: 48px;
  height: 48px;
  background: white;
  box-shadow: 0 0.5rem 1rem rgba(102, 101, 101, 0.5) !important;
  background-image: url("assets/svg/chevron-left.svg") !important;
  background-size: 75%;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99;
}
:deep(.slick-arrow.slick-next) {
  width: 48px;
  height: 48px;
  background: white;
  box-shadow: 0 0.5rem 1rem rgba(102, 101, 101, 0.5) !important;
  background-image: url("assets/svg/chevron-right.svg") !important;
  background-size: 75%;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99;
}
:deep(.slick-prev::before) {
  color: red;
  /* content: "\2039"; */
  content: "";
  font-size: 60px;
  line-height: unset;
}
:deep(.slick-next::before) {
  color: red;
  /* content: "\203A"; */
  content: "";
  font-size: 60px;
  line-height: unset;
}

:deep(.slick-dots li button:before) {
  font-size: 16px;
  opacity: 0.25;
  color: var(--dark-secondary);
}

:deep(.slick-dots li.slick-active button:before) {
  opacity: 1;
}
:deep(.slick-dots) {
  bottom: -48px;
}
</style>
