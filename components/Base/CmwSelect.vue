<script>
import { computed, getCurrentInstance, ref, toRef, useRoute, watch } from '@nuxtjs/composition-api'
import chevronDownIcon from '~/assets/svg/chevron-down.svg'
import searchIcon from '~/assets/svg/search.svg'

export default {
  name: 'CmwSelect',
  inheritAttrs: false,
  props: {
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
    options: {
      type: Array,
      required: true,
    },
    value: {
      type: String,
      required: true,
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

    const useSearchField = props.options.length > 10
    const filteredOptions = computed(() => useSearchField
      ? props.options.filter(option => option.label.toLowerCase().includes(searchTerm.value.toLowerCase()))
      : props.options,
    )

    watch(() => route.value, () => isActive.value = false, { deep: true })

    return { key, useSearchField, filteredOptions, isActive, searchTerm, searchIcon, chevronDownIcon, startSearch, handleTriggerClick, getFontSize, handleClick }
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
            class="cmw-font-sans cmw-block cmw-w-full cmw-text-left cmw-text-sm cmw-py-3 cmw-pl-4 hover:cmw-bg-primary-50"
            :class="{ 'cmw-bg-primary-50': option.selected }"
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
    </transition>
  </div>
</template>

<!--
Todo: Implement the search field
<div class="cmw-relative cmw-z-1">
  <input type="search" id="search-term"
       v-model="search"
       class="
               cmw-px-4 cmw-text-gray-dark cmw-py-3 cmw-w-full cmw-bg-transparent cmw-border cmw-border-gray-light cmw-rounded
               hover:(cmw-border-gray)
               focus:(cmw-outline-none cmw-border-gray-dark)"
       :placeholder="$t('navbar.search')"
       @input="suggest"
       @blur="handleBlur"
       @keyup.enter="startSearch"
/>
  <ButtonIcon :icon="searchIcon"
            @click.native="startSearch"
            size="sm"
            class="cmw-transform cmw-absolute cmw-top-1/2 cmw-right-0 cmw-translate-y-[-50%] cmw-translate-x-[-30%]"/>
</div>
-->
