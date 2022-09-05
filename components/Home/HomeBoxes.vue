<template>
  <div class="container-fluid px-md-5 mt-5">
    <div class="row" v-if="data">
      <div
        v-for="(box, ind) in data.data.box"
        :key="ind"
        class="col-12 col-md-4"
      >
        <img
          :src="box.image.url"
          class="d-block mx-auto rounded-circle"
          alt=""
          style="position: relative; bottom: -24px; z-index: 1"
          width="48px"
          height="48px"
        />
        <div class="card">
          <div class="card-body text-center">
            <h5 class="card-title mt-4">{{ box.text }}</h5>

            <p class="card-text">
              {{ box.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  watch: {
    "$i18n.locale": "$fetch",
  },
  data() {
    return {
      data: null,
      slide: 0,
      sliding: null,
    };
  },
  async fetch() {
    let lang = "";
    if (this.$i18n.locale == "en") {
      lang = "en-gb";
    } else {
      lang = "it-it";
    }

    this.data = await this.$prismic.api.getSingle("home-boxes", { lang: lang });
    console.log(this.data);
    /* this.contents = (
      await this.$prismic.api.query(
        this.$prismic.predicates.at("document.type", "box")
      )
    ).results; */
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
  background-image: url("../../assets/images/chevron-left.svg") !important;
}

.home-carousel :deep(.carousel-control-next-icon) {
  background-image: url("../../assets/images/chevron-right.svg") !important;
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
</style>
