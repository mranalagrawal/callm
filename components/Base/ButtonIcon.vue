<script>
// noinspection JSUnusedGlobalSymbols
export default {
  name: 'ButtonIcon',
  props: {
    icon: {
      type: [Object],
      require: true,
    },
    size: {
      validator: prop => ['xs', 'sm', 'md'].includes(prop) || !Number.isNaN(prop),
      default: 'md',
    },
    variant: {
      validator: prop => ['filled', 'ghost', 'icon', 'icon-primary'].includes(prop),
      default: 'filled',
    },
  },
  setup(props) {
    const getSize = () => ({
      xs: 12,
      sm: 22,
      md: 32,
    })[props.size] || props.size

    const getVariant = () => ({
      'filled': 'bg-primary-400 text-white rounded-sm hover:(bg-primary)',
      'ghost': 'bg-white text-primary-400 rounded-sm border-2 border-primary-400 hover:(border-primary)',
      'icon': 'text-primary-400 rounded-full',
      'icon-primary': 'text-primary rounded-full',
    })[props.variant]

    return { getSize, getVariant }
  },
}
</script>

<template>
  <button
    type="button"
    class="ripple flex p-1"
    :class="[getVariant(), `-${variant}`]"
  >
    <VueSvgIcon class="m-auto" :data="icon" :width="getSize()" height="auto" />
  </button>
</template>

<style scoped>
.ripple {
  background-position: center;
  transition: background 0.8s;
}

.ripple.-icon:hover, .ripple.-icon-primary:hover {
  background: theme('colors.primary.50') radial-gradient(circle, transparent 1%, theme('colors.primary.50') 1%) center/15000%;
}
.ripple.-icon:active, .ripple.-icon-primary:active {
  background-size: 100%;
  background-color: theme('colors.primary.100');
  transition: background 0s;
}
</style>
