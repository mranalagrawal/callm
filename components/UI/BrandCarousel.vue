<template>
  <div>
    <VueSlickCarousel
      ref="slider-big"
      :focusOnSelect="true"
      v-bind="settingsMain"
      @beforeChange="syncSliders"
    >
      <div v-for="i in 10" :key="i">
        <img
          :src="`https://picsum.photos/id/${i}/1920/560`"
          alt=""
          class="mx-auto d-block img-fluid w-100"
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
        <div v-for="j in 10" :key="j">
          <img
            :src="`https://picsum.photos/id/${j}/160/120`"
            alt=""
            class="rounded-sm"
          />
        </div>
      </VueSlickCarousel>
    </div>
  </div>
</template>

<script>
import VueSlickCarousel from "vue-slick-carousel";
export default {
  components: { VueSlickCarousel },
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
