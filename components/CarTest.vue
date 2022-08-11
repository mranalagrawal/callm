<!-- Please remove this file from your project -->
<template>
  <div
    class="relative flex items-top justify-center min-h-screen bg-gray-100 sm:items-center sm:pt-0"
  >
    <div class="container">
      <VueSlickCarousel v-bind="carouselSettings_auto" ref="carousel">
        <div>
          <div class="info_card">
            <h3>Title</h3>
            <div class="mt-3">
              <p class="msmall line-height-medium">text</p>
              <p class="msmall line-height-medium">text</p>
              <p class="msmall line-height-medium">text</p>
            </div>
          </div>
        </div>
        <div>
          <div class="info_card">
            <h3>Title</h3>
            <div class="mt-3">
              <p class="msmall line-height-medium">text</p>
              <p class="msmall line-height-medium">text</p>
              <p class="msmall line-height-medium">text</p>
            </div>
          </div>
        </div>
        <div>
          <div class="info_card">
            <h3>Title</h3>
            <div class="mt-3">
              <p class="msmall line-height-medium">text</p>
              <p class="msmall line-height-medium">text</p>
              <p class="msmall line-height-medium">text</p>
            </div>
          </div>
        </div>
        <div>
          <div class="info_card">
            <h3>Title</h3>
            <div class="mt-3">
              <p class="msmall line-height-medium">text</p>
              <p class="msmall line-height-medium">text</p>
              <p class="msmall line-height-medium">text</p>
            </div>
          </div>
        </div>
        <div>
          <div class="info_card">
            <h3>Title</h3>
            <div class="mt-3">
              <p class="msmall line-height-medium">text</p>
              <p class="msmall line-height-medium">text</p>
              <p class="msmall line-height-medium">text</p>
            </div>
          </div>
        </div>
      </VueSlickCarousel>
    </div>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  max-width: 900px;
}
.info_card {
  background: lightblue;
  padding: 1rem;
  margin-right: 1rem;
}
</style>

<script>
import VueSlickCarousel from "vue-slick-carousel";
import "vue-slick-carousel/dist/vue-slick-carousel.css";
export default {
  components: {
    VueSlickCarousel,
  },
  data() {
    return {
      carouselSettings_auto: {
        arrows: false,
        dots: false,
        infinite: true,
        slidesToShow: 2.5,
        slidesToScroll: 1,
        autoplay: false,
        speed: 6000,
        autoplaySpeed: 0,
        cssEase: "linear",
        pauseOnFocus: false,
        pauseOnHover: false,
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
    };
  },
};
</script>
