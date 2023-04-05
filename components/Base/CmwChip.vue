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
      validator: prop => ['primary', 'secondary', 'secondary-400'].includes(prop),
      default: 'primary',
    },
    shape: {
      validator: prop => ['rounded', 'pill'].includes(prop),
      default: 'pill',
    },
    variant: {
      validator: prop => ['overline-1', 'overline-2', 'default'].includes(prop),
      default: 'default',
    },
    size: {
      validator: prop => ['xs', 'sm', 'md'].includes(prop),
      default: 'md',
    },
  },
  setup(props) {
    const getColor = () => ({
      'primary': 'cmw-bg-primary-50 cmw-text-primary hover:(cmw-bg-primary cmw-text-white)',
      'secondary': 'cmw-bg-secondary cmw-text-white',
      'secondary-400': 'cmw-bg-secondary-400 cmw-text-white',
    })[props.color]

    const getShape = () => ({
      pill: 'cmw-rounded-pill',
      rounded: 'cmw-rounded-sm',
    })[props.shape]

    const getVariant = () => ({
      'overline-1': 'cmw-overline-1',
      'overline-2': 'cmw-overline-2',
      'default': '',
    })[props.variant]

    const getSize = () => ({
      xs: 'cmw-text-sm cmw-px-2 cmw-py-0',
      sm: 'cmw-pl-3 cmw-pr-2.5 cmw-py-0',
      md: 'cmw-pl-2 cmw-pr-2.5 cmw-py-1',
    })[props.size]

    return { closeIcon, getColor, getShape, getVariant, getSize }
  },
}
</script>

<template>
  <div
    class="cmw-transition-colors cmw-w-max cmw-flex cmw-items-center cmw-justify-center cmw-gap-1"
    :class="[getColor(), getShape(), getSize()]"
  >
    <VueSvgIcon
      v-if="icon"
      :data="icon"
      width="16"
      height="auto"
    />
    <small
      class="cmw-block cmw-capitalize cmw-leading-[1rem] cmw-select-none"
      :class="getVariant()"
      v-text="label"
    />
    <button v-if="onDelete" class="cmw-flex cmw-py-1" @click.stop="onDelete">
      <VueSvgIcon :data="closeIcon" width="12" height="12" />
    </button>
  </div>
</template>
