<script>
import { ref, useContext, watchEffect } from '@nuxtjs/composition-api'
import throttle from 'lodash.throttle'

import { getCurrencySymbol } from '~/utilities/currency'

export default {
  props: ['label', 'min', 'minValueTotal', 'max', 'maxValueTotal'],
  emits: ['update-values'],
  setup(props, { emit }) {
    const { $config } = useContext()
    const minWidth = ref(0)
    const maxWidth = ref(0)
    const minValue = ref(props.min)
    const maxValue = ref(props.max)
    const rangeGap = 10
    const currencySymbol = ref(getCurrencySymbol($config.STORE === 'CMW_UK' ? 'GBP' : 'EUR'))

    // const handleChange = checked => emit('change', attrs['true-value'] ? attrs[`${checked}-value`] : checked)
    const handleInput = throttle(({ target }) => {
      const { id, value } = target

      if (id === 'input-field-max') { maxValue.value = value > props.maxValueTotal ? props.maxValueTotal : value } else { minValue.value = value < props.minValueTotal ? props.minValueTotal : value }

      if ((maxValue.value - minValue.value) < rangeGap) {
        if (id === 'input-field-max') { maxValue.value = value > props.maxValueTotal ? props.maxValueTotal : +minValue.value + rangeGap } else { minValue.value = +maxValue.value - rangeGap }
      }

      emit('update-values', { minValue: minValue.value, maxValue: maxValue.value })
    }, 500)

    const handleInputRange = ({ target }) => {
      const { id } = target

      if ((maxValue.value - minValue.value) < rangeGap) {
        if (id === 'range-max') { maxValue.value = +minValue.value + rangeGap } else { minValue.value = +maxValue.value - rangeGap }
      }

      emit('update-values', { minValue: minValue.value, maxValue: maxValue.value })
    }

    watchEffect(() => {
      minWidth.value = (((minValue.value - props.minValueTotal) / (props.maxValueTotal - props.minValueTotal)) * 100)
      maxWidth.value = (((maxValue.value - props.minValueTotal) / (props.maxValueTotal - props.minValueTotal)) * 100)
    })

    return { currencySymbol, minWidth, minValue, maxWidth, maxValue, handleInput, handleInputRange }
  },
  /*
  methods: {

    goto() {
      const query = Object.assign({}, this.$route.query)

      query.price_from = this.choosenMin
      query.price_to = this.choosenMax
      query.page = 1

      this.$router.push({
        path: 'catalog',
        query,
      })
    },
  },  */
}
</script>

<template>
  <div>
    <div class="flex gap-4 pt-4">
      <div class="relative">
        <label class="sr-only" for="input-field-min">Minimum Value</label>
        <input
          id="input-field-min" v-model="minValue" type="text" name="min" placeholder="min value"
          class="px-4 text-gray-dark py-3 w-full bg-transparent border border-gray-light
              placeholder-transparent rounded"
          @input="handleInput"
        >
        <span class="transform absolute top-1/2 right-4 -translate-y-1/2 text-primary" v-text="currencySymbol" />
      </div>
      <div class="relative">
        <label class="sr-only" for="input-field-min">Maximum Value</label>
        <input
          id="input-field-max" v-model="maxValue" type="text" name="max" :max="maxValueTotal" placeholder="max value"
          class="px-4 text-gray-dark py-3 w-full bg-transparent border border-gray-light
              placeholder-transparent rounded"
          @input="handleInput"
        >
        <span class="transform absolute top-1/2 right-4 -translate-y-1/2 text-primary" v-text="currencySymbol" />
      </div>
    </div>
    <div class="wrap wrap--2x dots">
      <div class="absolute transform -translate-y-1/2 w-full top-1/2 flex justify-between items-center h-[5px]">
        <div class="bg-primary-100 h-px" :style="{ width: `${minWidth}%` }" />
        <div class="bg-primary h-full" :style="{ flex: 1 }" />
        <div class="bg-primary-100 h-px" :style="{ width: `calc(100% - ${maxWidth}%)` }" />
      </div>
      <label class="sr-only" for="range-min">minimum Value</label>
      <input id="range-min" v-model="minValue" type="range" :min="minValueTotal" :max="maxValueTotal" @input="handleInputRange">
      <label class="sr-only" for="range-max">maximum Value</label>
      <input id="range-max" v-model="maxValue" type="range" :min="minValueTotal" :max="maxValueTotal" @input="handleInputRange">
    </div>
    <div class="flex justify-between text-xs text-primary-100 mt-2">
      <span v-text="minValueTotal" />
      <span v-text="maxValueTotal" />
    </div>
  </div>
</template>

<style scoped>
.wrap {
  position: relative;
  display: grid;
  width: 100%;
  margin-top: 40px;
  border-radius: 0.5em;
  filter: saturate(1);
}

.wrap--2x input {
  pointer-events: none;
}

[type=range] {
  z-index: calc(1 + var(--sel, 1));
  grid-area: 1/1;
  height: 0.1em;
  background: transparent;
  cursor: pointer;
}
[type=range], [type=range]::-webkit-slider-runnable-track, [type=range]::-webkit-slider-thumb {
  -webkit-appearance: none;
}
[type=range]::-moz-range-track {
  background: transparent;
}
[type=range]::-webkit-slider-thumb {
  box-sizing: border-box;
  border: 1px solid white;
  width: 1.235em;
  height: 1.235em;
  border-radius: 50%;
  background: #992545;
  pointer-events: auto;
  cursor: ew-resize;
}
[type=range]::-moz-range-thumb {
  box-sizing: border-box;
  border: 1px solid white;
  width: 1.235em;
  height: 1.235em;
  padding: 9px 10px 11px;
  border-radius: 50%;
  background: #992545;
  pointer-events: auto;
  cursor: ew-resize;
}
[type=range]:focus {
  outline: none;
}
[type=range]:focus, [type=range]:hover {
  --sel: 1 ;
}

[type=number]::-webkit-inner-spin-button, [type=number]::-webkit-outer-spin-button {
  -webkit-appearance: none;
}
</style>
