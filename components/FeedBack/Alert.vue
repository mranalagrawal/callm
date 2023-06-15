<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Alert',
  props: {
    severity: {
      type: String,
      required: true,
      validator: prop => ['error', 'success', 'info', 'warning'].includes(prop),
    },
    useIcon: {
      type: Boolean,
    },
  },
  methods: {
    getColor() {
      return ({
        error: 'bg-error/15 text-error text-error border border-error/25',
        success: 'bg-success/15 text-success text-success border border-success/25',
        info: 'bg-info/15 text-info text-info border border-info/25',
        warning: 'bg-warning/15 text-warning text-warning border border-warning/25',
      })[this.$props.severity]
    },
    getIcon() {
      return ({
        error: 'close.svg',
        success: 'checkmark.svg',
        info: 'close.svg', // Todo: Add icons, shall we have context-icons?
        warning: 'close.svg', // Todo: Add icons, shall we have context-icons?
      })[this.$props.severity]
    },
  },
}
</script>

<template>
  <div
    class="rounded-sm p-2 text-sm my-4"
    :class="getColor()"
  >
    <slot>
      <VueSvgIcon
        v-if="useIcon"
        :data="require(`@/assets/svg/${getIcon()}`)"
        width="14px"
        height="14px"
      />
      <span>hello {{ severity }}</span>
    </slot>
  </div>
</template>
