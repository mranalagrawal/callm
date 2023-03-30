<script>
import { getCurrentInstance, ref, toRef, useRoute, watch } from '@nuxtjs/composition-api'
import chevronDownIcon from '~/assets/svg/chevron-down.svg'
import searchIcon from '~/assets/svg/search.svg'

export default {
  name: 'CmwDropdown',
  inheritAttrs: false,
  props: {
    useSearchField: {
      type: Boolean,
    },
    useParentControl: {
      type: Boolean,
    },
    active: {
      type: Boolean,
    },
    label: {
      type: String,
      default: '',
    },
    value: {
      type: String,
      required: true,
    },
    footerLabel: {
      type: String,
      default: '',
    },
    showFooter: {
      type: Boolean,
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
  emits: ['change', 'update-value', 'update-trigger'],
  setup(props, { emit }) {
    const route = useRoute()
    const key = getCurrentInstance().proxy.$vnode.key
    const isActive = props.useParentControl ? toRef(props, 'active') : ref(false)
    const searchTerm = ref('')
    const handleClick = (value) => {
      if (!props.useParentControl)
        isActive.value = false

      emit('update-value', value)
    }

    const handleTriggerClick = () => {
      emit('update-trigger', key)
      if (!props.useParentControl)
        isActive.value = !isActive.value
    }

    const getFontSize = () => ({
      sm: 'cmw-text-xs cmw-overline-1',
      md: 'cmw-text-sm',
    })[props.size]
    // Todo: Implement the search method
    const startSearch = () => console.log('search')

    watch(() => route.value, () => isActive.value = false, { deep: true })

    return { isActive, searchTerm, searchIcon, chevronDownIcon, startSearch, handleTriggerClick, getFontSize, handleClick }
  },
}
</script>

<template>
  <div class="cmw-relative" :class="isActive ? 'cmw-z-baseHigh' : 'cmw-z-base' ">
    <button
      type="button"
      class="cmw-inherit cmw-flex cmw-items-center cmw-gap-2 cmw-z-baseHigh cmw-p-3 cmw-rounded-t-sm cmw-text-sm cmw-uppercase cmw-font-light
      hover:(cmw-text-primary)
"
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
        <div v-if="showFooter" class="cmw-bg-gray-lightest cmw-rounded-b-sm">
          <Button class="cmw-mr-auto cmw-w-max" variant="text" :label="footerLabel" @click.native="onFooterClick" />
        </div>
      </div>
    </transition>
  </div>
</template>
