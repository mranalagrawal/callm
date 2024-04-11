<script lang="ts">
import type { PropType } from '@nuxtjs/composition-api'
import { defineComponent, getCurrentInstance, ref, toRef } from '@nuxtjs/composition-api'
import type { TranslateResult } from 'vue-i18n'

import chevronDownIcon from '~/assets/svg/chevron-down.svg'

import type { TSizes } from '~/types/types'

export default defineComponent({
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
      lg: 'text',
    })[props.size]

    return { isActive, searchTerm, chevronDownIcon, handleTriggerClick, getFontSize }
  },
})
</script>

<template>
  <div
    class="relative font-sans border-b"
    :class="[isActive
               ? 'z-baseHigh border-b-transparent'
               : 'z-base border-b-gray-light',
             { 'after:(content-DEFAULT absolute bg-primary top-0 left-0 h-[66px] w-1)': hasItem && !isActive }] "
  >
    <div
      class="my-2 rounded-sm"
      :class="[
        isActive
          ? 'shadow-filter shadow-popover bg-white text-primary'
          : 'text-body',
      ]"
    >
      <button
        type="button"
        class="w-full text-body flex justify-between items-center gap-2 z-baseHigh p-3 rounded-t-sm text-sm uppercase
      hover:(text-primary)
"
        :class="[
          isActive
            ? 'bg-white text-primary'
            : 'text-body',
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
          height="42"
          :data="chevronDownIcon"
        />
      </button>
      <transition>
        <div
          v-show="isActive"
          class="z-base bg-white rounded-b-sm rounded-tr-sm"
        >
          <!-- List Items -->
          <slot name="children" />
          <div v-if="footerLabel" class="bg-gray-lightest rounded-b-sm">
            <CmwButton class="mr-auto w-max z-base" variant="text" :label="footerLabel" @click.native="onFooterClick" />
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>
