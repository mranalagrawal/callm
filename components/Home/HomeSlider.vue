<template>
  <div class="my-5">
    <h2 class="text-center font-weight-bold text-dark-green">In evidenza</h2>

    <client-only placeholder="Loading..." v-if="data">
      <carousel-3d
        :width="1100"
        :height="450"
        :autoplay="true"
        :autoplayTimeout="3000"
        :clickable="true"
        class="position-relative"
      >
        <slide
          v-for="(content, i) in data"
          :index="i"
          :key="i"
          style="border-radius: 10px; border: none"
        >
          <div
            class="h-100 w-100 p-4 position-relative text-white slide-content"
            :style="{
              background: `url(${mask}),url('${content.image.url}')`,
            }"
          >
            <p class="h3 font-weight-bold mt-4">
              {{ content.title }}
            </p>

            <nuxt-link :to="content.link" class="btn btn-cta mb-3 px-5 py-2">
              Scopri di più
            </nuxt-link>
          </div>
          <div class="w-100 loader"></div>
        </slide>
      </carousel-3d>
    </client-only>
  </div>
</template>

<script>
import mask from "assets/images/mask_left.svg";
export default {
  data() {
    return {
      data: null,
      mask: mask,
    };
  },
  async fetch() {
    let lang = "";
    if (this.$i18n.locale == "en") {
      lang = "en-gb";
    } else {
      lang = "it-it";
    }

    const data = await this.$prismic.api.getSingle("home-featured", {
      lang: lang,
    });
    console.log(data.data.featured, "data");
    this.data = data.data.featured;
  },
};
</script>

<style scoped>
.btn-cta {
  position: absolute;
  text-transform: uppercase;
  bottom: 20px;
  border-radius: 10px;
  font-weight: 600;
  border: 2px solid white;
  color: white;
}
.btn-cta:hover {
  background: #da4865;
}
.loader {
  position: absolute;
  background: #ddd;
  height: 8px;
  bottom: -2px;
  z-index: 1000;
}

.loader::after {
  position: absolute;
  content: "";
  height: 8px;
  top: 0px;
  left: 0px;
}

@keyframes fill {
  from {
    width: 0%;
  }
  to {
    width: 100%;
  }
}

:deep(.carousel-3d-slide.current .loader::after) {
  background: #da4865;
  animation-name: fill;
  animation-duration: 3000ms;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
}

:deep(.carousel-3d-slide.left-1) {
  transform: translateX(200px) translateZ(-400px) rotateY(-35deg) !important;
}
:deep(.carousel-3d-slide.left-2) {
  transform: translateX(250px) translateZ(-400px) rotateY(-35deg) !important;
}

:deep(.carousel-3d-slide.right-1) {
  transform: translateX(250px) translateZ(-400px) rotateY(-35deg) !important;
}
:deep(.carousel-3d-slide.right-2) {
  transform: translateX(250px) translateZ(-400px) rotateY(-35deg) !important;
}

/* :deep([class^="carousel-3d-slide left-"]) {
  transform: unset !important;
}

:deep(.carousel-3d-slide.right-1) {
  transform: translateX(333px) translateZ(-400px) rotateY(-35deg) !important;
} */
/* 
:deep(.carousel-3d-slide.right-2) {
  transform: translateX(400px) translateZ(-400px) rotateY(-35deg) !important;
} */

.slide-content {
  background-position: left, center !important;
  background-size: contain, cover !important;
  background-repeat: no-repeat, no-repeat !important;
  border-radius: 10px;
}
/* :deep(.carousel-3d-slider) {
  width: 900 !important;
  height: 400px !important;
} */
</style>
