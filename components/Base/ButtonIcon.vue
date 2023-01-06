<template>
  <button
    class="cmw-flex cmw-bg-primary-400 cmw- cmw-rounded-sm cmw-p-1">
    <VueSvgIcon class="cmw-m-auto" :data="icon" color="white" :width="getSize()" :height="getSize()"/>
  </button>
</template>

<script>

export default {
  name: "ButtonIcon",
  props: {
    icon: {
      type: [Object],
      require: true
    },
    label: {
      type: String,
    },
    size: {
      type: String,
      validator: (prop) => ['sm', 'md'].includes(prop),
      default: 'md'
    },
  },
  methods: {
    getSize() {
      return ({
        sm: 22,
        md: 32,
      })[this.$props.size]
    }
  }
}
</script>

