<template>
  <component
    :is="$props.to ? 'NuxtLink' : 'button'"
    :to="$props.to"
    v-bind="$attrs"
    class="cmw-font-secondary cmw-flex cmw-items-center cmw-justify-center cmw-font-bold
     cmw-transition-colors cmw-rounded cmw-px-8 cmw-py-[0.8rem] cmw-border-2 cmw-w-full text-uppercase"
    :class="getVariant()"
  >
    <slot>{{ $props.label }}</slot>
  </component>
</template>

<script>

export default {
  name: "Button",
  props: {
    to: {
      type: [String],
    },
    label: {
      type: String,
    },
    variant: {
      type: String,
      validator: (prop) => ['default', 'ghost'].includes(prop),
      default: 'default'
    },
  },
  methods: {
    getVariant() {
      return ({
        default: 'cmw-border-transparent cmw-bg-primary-400 cmw-text-white hover:(cmw-text-white cmw-no-underline)',
        ghost: 'cmw-border-primary-400 cmw-text-primary-400 hover:(cmw-bg-primary-50 cmw-text-primary-400 cmw-no-underline)',
      })[this.$props.variant]
    }
  }
}
</script>

