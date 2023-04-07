<script>
import { getCurrentInstance, ref, toRef } from '@nuxtjs/composition-api'
import chevronDownIcon from '~/assets/svg/chevron-down.svg'

export default {
  name: 'CmwDropdown',
  inheritAttrs: false,
  props: {
    useSearchField: { type: Boolean },
    active: { type: Boolean, required: true },
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
  <div class="cmw-relative" :class="isActive ? 'cmw-z-baseHigh' : 'cmw-z-base' ">
    <button
      type="button"
      class="cmw-inherit cmw-flex cmw-items-center cmw-gap-2 cmw-z-baseHigh cmw-p-3 cmw-rounded-t-sm cmw-uppercase cmw-font-light
      hover:(cmw-text-primary)"
      :class="[
        isActive ? 'cmw-shadow-filter cmw-bg-white cmw-text-primary' : 'cmw-text-body',
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
        height="18"
        :data="chevronDownIcon"
      />
    </button>
    <transition>
      <div
        v-show="isActive"
        class="cmw-absolute top-full left-0 cmw-z-base cmw-bg-white cmw-shadow-popover cmw-w-[310px] cmw-rounded-b-sm cmw-rounded-tr-sm"
      >
        <!-- List Items -->
        <slot name="children" />
        <div v-if="footerLabel" class="cmw-bg-gray-lightest cmw-rounded-b-sm">
          <Button class="cmw-mr-auto cmw-w-max" variant="text" :label="footerLabel" @click.native="onFooterClick" />
        </div>
      </div>
    </transition>
  </div>
</template>
