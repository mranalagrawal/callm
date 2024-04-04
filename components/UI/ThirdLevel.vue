<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import type { PropType } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    thirdLevel: {
      type: Object as PropType<Record<string, any>>,
      required: true,
    },
    showBg: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['close-banner'],
})
</script>

<template>
  <div class="font-sans" :class="{ 'mt-auto pt-4 pb-2': thirdLevel.is_last_item }">
    <div
      v-if="!thirdLevel.marketing_cta" class="py-1"
      :class="[{ 'flex items-center border-b border-b-gray-light': thirdLevel.selection }]"
    >
      <NuxtLink class="hover:text-primary" :to="localePath(thirdLevel.third_level_link)">
        <VueSvgIcon
          v-if="thirdLevel.selection"
          color="#E6362E"
          :data="require(`@/assets/svg/selections/${thirdLevel.selection}.svg`)"
          width="20px"
        />
        <span
          class="text-sm cmw-font-light"
          :class="{ 'text-primary-400': thirdLevel.is_last_item || thirdLevel.is_red }"
        >{{ thirdLevel.third_level_name }}</span>
      </NuxtLink>
    </div>
    <NuxtLink v-else :to="localePath(thirdLevel.third_level_link)">
      <Card
        :bg-url="thirdLevel.marketing_image.url" :title="thirdLevel.third_level_name" :subtitle="thirdLevel.marketing_cta"
        :icon="thirdLevel.icon" :show-bg="showBg"
      />
    </NuxtLink>
  </div>
</template>
