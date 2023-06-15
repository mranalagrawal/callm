<script>
import { getIconByFeature } from '@/utilities/icons'

export default {
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
      type: [String, Number],
    },
    bgUrl: {
      type: [String],
      required: true,
    },
    bgColor: {
      type: String,
      validator: prop => ['gray', 'white'].includes(prop),
      default: 'white',
    },
  },
  computed: {
    getNumberColor() {
      return this.$props.bgColor === 'white' ? 'text-primary' : 'text-white'
    },
  },
  methods: {
    getIconByFeature,
    getBgColor() {
      return ({
        gray: 'bg-gray-lightest',
        white: 'bg-white',
      })[this.$props.bgColor]
    },
  },
}
</script>

<template>
  <button
    class="w-full max-w-450px grid grid-cols-[90px_auto_40px] items-center rounded border border-gray min-h-[98px] text-left mb-4"
    :class="[getBgColor()]"
  >
    <span class="h-full bg-cover bg-center rounded-tl rounded-bl overflow-hidden" :style="`backgroundImage: url('${bgUrl}')`" />
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
  </button>
</template>
