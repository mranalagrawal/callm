<template>
  <div class="container-fluid my-5 bg-light py-5">
    <!-- <div v-for="product in products" :key="product.id">{{ product.title }}</div> -->
    <div class="row py-5 px-0">
      <div class="col-12 text-center">
        <h2 class="font-weight-bold text-dark-green">Le nostre selezioni</h2>
      </div>
      <div class="col-12 px-0 py-4">
        <VueSlickCarousel v-bind="settings" ref="carousel" v-if="data">
          <div v-for="(item, i) in data" :key="i" class="px-2">
            <nuxt-link
              :to="item.link"
              class="selection-card px-3 text-decoration-none"
            >
              <img
                :src="item.icon.url"
                width="24px"
                height="24px"
                class="mr-2"
                style="user-select: none"
                :style="{ filter: 'contrast(0) brightness(5) !important' }"
              />
              {{ item.label }}
              <!-- <img :src="item." alt=""> {{ item.label }} -->
            </nuxt-link>
          </div>
        </VueSlickCarousel>
      </div>
    </div>
  </div>
</template>

<script>
import VueSlickCarousel from "vue-slick-carousel";
// optional style for arrows & dots
import "vue-slick-carousel/dist/vue-slick-carousel-theme.css";

export default {
  components: { VueSlickCarousel },
  data: () => ({
    data: null,
    settings: {
      arrows: false,
      dots: true,
      infinite: true,
      slidesToShow: 6,
      slidesToScroll: 1,
      autoplay: true,
      speed: 20000,
      autoplaySpeed: 20000,
      cssEase: "linear",
      /* arrows: false,
      dots: true,
      infinite: true,
      slidesToShow: 5.5,
      slidesToScroll: 4,
      autoplay: true,
      speed: 20000,
      autoplaySpeed: 0,
      cssEase: "linear",
      pauseOnFocus: true,
      pauseOnHover: true, */
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
    const response = await this.$prismic.api.getSingle("selections");
    const items = response.data.body[0].items;
    this.data = items.concat(items).concat(items);
  },
};
</script>

<style scoped>
.selection-card {
  background: linear-gradient(76deg, #751f3d 1%, #ad2b48 95%);
  border-radius: 12px;
  height: 88px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
}

:deep(.slick-arrow.slick-prev) {
  width: 48px;
  height: 48px;
  background: white;
  box-shadow: 0 0.5rem 1rem rgba(102, 101, 101, 0.5) !important;
  background-image: url("../../assets/images/chevron-left.svg") !important;
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
  background-image: url("../../assets/images/chevron-right.svg") !important;
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
  color: var(--dark-red);
}

:deep(.slick-dots li.slick-active button:before) {
  opacity: 1;
}
:deep(.slick-dots) {
  bottom: -48px;
}
</style>
