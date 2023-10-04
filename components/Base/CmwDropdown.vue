<script lang="ts">
import type { PropType } from '@nuxtjs/composition-api'
import { defineComponent, getCurrentInstance, ref, toRef } from '@nuxtjs/composition-api'
import type { TranslateResult } from 'vue-i18n'
import chevronDownIcon from '~/assets/svg/chevron-down.svg'
import type { TPosition, TSizes } from '~/types/types'

export default defineComponent({
  name: 'CmwDropdown',
  inheritAttrs: false,
  props: {
    position: { type: String as PropType<TPosition> },
    active: { type: Boolean, required: true },
    label: {
      type: String as PropType<TranslateResult>,
      default: '',
    },
    footerLabel: {
      type: String as PropType<TranslateResult>,
      default: '',
    },
    onFooterClick: {
      type: [Function],
      default: () => {},
    },
    size: {
      type: String as PropType<TSizes>,
      default: 'md',
    },
  },
  emits: ['update-trigger'],
  setup(props, { emit }) {
    const key = getCurrentInstance()?.proxy.$vnode.key
    const isActive = toRef(props, 'active')
    const searchTerm = ref('')

    const handleTriggerClick = () => emit('update-trigger', key)

    const getFontSize = () => ({
      xs: 'text-xs overline-1 font-normal',
      sm: 'text-xs overline-1 font-normal',
      md: 'text-sm',
      lg: 'text-sm',
    })[props.size]

    return { isActive, searchTerm, chevronDownIcon, handleTriggerClick, getFontSize }
  },
})
</script>

<template>
  <div class="relative" :class="isActive ? 'z-baseHigh' : 'z-base' ">
    <button
      type="button"
      class="inherit flex items-center gap-2 z-baseHigh p-3 rounded-t-sm uppercase cmw-font-light
      hover:(text-primary)"
      :class="[
        isActive ? 'shadow-filter bg-white text-primary' : 'text-body',
        getFontSize(),
      ]"
      @click="handleTriggerClick"
    >
      <slot class="text-inherit">
        {{ label }}
      </slot>
      <VueSvgIcon
        class="transform transition-transform"
        :color="isActive ? '#992545' : '#d94965'"
        :class="isActive ? 'rotate-180' : 'rotate-0'"
        width="18"
        height="18"
        :data="chevronDownIcon"
      />
    </button>
    <transition>
      <div
        v-show="isActive"
        class="absolute top-full z-base bg-white shadow-popover w-[310px] rounded-b-sm"
        :class="[position === 'right' ? 'right-0 rounded-tl-sm' : 'left-0 rounded-tr-sm']"
      >
        <!-- List Items -->
        <slot name="children" />
        <div v-if="footerLabel" class="bg-gray-lightest rounded-b-sm">
          <CmwButton class="mr-auto w-max" variant="text" :label="footerLabel" @click.native="onFooterClick" />
        </div>
      </div>
    </transition>
  </div>
</template>
