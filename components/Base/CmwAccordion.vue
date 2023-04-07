<script>
import { getCurrentInstance, ref, toRef } from '@nuxtjs/composition-api'
import chevronDownIcon from '~/assets/svg/chevron-down.svg'

export default {
  name: 'CmwAccordion',
  inheritAttrs: false,
  props: {
    useSearchField: { type: Boolean },
    active: { type: Boolean, required: true },
    hasItem: { type: Boolean },
    label: {
      type: String,
      default: '',
    },
    footerLabel: {
      type: String,
      default: '',
    },
    onFooterClick: {
      type: [Function],
      default: () => {},
    },
    size: {
      validator: prop => ['sm', 'md'].includes(prop) || !Number.isNaN(prop),
      default: 'md',
    },
  },
  emits: ['update-trigger'],
  setup(props, { emit }) {
    const key = getCurrentInstance().proxy.$vnode.key
    const isActive = toRef(props, 'active')
    const searchTerm = ref('')

    const handleTriggerClick = () => emit('update-trigger', key)

    const getFontSize = () => ({
      sm: 'cmw-text-xs cmw-overline-1',
      md: 'cmw-text-sm',
    })[props.size]

    return { isActive, searchTerm, chevronDownIcon, handleTriggerClick, getFontSize }
  },
}
</script>

<template>
  <div
    class="cmw-relative cmw-border-b"
    :class="[isActive
               ? 'cmw-z-baseHigh cmw-border-b-transparent'
               : 'cmw-z-base cmw-border-b-gray-light',
             { 'after:(cmw-content-DEFAULT cmw-absolute cmw-bg-primary cmw-top-0 cmw-left-0 cmw-h-[66px] cmw-w-2)': hasItem }] "
  >
    <div
      class="cmw-m-2 cmw-rounded-sm"
      :class="[
        isActive
          ? 'cmw-shadow-filter cmw-shadow-popover cmw-bg-white cmw-text-primary'
          : 'cmw-text-body',
      ]"
    >
      <button
        type="button"
        class="cmw-w-full cmw-text-body cmw-flex cmw-justify-between cmw-items-center cmw-gap-2 cmw-z-baseHigh cmw-p-3 cmw-rounded-t-sm cmw-text-sm cmw-uppercase cmw-font-light
      hover:(cmw-text-primary)
"
        :class="[
          isActive
            ? 'cmw-bg-white cmw-text-primary'
            : 'cmw-text-body',
          getFontSize(),
        ]"
        @click="handleTriggerClick"
      >
        <slot class="cmw-text-inherit">
          {{ label }}
        </slot>
        <VueSvgIcon
          class="cmw-transform cmw-transition-transform"
          :color="isActive ? '#992545' : '#d94965'"
          :class="isActive ? 'cmw-rotate-180' : 'cmw-rotate-0'"
          width="18"
          height="42"
          :data="chevronDownIcon"
        />
      </button>
      <transition>
        <div
          v-show="isActive"
          class="cmw-z-base cmw-bg-white cmw-rounded-b-sm cmw-rounded-tr-sm"
        >
          <!-- List Items -->
          <slot name="children" />
          <div v-if="footerLabel" class="cmw-bg-gray-lightest cmw-rounded-b-sm">
            <Button class="cmw-mr-auto cmw-w-max" variant="text" :label="footerLabel" @click.native="onFooterClick" />
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>
