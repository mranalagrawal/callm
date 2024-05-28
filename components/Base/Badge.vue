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
      return this.$props.bgColor === 'white' ? 'text-primary' : 'text-white'
    },
  },
  methods: {
    getBgColor() {
      return ({
        'primary': 'bg-primary-400',
        'primary-400': 'bg-primary',
        'white': 'bg-white',
      })[this.$props.bgColor]
    },
  },
}

</script>

<template>
  <span
    class="flex w-22px h-22px text-xxs border-2 border-white rounded-full transition-colors"
    :class="[getBgColor(), getNumberColor]"
  >
    <span class="m-auto">{{ $props.qty }}</span>
  </span>
</template>
