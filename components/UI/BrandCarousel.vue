<template>
  <div>
    <VueSlickCarousel
      ref="slider-big"
      :focusOnSelect="true"
      v-bind="settingsMain"
      @beforeChange="syncSliders"
    >
      <div v-for="(image, i) in images" :key="i">
        <img
          :src="image"
          alt=""
          class="mx-auto d-block img-fluid w-100"
          height="500"
        />
      </div>
    </VueSlickCarousel>

    <div class="mt-3 mt-2 d-none d-md-block">
      <VueSlickCarousel
        v-bind="settingsNav"
        :class="'slider-thumb'"
        ref="slider-thumb"
        :focusOnSelect="true"
        @beforeChange="syncSliders"
      >
        <div v-for="(image, j) in images" :key="j">
          <img :src="image" alt="" class="rounded-sm" width="120" />
        </div>
      </VueSlickCarousel>
    </div>
  </div>
</template>

<script>
import VueSlickCarousel from "vue-slick-carousel";
export default {
  components: { VueSlickCarousel },
  props: ["images"],
  data() {
    return {
      data: null,
      metafields: null,
      settingsNav: {
        infinite: false,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        touchThreshold: 5,
        arrows: true,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 1,
            },
          },
        ],
      },
      settingsMain: {
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        touchThreshold: 5,
        arrows: false,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              dots: true,
            },
          },
        ],
      },
    };
  },
  methods: {
    syncSliders(currentPosition, nextPosition) {
      this.$refs["slider-big"].goTo(nextPosition);
      this.$refs["slider-thumb"].goTo(nextPosition);
    },
  },
};
</script>

<style scoped>
:deep(.slick-arrow.slick-prev) {
  width: 48px;
  height: 48px;
  background: white;
  box-shadow: 0 0.5rem 1rem rgba(102, 101, 101, 0.5) !important;
  background-image: url("../../assets/images/chevron-left.svg") !important;
  background-size: 24px;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99;
  left: -14px;
}
:deep(.slick-arrow.slick-next) {
  width: 48px;
  height: 48px;
  background: white;
  box-shadow: 0 0.5rem 1rem rgba(102, 101, 101, 0.5) !important;
  background-image: url("../../assets/images/chevron-right.svg") !important;
  background-size: 24px;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  right: -14px;
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
  font-size: 10px;
  opacity: 0.6;
  color: var(--light-red);
}

:deep(.slick-dots li.slick-active button:before) {
  opacity: 1;
  font-size: 16px;
  color: var(--dark-red);
}
:deep(.slick-dots) {
  bottom: -48px;
}
</style>
