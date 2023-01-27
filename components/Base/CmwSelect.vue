<script>
import { ref } from '@nuxtjs/composition-api'
import chevronDownIcon from '~/assets/svg/chevron-down.svg'
import searchIcon from '~/assets/svg/search.svg'

export default {
  name: 'CmwSelect',
  inheritAttrs: false,
  props: {
    useSearchField: {
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
  },
  emits: ['change', 'update-value'],
  setup(props, { emit }) {
    const isActive = ref(false)
    const searchTerm = ref('')
    const handleClick = (value) => {
      isActive.value = false
      emit('update-value', value)
    }

    // Todo: Implement the search method
    const startSearch = () => console.log('search')

    return { isActive, searchTerm, startSearch, searchIcon, chevronDownIcon, handleClick }
  },
}
</script>

<template>
  <div class="cmw-relative">
    <button
      type="button"
      class="cmw-inherit cmw-flex cmw-items-center cmw-gap-2 cmw-z-baseHigh cmw-p-3 cmw-rounded-t-sm cmw-text-sm cmw-uppercase cmw-font-light
      hover:(cmw-text-primary)
"
      :class="isActive ? 'cmw-shadow-filter cmw-bg-white cmw-text-primary' : 'cmw-text-body'"
      @click="isActive = !isActive"
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
        class="cmw-absolute top-full left-0 cmw-z-baseLow cmw-bg-white cmw-shadow-popover cmw-w-[310px] cmw-rounded-b-sm cmw-rounded-tr-sm"
      >
        <div
          v-if="useSearchField"
          class="cmw-relative"
        >
          <input
            v-model="searchTerm"
            type="search"
            placeholder="placeholder"
          >
          <ButtonIcon
            :icon="searchIcon"
            size="sm"
            class="cmw-transform cmw-absolute cmw-top-1/2 cmw-right-0 cmw-translate-y-[-50%] cmw-translate-x-[-30%]"
            @click.native="startSearch"
          />
        </div>
        <!-- List Items -->
        <div class="cmw-pt-1">
          <button
            v-for="({ label, value }) in options"
            :key="value"
            class="cmw-font-sans cmw-block cmw-w-full cmw-text-left cmw-text-sm cmw-py-3 cmw-pl-4 hover:cmw-bg-primary-50"
            @click="handleClick(value)"
          >
            {{ label }}
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
