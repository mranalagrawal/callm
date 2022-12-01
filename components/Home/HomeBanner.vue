<template>
  <div class="position-relative" style="overflow: hidden">
    <b-carousel
      id="carousel-1"
      v-model="slide"
      :interval="4000"
      :controls="data.length > 1"
      :indicators="data.length > 1"
      background="#ababab"
      style="text-shadow: 1px 1px 2px #333"
      @sliding-start="onSlideStart"
      @sliding-end="onSlideEnd"
      class="home-carousel d-none d-md-block"
      v-if="data"
    >
      <b-carousel-slide
        v-for="(slide, i) in data"
        :key="i"
        :img-src="slide.image.url"
      >
        <h1 class="mb-5">{{ slide.text }}</h1>
        <div>
          <nuxt-link
            :to="slide.link"
            class="btn btn-more px-3 py-2"
            style="text-shadow: none; border-radius: 10px"
          >
            {{ slide.cta }}
          </nuxt-link>
        </div>
      </b-carousel-slide>
    </b-carousel>
    <b-carousel
      id="carousel-2"
      v-model="slide"
      :interval="4000"
      :controls="data.length > 1"
      :indicators="data.length > 1"
      fade
      background="#ababab"
      style="text-shadow: 1px 1px 2px #333"
      @sliding-start="onSlideStart"
      @sliding-end="onSlideEnd"
      class="home-carousel d-md-none"
      v-if="data"
    >
      <b-carousel-slide
        v-for="(slide, i) in data"
        :key="i"
        :img-src="slide.image.mobile.url"
      >
        <h1 class="mb-md-5">{{ slide.text }}</h1>
        <div>
          <nuxt-link
            :to="slide.link"
            class="btn text-uppercase bg-white text-light-secondary mb-5"
            style="text-shadow: none"
          >
            {{ slide.cta }}
          </nuxt-link>
        </div>
      </b-carousel-slide>
    </b-carousel>
    <div class="onda">
      <svg
        width="3840px"
        height="148px"
        viewBox="0 0 3840 148"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
      >
        <title>Onda_3840@1</title>
        <g
          id="Onda_3840"
          stroke="none"
          stroke-width="1"
          fill="none"
          fill-rule="evenodd"
        >
          <path
            d="M-569,148 L-569,20.3662102 C-405.287174,40.8088863 -322.507397,51.1344162 -320.660668,51.3427998 C-138.928633,71.8493163 1.12492311,78.6312979 99.5,71.6887445 C280.371464,58.9242331 494.524628,0 646.701493,0 C762.943373,0 878.040299,7.21186649 989.039971,23.9905006 C1133.50589,42.0303423 1206.6052,51.147121 1208.33933,51.3427998 C1390.07137,71.8493163 1530.12492,78.6312979 1628.5,71.6887445 C1809.37146,58.9242331 2023.52463,0 2175.70149,0 C2294.98992,0 2413.07259,7.59484721 2526.75894,25.3294944 C2664.12368,42.4815314 2733.64864,51.1520231 2735.33933,51.3427998 C2917.07137,71.8493163 3057.12492,78.6312979 3155.5,71.6887445 C3336.37146,58.9242331 3550.52463,0 3702.70149,0 C3861.0824,0 4017.33777,13.3883812 4164,46.1216729 C4165.02494,46.3504264 4246.02494,62.8585339 4407,95.6459954 L4407,95.6459954 L4407,148 L-569,148 Z"
            id="Combined-Shape"
            fill="#fff"
          ></path>
        </g>
      </svg>
    </div>
  </div>
</template>

<script>
import locales from "../../locales-mapper";

export default {
  data() {
    return {
      data: null,
      slide: 0,
      sliding: null,
    };
  },
  async fetch() {
    let lang = locales[this.$i18n.locale];

    if (lang == "en-gb" && this.$config.STORE == "CMW") {
      lang = "en-eu";
    }

    const response = await this.$prismic.api.getSingle("home-carousel", {
      lang: lang,
    });
    const data = response.data.body[0].items;
    this.data = data;
  },
  methods: {
    onSlideStart(slide) {
      this.sliding = true;
    },
    onSlideEnd(slide) {
      this.sliding = false;
    },
  },
};
</script>

<style lang="css" scoped>
.home-carousel :deep(.carousel-indicators) {
  display: flex;
  justify-content: end;
  align-items: center;
  margin-right: 5%;
  bottom: 90px;
}

.home-carousel :deep(.carousel-indicators li) {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  opacity: 1;
  border: 1px solid #ddd;
  background-color: white;
  margin: 0px 6px;
}
.home-carousel :deep(.carousel-indicators li.active) {
  background-color: var(--dark-secondary);
  width: 16px;
  height: 16px;
}

.home-carousel :deep(.carousel-control-prev),
.home-carousel :deep(.carousel-control-next) {
  opacity: 1 !important;
}

.home-carousel :deep(.carousel-control-prev) {
  left: -48px;
}
.home-carousel :deep(.carousel-control-next) {
  right: -48px;
}

.home-carousel :deep(.carousel-control-prev-icon),
.home-carousel :deep(.carousel-control-next-icon) {
  background-color: white;
  width: 48px;
  height: 48px;
  border-radius: 10px;
  opacity: 1;
}

.home-carousel :deep(.carousel-control-prev-icon) {
  background-image: url("../../assets/images/chevron-left.svg") !important;
  background-position: center;
  background-size: 20px;
}

.home-carousel :deep(.carousel-control-next-icon) {
  background-image: url("../../assets/images/chevron-right.svg") !important;
  background-position: center;
  background-size: 20px;
}

.home-carousel :deep(.carousel-item img) {
  height: 505px;
  object-fit: cover;
}

@media screen and (max-width: 760px) {
  .home-carousel :deep(.carousel-item img) {
    height: 450px;
    object-fit: cover;
  }
}

:deep(.carousel-caption) {
  text-align: left;
  top: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  left: 10%;
  right: 10%;
}

@media screen and (max-width: 760px) {
  .home-carousel :deep(.carousel-control-prev),
  .home-carousel :deep(.carousel-control-next) {
    display: none !important;
  }

  .home-carousel :deep(.carousel-indicators) {
    display: flex;
    justify-content: center;
    margin: 0 !important;
    bottom: 30px;
  }

  :deep(.carousel-caption) {
    text-align: left;
    top: 0px;
    justify-content: space-between;
  }
}

.onda {
  position: absolute;
  z-index: 1;
  margin: -102px auto 0;
  left: 50%;
  transform: translate(-50%);
}

.btn-more {
  text-transform: uppercase;
  background-color: white;
  color: var(--light-secondary);
  font-weight: 700;
}
.btn-more:hover {
  background-color: var(--dark-secondary);
  color: white;
}
</style>
