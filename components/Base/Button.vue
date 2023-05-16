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
      type: [String, Object],
      default: '',
    },
    size: {
      validator: prop => ['xs', 'sm', 'md'].includes(prop) || !Number.isNaN(prop),
      default: 'sm',
    },
    variant: {
      validator: prop => ['default', 'default-inverse', 'ghost', 'text'].includes(prop),
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

    getSpacing() {
      return ({
        'default': 'cmw-btn-base-spacing',
        'default-inverse': 'cmw-btn-base-spacing',
        'ghost': 'cmw-btn-base-spacing',
        'text': 'cmw-px-1 cmw-py-2 md:(cmw-py-[0.8rem])',
      })[this.$props.variant]
    },

    getVariant() {
      return ({
        'default': 'cmw-btn-default disabled:(cmw-bg-gray-light)',
        'default-inverse': 'cmw-font-secondary cmw-font-bold cmw-border-transparent cmw-bg-white cmw-text-primary-400 cmw-uppercase hover:(cmw-text-primary cmw-no-underline)',
        'ghost': 'cmw-border-primary-400 cmw-text-primary-400 cmw-font-bold cmw-uppercase hover:(cmw-bg-primary-50 cmw-text-primary-400 cmw-no-underline)',
        'text': 'cmw-btn-text',
      })[this.$props.variant]
    },
  },
}
</script>

<template>
  <component
    :is="$props.to ? 'NuxtLink' : 'button'"
    :type="$attrs.type || !$props.to ? 'button' : ''"
    :to="$props.to"
    v-bind="$attrs"
    class="cmw-btn-base disabled:(cmw-text-gray cmw-cursor-not-allowed)"
    :class="[getVariant(), getSize(), getSpacing()]"
  >
    <slot>{{ $props.label }}</slot>
  </component>
</template>
