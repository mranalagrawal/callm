<script lang="ts">
import type { PropType } from '@nuxtjs/composition-api'
import { computed, defineComponent, getCurrentInstance, ref, useRoute, watch } from '@nuxtjs/composition-api'
import chevronDownIcon from '~/assets/svg/chevron-down.svg'
import type { IOptions, TPosition, TSizes } from '~/types/types'

export default defineComponent({
  name: 'CmwSelect',
  inheritAttrs: false,
  props: {
    position: { type: String as PropType<TPosition> },
    isFullWidth: {
      type: Boolean,
    },
    options: {
      type: Array as PropType<IOptions[]>,
      required: true,
    },
    size: {
      type: String as PropType<TSizes>,
      default: 'md',
    },
  },
  emits: ['update-value'],
  setup(props, { emit }) {
    const route = useRoute()
    const key = getCurrentInstance()?.proxy.$vnode.key
    const searchTerm = ref('')
    const handleClick = (value: string) => {
      emit('update-value', value)
    }

    const getFontSize = () => ({
      xs: 'cmw-text-xs cmw-overline-1',
      sm: 'cmw-text-xs cmw-overline-1',
      md: 'cmw-text-sm',
      lg: 'cmw-text-sm',
    })[props.size]

    const useSearchField = computed(() => props.options.length > 10)
    const filteredOptions = computed(() => useSearchField
      ? props.options.filter(option => `${option.label}`.toLowerCase().includes(searchTerm.value.toLowerCase()))
      : props.options,
    )

    watch(() => route.value, () => searchTerm.value = '', { deep: true })

    return { key, useSearchField, filteredOptions, searchTerm, chevronDownIcon, getFontSize, handleClick }
  },
})
</script>

<template>
  <div class="cmw-relative">
    <div
      class="cmw-z-base cmw-bg-white cmw-rounded-b-sm cmw-rounded-tr-sm"
      :class="[
        isFullWidth ? 'cmw-w-full' : 'cmw-w-[310px]',
        position === 'right' ? 'cmw-right-0 cmw-rounded-tl-sm' : 'cmw-left-0 cmw-rounded-tr-sm']
      "
    >
      <div
        v-if="useSearchField"
        class="cmw-relative cmw-p-4"
      >
        <div class="cmw-sticky cmw-top-0">
          <input
            :id="`search-term${key}`"
            v-model="searchTerm"
            type="search"
            class="
               c-searchInput cmw-px-4 cmw-text-gray-dark cmw-py-2 cmw-w-full cmw-bg-transparent cmw-border cmw-border-gray-light cmw-rounded
               hover:(cmw-border-gray)
               focus:(cmw-outline-none cmw-border-gray-dark)"
            :placeholder="$t('navbar.search')"
          >
        </div>
      </div>
      <!-- List Items -->
      <div class="cmw-pt-1 cmw-max-h-[300px] cmw-overflow-auto">
        <button
          v-for="(option) in filteredOptions"
          :key="option.value"
          type="button"
          class="cmw-font-sans cmw-text-body  cmw-block cmw-w-full cmw-text-left cmw-text-sm cmw-py-3 cmw-pl-4 hover:cmw-bg-primary-50"
          :class="{ 'cmw-bg-primary-50 cmw-font-medium': option.selected }"
          @click="handleClick(option.value)"
        >
          <VueSvgIcon
            v-if="option.selected && !option.icon" :data="require(`@/assets/svg/checkmark.svg`)"
            color="#d94965" class="cmw-mr-2"
          />
          <VueSvgIcon
            v-if="option.icon" :data="require(`@/assets/svg/selections/${option.icon}.svg`)" color="#a3a3a3"
            width="24" height="auto"
          />
          <span v-html="option.label" />
        </button>
      </div>
    </div>
  </div>
</template>
