<script>
// import promoTagIcon from 'assets/svg/promo-tag.svg'
import closeIcon from 'assets/svg/close.svg'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'CmwChip',
  props: {
    icon: {
      type: Object,
    },
    label: {
      type: String,
      required: true,
    },
    onDelete: {
      type: Function,
    },
    color: {
      type: String,
      validator: prop => ['primary', 'secondary'].includes(prop),
      default: 'primary',
    },
  },
  setup(props) {
    const getColor = () => ({
      primary: 'cmw-bg-primary-50 cmw-text-primary',
      secondary: 'cmw-bg-secondary-400 cmw-text-white',
    })[props.color]

    return { closeIcon, getColor }
  },
}
</script>

<template>
  <div
    class="cmw-flex cmw-items-center cmw-justify-center cmw-gap-1 cmw-rounded-pill cmw-pl-2 cmw-pr-2.5 cmw-py-1"
    :class="getColor()"
  >
    <VueSvgIcon
      v-if="icon"
      :data="icon"
      width="16"
      height="auto"
    />
    <small
      class="cmw-block cmw-overline-2 cmw-uppercase cmw-select-none cmw-leading-none"
      v-text="label"
    />
    <VueSvgIcon
      v-if="onDelete"
      :data="closeIcon"
      width="20"
      height="auto"
    />
  </div>
</template>
