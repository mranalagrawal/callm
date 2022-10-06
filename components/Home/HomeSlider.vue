<template>
  <div class="my-5">
    <h2 class="text-center font-weight-bold text-dark-green">In evidenza</h2>

    <client-only placeholder="Loading..." v-if="contents">
      <carousel-3d
        :width="1100"
        :height="500"
        :autoplay="true"
        :autoplayTimeout="3000"
        :clickable="true"
        class="position-relative"
      >
        <slide
          v-for="(content, i) in contents"
          :index="i"
          :key="i"
          style="border-radius: 10px; border: none"
        >
          <div
            class="h-100 w-100 p-4 position-relative text-white slide-content"
            :style="{
              background: `url(${mask}),url('${content.data.image.url}')`,
            }"
          >
            <p class="">{{ content.data.subtitle[0].text }}</p>
            <p class="h3">{{ content.data.title[0].text }}</p>
            <p class="">{{ content.data.description[0].text }}</p>
            <a
              :href="contents[0].data.link.url"
              class="btn btn-lg btn-outline-light position-absolute"
              style="bottom: 20px"
            >
              Scopri di più
            </a>
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
      contents: null,
      mask: mask,
    };
  },
  async fetch() {
    this.contents = (
      await this.$prismic.api.query(
        this.$prismic.predicates.at("document.type", "featured")
      )
    ).results;
  },
};
</script>

<style scoped>
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
  background: var(--dark-red);
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
