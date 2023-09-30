<script lang="ts">
import type { PropType } from '@nuxtjs/composition-api'
import { defineComponent } from '@nuxtjs/composition-api'
import type { TranslateResult } from 'vue-i18n'
import type { RawLocation } from 'vue-router'
import type { TButtonVariant, TSizes } from '~/types/types'

export default defineComponent({
  name: 'CmwButton',
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
      xs: 'text-xs rounded-sm px-3 py-1 md:(px-4 py-[0.4rem])',
      sm: 'text-sm',
      md: 'text-sm md:text-base',
      lg: 'text-base',
    })[props.size] || props.size

    const getSpacing = () => ({
      'default': 'btn-base-spacing',
      'default-inverse': 'btn-base-spacing',
      'ghost': 'btn-base-spacing',
      'ghost-inverse': 'btn-base-spacing',
      'text': 'px-1 py-2 md:(py-[0.8rem])',
    })[props.variant]

    const getVariant = () => ({
      'default': 'btn-default disabled:(bg-gray-light)',
      'default-inverse': 'font-secondary cmw-font-bold border-transparent bg-white text-primary-400 uppercase',
      'ghost': 'border-primary-400 bg-white text-primary-400 cmw-font-bold uppercase hover:(bg-primary-50)',
      'ghost-inverse': 'border-white text-white cmw-font-bold uppercase hover:(bg-primary-50 text-primary-400)',
      'text': 'btn-text',
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
    class="btn-base disabled:(text-gray cursor-not-allowed)"
    :class="[getVariant(), getSize(), getSpacing()]"
  >
    <slot>{{ $props.label }}</slot>
  </component>
</template>
