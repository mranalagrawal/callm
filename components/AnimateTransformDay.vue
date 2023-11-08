<script lang="ts">
import type { PropType } from '@nuxtjs/composition-api'
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({

  name: 'AnimateTransformDay',
  props: {
    from: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
    direction: {
      type: String as PropType<'forward' | 'reverse'>,
      default: 'forward',
    },
    translate: {
      type: String as PropType<'translate' | 'rotate'>,
      default: 'translate',
    },
    duration: {
      type: String,
      default: '0.4s',
    },
  },
})
</script>

<template>
  <animateTransform
    :data-animate-direction="direction"
    attributeName="transform"
    attributeType="XML"
    :type="translate"
    :from="from"
    :to="to"
    begin="indefinite"
    :dur="duration"
    fill="freeze"
  />
</template>
