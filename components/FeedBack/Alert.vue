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
        error: 'cmw-bg-error/15 cmw-text-error cmw-text-error cmw-border cmw-border-error/25',
        success: 'cmw-bg-success/15 cmw-text-success cmw-text-success cmw-border cmw-border-success/25',
        info: 'cmw-bg-info/15 cmw-text-info cmw-text-info cmw-border cmw-border-info/25',
        warning: 'cmw-bg-warning/15 cmw-text-warning cmw-text-warning cmw-border cmw-border-warning/25',
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
    class="cmw-rounded-sm cmw-p-2 cmw-text-sm cmw-my-4"
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
