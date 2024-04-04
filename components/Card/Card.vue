<script lang="ts">
import { computed, defineComponent } from '@nuxtjs/composition-api'
import type { PropType } from '@nuxtjs/composition-api'

import type { DEPRECATED_FEATURES, FEATURES } from '~/utilities/icons'

import { getIconByFeature } from '~/utilities/icons'

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Card',
  props: {
    title: {
      type: [String, Number],
    },
    subtitle: {
      type: [String, Number],
    },
    icon: {
      type: String as PropType<DEPRECATED_FEATURES | FEATURES>,
    },
    bgUrl: {
      type: [String],
      required: true,
    },
    bgColor: {
      type: String as PropType<'gray' | 'white'>,
      default: 'white',
    },
    showBg: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const getBgColor = () => ({
      gray: 'bg-gray-lightest',
      white: 'bg-white',
    })[props.bgColor]

    const getNumberColor = computed(() => props.bgColor === 'white' ? 'text-primary' : 'text-white')

    return {
      getBgColor,
      getNumberColor,
    }
  },
  methods: {
    getIconByFeature,
  },
})
</script>

<template>
  <div
    class="w-full max-w-450px grid grid-cols-[90px_auto_40px] items-center rounded border border-gray min-h-[98px] text-left mb-4"
    :class="[getBgColor()]"
  >
    <span
      v-if="$props.showBg"
      class="h-full bg-cover bg-center rounded-tl rounded-bl overflow-hidden"
      :style="`backgroundImage: url('${bgUrl}&w=${200}')`"
    />
    <span class="block p-2 overflow-hidden" :class="{ 'col-start-2 col-end-[-1]': !icon }">
      <span v-if="title" class="block overline-2 font-medium truncate mb-1" v-text="title" />
      <span v-if="subtitle" class="block line-clamp-2 leading-snug text-primary-400 text-sm" v-text="subtitle" />
    </span>
    <span v-if="icon" class="justify-self-end self-start p-2 text-gray">
      <VueSvgIcon
        :data="require(`@/assets/svg/${getIconByFeature(icon)}.svg`)"
        class="block"
        width="22"
        height="auto"
      />
    </span>
  </div>
</template>
