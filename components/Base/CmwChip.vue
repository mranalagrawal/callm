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
    shape: {
      validator: prop => ['rounded', 'pill'].includes(prop),
      default: 'pill',
    },
  },
  setup(props) {
    const getColor = () => ({
      'primary': 'cmw-bg-primary-50 cmw-text-primary',
      'secondary': 'cmw-bg-secondary cmw-text-white',
      'secondary-400': 'cmw-bg-secondary-400 cmw-text-white',
    })[props.color]

    const getShape = () => ({
      pill: 'cmw-rounded-pill',
      rounded: 'cmw-rounded-sm',
    })[props.shape]

    return { closeIcon, getColor, getShape }
  },
}
</script>

<template>
  <div
    class="cmw-w-max cmw-flex cmw-items-center cmw-justify-center cmw-gap-1 cmw-pl-2 cmw-pr-2.5 cmw-py-1"
    :class="[getColor(), getShape()]"
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
