<script lang="ts">
import type { PropType } from '@nuxtjs/composition-api'
import { defineComponent } from '@nuxtjs/composition-api'

import type { TSizes } from '~/types/types'

export default defineComponent({
  name: 'ButtonIcon',
  props: {
    icon: {
      type: Object,
      require: true,
    },
    size: {
      type: String as PropType<TSizes | string>,
      default: 'md',
    },
    variant: {
      type: String as PropType<'filled' | 'filled-white' | 'ghost' | 'icon' | 'icon-primary'>,
      default: 'filled',
    },
  },
  setup(props) {
    const getSize = () => ({
      xs: '12',
      sm: '22',
      md: '32',
    })[props.size] || props.size

    const getVariant = () => ({
      'filled-white': 'bg-white text-primary-400 rounded-sm hover:(border-primary)',
      'filled': 'bg-primary-400 text-white rounded-sm border-2 border-primary-400 hover:(bg-primary)',
      'ghost': 'bg-white text-primary-400 rounded-sm border-2 border-primary-400 hover:(border-primary-400)',
      'icon': 'text-primary-400 rounded-full',
      'icon-primary': 'text-primary rounded-full',
    })[props.variant]

    return { getSize, getVariant }
  },
})
</script>

<template>
  <button
    type="button"
    class="ripple flex p-1"
    :class="[getVariant(), `-${variant}`]"
  >
    <VueSvgIcon class="m-auto" :data="icon" :width="getSize()" height="auto" />
  </button>
</template>

<style scoped>
.ripple {
  background-position: center;
  transition: background 0.8s, transform 0.3s;
}

.ripple.-icon:hover, .ripple.-icon-primary:hover {
  background: radial-gradient(circle, transparent 1%, theme('colors.primary.50') 1%) center/15000% theme('colors.primary.50');
}

.ripple.-icon:active, .ripple.-icon-primary:active {
  background-size: 100%;
  background-color: theme('colors.primary.100');
  transition: background 0s;
}
</style>
