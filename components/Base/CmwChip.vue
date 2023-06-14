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
      'primary': 'bg-primary-50 text-primary hover:(bg-primary text-white)',
      'secondary': 'bg-secondary text-white',
      'secondary-400': 'bg-secondary-400 text-white',
    })[props.color]

    const getShape = () => ({
      pill: 'rounded-pill',
      rounded: 'rounded-sm',
    })[props.shape]

    const getVariant = () => ({
      'overline-1': 'overline-1',
      'overline-2': 'overline-2',
      'default': '',
    })[props.variant]

    const getSize = () => ({
      xs: 'text-sm px-2 py-0',
      sm: 'pl-3 pr-2.5 py-0',
      md: 'pl-2 pr-2.5 py-1',
    })[props.size]

    return { closeIcon, getColor, getShape, getVariant, getSize }
  },
}
</script>

<template>
  <div
    class="transition-colors w-max flex items-center justify-center gap-1"
    :class="[getColor(), getShape(), getSize()]"
  >
    <VueSvgIcon
      v-if="icon"
      :data="icon"
      width="16"
      height="auto"
    />
    <small
      class="block capitalize leading-[1rem] select-none"
      :class="getVariant()"
      v-text="label"
    />
    <button v-if="onDelete" class="flex py-1" @click.stop="onDelete">
      <VueSvgIcon :data="closeIcon" width="12" height="12" />
    </button>
  </div>
</template>
