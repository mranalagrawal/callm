<template>
  <div class="container-fluid my-5 bg-light py-5">
    <!-- <div v-for="product in products" :key="product.id">{{ product.title }}</div> -->
    <div class="row py-5 px-0">
      <div class="col-12 text-center">
        <h2>{{ label }}</h2>
      </div>

      <div class="col-12 px-0 py-4">
        <VueSlickCarousel v-bind="settingsTop" ref="carousel-top" v-if="data">
          <div v-for="productor in data" :key="productor.name" class="">
            <div class="bg-white mx-2 p-1 product-card">
              <nuxt-link :to="productor.link">
                <img
                  :src="productor.logo.url"
                  alt=""
                  height="120px"
                  class="mx-auto d-block"
                />
              </nuxt-link>
            </div>
          </div>
        </VueSlickCarousel>
      </div>
      <div class="col-12 px-0 py-4">
        <VueSlickCarousel
          v-bind="settingsBottom"
          ref="carousel-bottom"
          v-if="data"
        >
          <div v-for="productor in data" :key="productor.name" class="">
            <div class="bg-white mx-2 p-1 product-card">
              <nuxt-link :to="productor.link">
                <img
                  :src="productor.logo.url"
                  alt=""
                  height="120px"
                  class="mx-auto d-block"
                />
              </nuxt-link>
            </div>
          </div>
        </VueSlickCarousel>
      </div>
    </div>
  </div>
</template>

<script>
import documents from "../../prismic-mapper";

import VueSlickCarousel from "vue-slick-carousel";

import "vue-slick-carousel/dist/vue-slick-carousel-theme.css";
import locales from "../../locales-mapper";

export default {
  components: { VueSlickCarousel },
  data: () => ({
    data: null,
    label: null,
    settingsTop: {
      arrows: false,
      dots: false,
      infinite: true,
      slidesToShow: 5,
      slidesToScroll: 2,
      autoplay: true,
      speed: 8000,
      autoplaySpeed: 0,
      cssEase: "linear",
      pauseOnFocus: false,
      pauseOnHover: false,
      rtl: false,

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
    settingsBottom: {
      arrows: false,
      dots: false,
      infinite: true,
      slidesToShow: 5,
      slidesToScroll: 2,
      autoplay: true,
      speed: 8000,
      autoplaySpeed: 0,
      cssEase: "linear",
      pauseOnFocus: false,
      pauseOnHover: false,
      rtl: true,
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

    const response = await this.$prismic.api.getSingle(
      documents[this.$config.STORE]["productors"],
      {
        lang: lang,
      }
    );
    const data = response.data.productor;

    this.data = data.concat(data);
    this.label = response.data.label;
  },
};
</script>

<style scoped>
.productor-card {
  /* background: linear-gradient(76deg, #751f3d 1%, #ad2b48 95%); */
  border-radius: 12px;
  height: 120px;
  width: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
}

.product-card {
  box-shadow: 0 2px 6px 0 rgb(58 58 58 / 23%);
  border-radius: 10px;
}

:deep(.slick-arrow.slick-prev) {
  width: 48px;
  height: 48px;
  background: white;
  box-shadow: 0 0.5rem 1rem rgba(102, 101, 101, 0.5) !important;
  background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iZGFya3JlZCIgY2xhc3M9ImJpIGJpLWNoZXZyb24tbGVmdCIgdmlld0JveD0iMCAwIDE2IDE2Ij4KICA8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMS4zNTQgMS42NDZhLjUuNSAwIDAgMSAwIC43MDhMNS43MDcgOGw1LjY0NyA1LjY0NmEuNS41IDAgMCAxLS43MDguNzA4bC02LTZhLjUuNSAwIDAgMSAwLS43MDhsNi02YS41LjUgMCAwIDEgLjcwOCAweiIvPgo8L3N2Zz4=") !important;
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
  background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iZGFya3JlZCIgY2xhc3M9ImJpIGJpLWNoZXZyb24tcmlnaHQiIHZpZXdCb3g9IjAgMCAxNiAxNiI+CiAgPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNNC42NDYgMS42NDZhLjUuNSAwIDAgMSAuNzA4IDBsNiA2YS41LjUgMCAwIDEgMCAuNzA4bC02IDZhLjUuNSAwIDAgMS0uNzA4LS43MDhMMTAuMjkzIDggNC42NDYgMi4zNTRhLjUuNSAwIDAgMSAwLS43MDh6Ii8+Cjwvc3ZnPg==") !important;
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
