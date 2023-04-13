<script>
// noinspection JSUnusedGlobalSymbols
export default {
  // Note: temp ignore till migrate to Nuxt 3, then we will name this BaseButton
  // eslint-disable-next-line vue/multi-word-component-names,vue/no-reserved-component-names
  name: 'Button',
  props: {
    to: {
      type: [String],
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    size: {
      validator: prop => ['xs', 'sm', 'md'].includes(prop) || !Number.isNaN(prop),
      default: 'sm',
    },
    variant: {
      validator: prop => ['default', 'ghost', 'text'].includes(prop),
      default: 'default',
    },
  },
  methods: {
    getSize() {
      return ({
        xs: 'cmw-text-xs',
        sm: 'cmw-text-sm',
        md: 'cmw-text-base',
      })[this.size] || this.size
    },

    getVariant() {
      return ({
        default: 'cmw-btn-default disabled:(cmw-bg-gray-light)',
        ghost: 'cmw-border-primary-400 cmw-text-primary-400 cmw-font-bold cmw-uppercase hover:(cmw-bg-primary-50 cmw-text-primary-400 cmw-no-underline)',
        text: 'cmw-btn-text',
      })[this.$props.variant]
    },
  },
}
</script>

<template>
  <component
    :is="$props.to ? 'NuxtLink' : 'button'"
    :to="$props.to"
    v-bind="$attrs"
    class="cmw-btn-base disabled:(cmw-text-gray cmw-cursor-not-allowed)"
    :class="[getVariant(), getSize()]"
  >
    <slot>{{ $props.label }}</slot>
  </component>
</template>
