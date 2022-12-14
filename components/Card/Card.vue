<template>
  <button
    class="cmw-w-full cmw-grid cmw-grid-cols-[25%_auto_40px] cmw-items-center cmw-rounded cmw-border cmw-border-gray cmw-min-h-[98px] cmw-text-left cmw-mb-4"
    :class="[getBgColor()]"
  >
    <span class="cmw-h-full cmw-bg-cover cmw-bg-center cmw-rounded-tl cmw-rounded-bl cmw-overflow-hidden" :style="`backgroundImage: url('${bgUrl}')`"/>
    <span class="cmw-block cmw-p-2 cmw-overflow-hidden" :class="{'cmw-col-start-2 cmw-col-end-[-1]': !icon}">
      <span v-if="title" class="cmw-block cmw-overline-2 cmw-truncate" v-text="title" />
      <span v-if="subtitle" class="cmw-block cmw-line-clamp-2 cmw-leading-tight cmw-text-primary-400 cmw-font-secondary cmw-text-sm" v-text="subtitle" />
    </span>
    <span v-if="icon" class="cmw-w-full"><!-- Todo: Add icon when backend finish --></span>
  </button>
</template>

<script>

export default {
  name: "Card",
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
      validator: (prop) => ['gray', 'white'].includes(prop),
      default: 'white'
    },
  },
  computed: {
    getNumberColor() {
      return this.$props.bgColor === 'white' ? 'cmw-text-primary' : 'cmw-text-white'
    }
  },
  methods: {
    getBgColor() {
      return ({
        gray: 'cmw-bg-gray-lightest',
        'white': 'cmw-bg-white',
      })[this.$props.bgColor]
    }
  }
}
</script>
