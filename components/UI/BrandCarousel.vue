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

    <div class="mt-3 mt-2">
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
        infinite: true,
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
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        touchThreshold: 5,
        arrows: false,
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
