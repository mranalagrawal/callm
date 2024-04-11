<script lang="ts">
import type { PropType } from '@nuxtjs/composition-api'
import { defineComponent, shallowRef } from '@nuxtjs/composition-api'

import chevronRightIcon from '~/assets/svg/chevron-right.svg'

import type { IProductBreadcrumbs } from '~/types/product'

export default defineComponent({
  props: {
    breadcrumbs: {
      type: Array as PropType<IProductBreadcrumbs[]>,
      required: true,
    },
  },

  setup(props) {
    const shallowBreadcrumb = shallowRef(props.breadcrumbs)
    const lastBreadcrumb = shallowBreadcrumb.value.pop()

    return { shallowBreadcrumb, lastBreadcrumb, chevronRightIcon }
  },
})
</script>

<template>
  <nav class="<md:sr-only md:(flex items-center) my-2 font-sans text-sm">
    <div v-for="({ label, to }) in shallowBreadcrumb" v-once :key="to">
      <NuxtLink
        class="text-primary-400"
        :to="localePath(to)"
      >
        {{ label }}
      </NuxtLink>
      <VueSvgIcon
        class="mx-1"
        width="12"
        height="12"
        :data="chevronRightIcon"
      />
    </div>
    <span class="text-gray-dark">{{ lastBreadcrumb.label }}</span>
  </nav>
</template>
