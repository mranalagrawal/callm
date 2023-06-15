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
      xs: 'text-xs overline-1',
      sm: 'text-xs overline-1',
      md: 'text-sm',
      lg: 'text-sm',
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
  <div class="relative">
    <div
      class="z-base bg-white rounded-b-sm rounded-tr-sm"
      :class="[
        isFullWidth ? 'w-full' : 'w-[310px]',
        position === 'right' ? 'right-0 rounded-tl-sm' : 'left-0 rounded-tr-sm']
      "
    >
      <div
        v-if="useSearchField"
        class="relative p-4"
      >
        <div class="sticky top-0">
          <input
            :id="`search-term${key}`"
            v-model="searchTerm"
            type="search"
            class="
               c-searchInput px-4 text-gray-dark py-2 w-full bg-transparent border border-gray-light rounded
               hover:(border-gray)
               focus:(outline-none border-gray-dark)"
            :placeholder="$t('navbar.search')"
          >
        </div>
      </div>
      <!-- List Items -->
      <div class="pt-1 max-h-[300px] overflow-auto">
        <button
          v-for="(option) in filteredOptions"
          :key="option.value"
          type="button"
          class="font-sans text-body  block w-full text-left text-sm py-3 pl-4 hover:bg-primary-50"
          :class="{ 'bg-primary-50 font-medium': option.selected }"
          @click="handleClick(option.value)"
        >
          <VueSvgIcon
            v-if="option.selected && !option.icon" :data="require(`@/assets/svg/checkmark.svg`)"
            color="#d94965" class="mr-2"
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
