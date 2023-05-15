<script lang="ts">
import { defineComponent, shallowRef } from '@nuxtjs/composition-api'
import chevronRightIcon from 'assets/svg/chevron-right.svg'
import type { IProductBreadcrumbs } from '~/types/product'

interface Props {
  breadcrumbs: IProductBreadcrumbs[]
}

export default defineComponent({
  props: {
    breadcrumbs: {
      type: Array as () => Props['breadcrumbs'],
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
  <nav class="<md:cmw-hidden md:(cmw-flex cmw-items-center) cmw-my-2 cmw-font-sans cmw-text-sm">
    <div v-for="({ label, to }) in shallowBreadcrumb" v-once :key="to">
      <NuxtLink
        class="cmw-text-primary-400"
        rel="nofollow"
        :to="localePath(to)"
      >
        {{ label }}
      </NuxtLink>
      <VueSvgIcon
        class="cmw-mx-1"
        width="12"
        height="12"
        :data="chevronRightIcon"
      />
    </div>
    <span class="text-gray-dark">{{ lastBreadcrumb.label }}</span>
  </nav>
</template>
