<script lang="ts">
import type { PropType } from '@nuxtjs/composition-api'
import { defineComponent } from '@nuxtjs/composition-api'

import type { TContextual } from '~/types/types'

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Alert',
  props: {
    severity: {
      type: String as PropType<TContextual>,
      required: true,
    },
    useIcon: {
      type: Boolean,
    },
  },
  setup(props) {
    const getColor = () => {
      return ({
        error: 'bg-error/15 text-error text-error border border-error/25',
        success: 'bg-success/15 text-success text-success border border-success/25',
        info: 'bg-info/15 text-info text-info border border-info/25',
        warning: 'bg-warning/15 text-warning text-warning border border-warning/25',
      })[props.severity]
    }

    const getIcon = () => {
      return ({
        error: 'close.svg',
        success: 'checkmark.svg',
        info: 'info.svg',
        warning: 'close.svg', // Todo: Add icons, shall we have context-icons?
      })[props.severity]
    }

    return { getColor, getIcon }
  },
})
</script>

<template>
  <div
    class="rounded-sm p-2 text-sm my-4 items-center"
    :class="[
      getColor(),
      useIcon ? 'grid grid-cols-[40px_auto] justify-items-center' : '']"
  >
    <VueSvgIcon
      v-if="useIcon"
      :data="require(`@/assets/svg/${getIcon()}`)"
      width="28"
      height="28"
    />
    <slot>
      <span>hello {{ severity }}</span>
    </slot>
  </div>
</template>
