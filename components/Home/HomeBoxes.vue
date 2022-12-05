<template>
  <div class="container-fluid px-md-5 mt-5">
    <div class="row pt-md-5 d-none d-md-flex" v-if="data">
      <div
        v-for="(box, ind) in data.data.box"
        :key="ind"
        class="col-12 col-md-4 mb-5"
      >
        <div class="box-card p-2 h-100">
          <img
            v-if="box.image.url"
            :src="box.image.url"
            class="d-block mx-auto rounded-circle icon-img"
            alt=""
            width="80px"
            height="80px"
          />
          <div class="card-body text-center">
            <h5
              class="card-title text-dark-primary mb-0"
              style="font-size: 16px; font-weight: 600"
              :class="$config.store !== 'WILDVIGNERON' ? 'mt-4' : ''"
            >
              {{ box.title }}
            </h5>

            <p class="card-text" style="font-size: 16px">
              {{ box.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="pt-md-5 d-md-none" v-if="data">
      <VueSlickCarousel v-bind="settings">
        <div v-for="(box, ind) in data.data.box" :key="ind" class="mb-5">
          <div class="box-card p-2 h-100">
            <img
              :src="box.image.url"
              class="d-block mx-auto rounded-circle icon-img"
              alt=""
              width="80px"
              height="80px"
            />
            <div class="card-body text-center">
              <h5
                class="card-title mt-4 text-dark-primary mb-0"
                style="font-size: 16px; font-weight: 600"
              >
                {{ box.title }}
              </h5>

              <p class="card-text" style="font-size: 16px">
                {{ box.description }}
              </p>
            </div>
          </div>
        </div>
      </VueSlickCarousel>
    </div>
  </div>
</template>

<script>
import VueSlickCarousel from "vue-slick-carousel";
import "vue-slick-carousel/dist/vue-slick-carousel-theme.css";

import documents from "../../prismic-mapper";
import locales from "../../locales-mapper";

export default {
  watch: {
    "$i18n.locale": "$fetch",
  },
  components: { VueSlickCarousel },
  data() {
    return {
      data: null,
      slide: 0,
      sliding: null,
      settings: {
        dots: true,
        focusOnSelect: true,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 4,
        touchThreshold: 5,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 3,
            },
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              dots: true,
              arrows: false,
            },
          },
        ],
      },
    };
  },
  async fetch() {
    let lang = locales[this.$i18n.locale];

    if (lang == "en-gb" && this.$config.STORE == "CMW") {
      lang = "en-eu";
    }

    this.data = await this.$prismic.api.getSingle(
      documents[this.$config.STORE].homeBoxes,
      { lang: lang }
    );
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
.box-card {
  border-radius: 8px;
  padding: 43px 55px 23px;
  border: 1px solid #e1e2e3;
  position: relative;
}
.icon-img {
  position: absolute;
  top: -40px;
  z-index: 1;
  left: calc(50% - 40px);
}
.home-carousel :deep(.carousel-indicators) {
  display: flex;
  justify-content: end;
}

.home-carousel :deep(.carousel-indicators li) {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid gray;
  background-color: #8b0000;
}

.home-carousel :deep(.carousel-control-prev),
.home-carousel :deep(.carousel-control-next) {
  opacity: 1 !important;
}

.home-carousel :deep(.carousel-control-prev-icon),
.home-carousel :deep(.carousel-control-next-icon) {
  background-color: white;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  opacity: 1;
}

.home-carousel :deep(.carousel-control-prev-icon) {
  background-image: url("assets/svg/chevron-left.svg") !important;
}

.home-carousel :deep(.carousel-control-next-icon) {
  background-image: url("assets/svg/chevron-right.svg") !important;
}

.home-carousel :deep(.carousel-item img) {
  height: 400px;
  object-fit: cover;
}

@media screen and (max-width: 760px) {
  .home-carousel :deep(.carousel-item img) {
    height: 90vh;
    object-fit: cover;
  }
}

:deep(.carousel-caption) {
  text-align: left;
  bottom: 40px;
}

:deep(.slick-dots li button:before) {
  font-size: 10px;
  opacity: 0.6;
  color: var(--light-secondary);
}

:deep(.slick-dots li.slick-active button:before) {
  opacity: 1;
  font-size: 16px;
  color: var(--dark-secondary);
}
:deep(.slick-dots) {
  bottom: 8px;
}

@media screen and (max-width: 760px) {
  :deep(.slick-list) {
    padding-top: 32px;
  }
}
</style>
