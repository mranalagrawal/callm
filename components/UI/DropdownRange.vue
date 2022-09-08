<template>
  <div class="w-100 d-block">
    <button class="btn px-0" @click="visible = !visible">
      <i
        class="fal fa-chevron-down text-light-red mr-3"
        :class="visible ? 'fa-rotate-180' : ''"
      ></i>
      <span class="small text-dark-red text-uppercase">{{ label }}</span>
    </button>
    <div v-if="visible" class="content mb-5">
      <div class="mt-5 px-2">
        <div class="d-flex justify-content-between">
          <span>{{ choosenMin }}</span>
          <span>{{ choosenMax }}</span>
        </div>
        <div class="py-4">
          <div class="sliders_control my-4">
            <input
              id="start"
              type="range"
              :min="min"
              :max="max"
              v-model="choosenMin"
            />
            <input
              id="end"
              type="range"
              :min="min"
              :max="max"
              v-model="choosenMax"
            />
            <div
              class="middle"
              :style="{ marginLeft: marginLeft, width: width }"
            ></div>
            <div class="track"></div>
          </div>
        </div>
      </div>
      <button class="btn" @click="goto">Vai</button>
    </div>
  </div>
</template>

<script>
export default {
  props: ["label", "min", "max"],
  data() {
    return {
      visible: true,
      choosenMin: +this.min,
      choosenMax: +this.max,
    };
  },
  computed: {
    marginLeft() {
      let value = (100 * this.choosenMin) / (this.max - this.min);
      return value + "%";
    },
    width() {
      let value =
        (100 * (this.choosenMax - this.choosenMin)) / (this.max - this.min);
      return value + "%";
    },
    actualMin() {
      return this.choosenMin;
    },
  },
  watch: {
    choosenMin() {
      if (this.choosenMin > this.choosenMax) {
        [this.choosenMin, this.choosenMax] = [this.choosenMax, this.choosenMin];
      }
    },
    choosenMax() {
      if (this.choosenMax < this.choosenMin) {
        [this.choosenMin, this.choosenMax] = [this.choosenMax, this.choosenMin];
      }
    },
  },
  methods: {
    goto() {
      console.log(this.choosenMin);
      console.log(this.choosenMax);

      const query = Object.assign({}, this.$route.query);

      /* query[this.keyword] = id; */

      query["price_from"] = this.choosenMin;
      query["price_to"] = this.choosenMax;

      /* if (id !== this.active) query["page"] = 1; */

      this.$router.push({
        path: "search",
        query: query,
      });
    },
  },
  components: {},
};
</script>

<style scoped>
.track {
  position: relative;
  top: -2px;
  z-index: 0;
  width: 100%;
  height: 2px;
  background: #ddd;
}
.middle {
  height: 2px;
  width: 200px;
  background: red;
  position: relative;
  z-index: 1;
}

.sliders_control {
  position: relative;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  pointer-events: all;
  width: 24px;
  height: 24px;
  background-color: #fff;
  border-radius: 50%;
  box-shadow: 0 0 0 1px #c6c6c6;
  cursor: pointer;
  position: relative;
  z-index: 2;
}

input[type="range"]::-moz-range-thumb {
  -webkit-appearance: none;
  pointer-events: all;
  width: 24px;
  height: 24px;
  background-color: #fff;
  border-radius: 50%;
  box-shadow: 0 0 0 1px #c6c6c6;
  cursor: pointer;
  position: relative;
  z-index: 2;
}

input[type="range"]::-webkit-slider-thumb:hover {
  background: #f7f7f7;
}

input[type="range"]::-webkit-slider-thumb:active {
  box-shadow: inset 0 0 3px #387bbe, 0 0 9px #387bbe;
  -webkit-box-shadow: inset 0 0 3px #387bbe, 0 0 9px #387bbe;
}

input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  height: 2px;
  width: 100%;
  position: absolute;
  background-color: #c6c6c6;
  pointer-events: none;
}

#start,
#end {
  height: 0;
  z-index: 5;
}
</style>
