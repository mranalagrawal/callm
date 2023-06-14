<script lang="ts">
import type { PropType } from '@nuxtjs/composition-api'
import { defineComponent } from '@nuxtjs/composition-api'
import type { TranslateResult } from 'vue-i18n'
import type { RawLocation } from 'vue-router'
import type { TButtonVariant, TSizes } from '~/types/types'

export default defineComponent({
  // Note: temp ignore till migrate to Nuxt 3, then we will name this BaseButton
  // eslint-disable-next-line vue/multi-word-component-names,vue/no-reserved-component-names
  name: 'Button',
  props: {
    to: {
      type: String as PropType<RawLocation>,
      default: '',
    },
    label: {
      type: String as PropType<TranslateResult>,
      default: '',
    },
    size: {
      type: String as PropType<TSizes>,
      default: 'sm',
    },
    variant: {
      type: String as PropType<TButtonVariant>,
      default: 'default',
    },
  },
  setup(props) {
    const getSize = () => ({
      xs: 'cmw-text-xs cmw-rounded-sm cmw-px-3 cmw-py-1 md:(cmw-px-4 cmw-py-[0.4rem])',
      sm: 'cmw-text-sm',
      md: 'cmw-text-base',
      lg: 'cmw-text-base',
    })[props.size] || props.size

    const getSpacing = () => ({
      'default': 'cmw-btn-base-spacing',
      'default-inverse': 'cmw-btn-base-spacing',
      'ghost': 'cmw-btn-base-spacing',
      'ghost-inverse': 'cmw-btn-base-spacing',
      'text': 'cmw-px-1 cmw-py-2 md:(cmw-py-[0.8rem])',
    })[props.variant]

    const getVariant = () => ({
      'default': 'cmw-btn-default disabled:(cmw-bg-gray-light)',
      'default-inverse': 'cmw-font-secondary cmw-font-bold cmw-border-transparent cmw-bg-white cmw-text-primary-400 cmw-uppercase',
      'ghost': 'cmw-border-primary-400 cmw-text-primary-400 cmw-font-bold cmw-uppercase hover:(cmw-bg-primary-50 cmw-text-primary-400)',
      'ghost-inverse': 'cmw-border-white cmw-text-white cmw-font-bold cmw-uppercase hover:(cmw-bg-primary-50 cmw-text-primary-400)',
      'text': 'cmw-btn-text',
    })[props.variant]

    return { getSpacing, getVariant, getSize }
  },
})
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
