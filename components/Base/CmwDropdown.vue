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
      xs: 'cmw-text-xs cmw-overline-1 cmw-font-normal',
      sm: 'cmw-text-xs cmw-overline-1 cmw-font-normal',
      md: 'cmw-text-sm',
      lg: 'cmw-text-sm',
    })[props.size]

    return { isActive, searchTerm, chevronDownIcon, handleTriggerClick, getFontSize }
  },
})
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
        class="cmw-absolute top-full cmw-z-base cmw-bg-white cmw-shadow-popover cmw-w-[310px] cmw-rounded-b-sm"
        :class="[position === 'right' ? 'cmw-right-0 cmw-rounded-tl-sm' : 'cmw-left-0 cmw-rounded-tr-sm']"
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
