<script>
// noinspection JSUnusedGlobalSymbols
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Badge',
  props: {
    qty: {
      type: [String, Number],
    },
    bgColor: {
      type: String,
      validator: prop => ['primary', 'primary-400', 'white'].includes(prop),
      default: 'primary',
    },
  },
  computed: {
    getNumberColor() {
      return this.$props.bgColor === 'white' ? 'cmw-text-primary' : 'cmw-text-white'
    },
  },
  methods: {
    getBgColor() {
      return ({
        'primary': 'cmw-bg-primary-400',
        'primary-400': 'cmw-bg-primary',
        'white': 'cmw-bg-white',
      })[this.$props.bgColor]
    },
  },
}
</script>

<template>
  <span
    class="cmw-flex cmw-w-22px cmw-h-22px cmw-text-xxs cmw-border-2 cmw-border-white cmw-rounded-full cmw-transition-colors"
    :class="[getBgColor(), getNumberColor]"
  >
    <span class="cmw-m-auto">{{ $props.qty }}</span>
  </span>
</template>
