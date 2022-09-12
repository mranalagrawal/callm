<template>
  <div class="w-100 d-block">
    <button
      class="btn d-flex w-100 justify-content-between px-0"
      @click="visible = !visible"
    >
      <span class="small text-dark-red text-uppercase">{{ label }}</span>
      <i
        class="fal fa-chevron-down text-light-red mr-3"
        :class="visible ? 'fa-rotate-180' : ''"
      ></i>
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
              @change="checkIfSwap"
            />
            <input
              id="end"
              type="range"
              :min="min"
              :max="max"
              v-model="choosenMax"
              @change="checkIfSwap"
            />
            <div
              class="middle"
              :style="{ marginLeft: marginLeft, width: width }"
            ></div>
            <div class="track"></div>
          </div>
        </div>
      </div>
      <button class="btn btn-outline-light-red w-100" @click="goto">
        Applica
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: ["label"],
  data() {
    return {
      visible: true,
      min: 0,
      max: 2000,
      choosenMin: 0,
      choosenMax: 2000,
    };
  },
  watch: {
    "$route.query": function () {
      this.choosenMin = this.$route.query.price_from || this.min;
      this.choosenMax = this.$route.query.price_to || this.max;
    },
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
  },
  methods: {
    checkIfSwap() {
      if (+this.choosenMin > +this.choosenMax) {
        [this.choosenMin, this.choosenMax] = [this.choosenMax, this.choosenMin];
      }
    },

    goto() {
      const query = Object.assign({}, this.$route.query);

      /* query[this.keyword] = id; */

      query["price_from"] = this.choosenMin;
      query["price_to"] = this.choosenMax;
      query["page"] = 1;
      /* if (id !== this.active) query["page"] = 1; */

      this.$router.push({
        path: "search",
        query: query,
      });
    },
  },
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

#start {
  height: 0;
  z-index: 5;
}
#end {
  height: 0;
  z-index: 15;
}
</style>
