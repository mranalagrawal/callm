<template>
  <b-dropdown variant="white" no-caret no-flip>
    <template #button-content>
      <span class="small text-dark-red text-uppercase">{{ label }}</span>
      <i class="fal fa-chevron-down ml-3 text-light-red"></i>
    </template>

    <div class="mt-5 px-2">
      <div class="d-flex justify-content-center align-items-center mb-4">
        <div class="px-3 px-2 border border-dark rounded">
          {{ oBarMinValue }} <span class="text-dark-red">€</span>
        </div>
        <div class="divider mx-2"></div>
        <div class="px-3 px-2 border border-dark rounded">
          {{ oBarMaxValue }} <span class="text-dark-red">€</span>
        </div>
      </div>
      <MultiRangeSlider
        baseClassName="multi-range-slider-bar-only"
        :minValue="oBarMinValue"
        :maxValue="oBarMaxValue"
        :max="+max"
        :min="+min"
        @input="update_oBarValues"
      />
      <div class="d-flex justify-content-between px-2 text-light-red">
        <span class="small">{{ min }} €</span>
        <span class="small">{{ max }} €</span>
      </div>

      <div class="mt-5 text-center">
        <a href="" class="btn btn-sm btn-outline-light-red px-4">Applica</a>
      </div>
    </div>
  </b-dropdown>
</template>

<script>
import MultiRangeSlider from "multi-range-slider-vue";
/* import "../../node_modules/multi-range-slider-vue/MultiRangeSliderBlack.css"; */
import "../../node_modules/multi-range-slider-vue/MultiRangeSliderBarOnly.css";

export default {
  props: ["label", "min", "max"],
  data() {
    return {
      oBarMinValue: +this.min,
      oBarMaxValue: +this.max,
    };
  },
  methods: {
    update_oBarValues(e) {
      this.oBarMinValue = e.minValue;
      this.oBarMaxValue = e.maxValue;
    },
  },
  components: {
    MultiRangeSlider,
  },
};
</script>

<style>
.multi-range-slider-bar-only .bar-inner {
  background-color: var(--dark-red);
  border: 1px solid darkred;
}
.multi-range-slider-bar-only .bar-left,
.multi-range-slider-bar-only .bar-right {
  width: 25%;
  background-color: var(--light-red);
  opacity: 0.4;
  border-radius: 10px 0px 0px 10px;
  box-shadow: none;
  padding: 1px 0px;
}
.multi-range-slider-bar-only .thumb::before {
  content: "";
  background-color: var(--dark-red);
  position: absolute;
  width: 14px;
  height: 14px;
  border: solid 1px white;
  box-shadow: none;
  border-radius: 50%;
  z-index: 1;
  margin: -6px;
  cursor: pointer;
}
.divider {
  height: 1px;
  width: 24px;
  background: #ddd;
}
.caption {
  display: none !important;
}
</style>
