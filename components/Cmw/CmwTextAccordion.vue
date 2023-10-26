<script lang="ts">
import type { PropType } from '@nuxtjs/composition-api'
import { computed, defineComponent, inject, ref } from '@nuxtjs/composition-api'
import chevronDownIcon from 'assets/svg/chevron-down.svg'

export default defineComponent({
  name: 'CmwTextButton',
  props: {
    show: {
      type: [Boolean],
      default: false,
    },
    lineClamp: {
      type: [Number, String],
      default: 0,
    },
    size: {
      type: String as PropType<'lg' | 'md' | 'sm'>,
      default: 'md',
    },
  },
  setup(props) {
    const isDesktop = inject('isDesktop')
    const isOpen = ref(false)

    const lineClamps = computed(() => props.lineClamp ? `line-clamp-${props.lineClamp}` : undefined)

    const minHeights = () => ({
      lg: 'max-h-26',
      md: 'max-h-22',
      sm: 'max-h-20',
    })[props.size]

    const currentMinHeight = computed(() => isOpen.value
      ? 'max-h-auto'
      : lineClamps.value ?? minHeights())
    const handleTriggerClick = () => {
      isOpen.value = !isOpen.value
    }

    return {
      chevronDownIcon,
      currentMinHeight,
      handleTriggerClick,
      isDesktop,
      isOpen,
      lineClamps,
      minHeights,
    }
  },
})
</script>

<template>
  <div>
    <div
      class="transition-accordion overflow-hidden"
      :class="isOpen || isDesktop ? 'max-h-screen' : currentMinHeight"
    >
      <slot />
    </div>
    <ButtonIcon
      :icon="chevronDownIcon"
      variant="filled-white"
      class="transform w-8 h-8 m-inline-auto mt-2 md:hidden"
      :class="[isOpen ? 'rotate-180' : 'rotate-0']" @click.native="handleTriggerClick"
    />
  </div>
</template>
