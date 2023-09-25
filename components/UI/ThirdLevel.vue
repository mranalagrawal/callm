<script lang="ts">
import { defineComponent, toRefs } from '@nuxtjs/composition-api'

export default defineComponent({
  props: ['thirdLevel'],
  emits: ['close-banner'],
  setup(props) {
    const { marketing_cta, marketing_image, third_level_name, third_level_link, is_last_item, is_red, selection, icon } = toRefs(props.thirdLevel)

    return { marketing_cta, marketing_image, third_level_name, third_level_link, is_last_item, is_red, selection, icon }
  },
})
</script>

<template>
  <div class="font-sans" :class="{ 'mt-auto pt-4 pb-2': is_last_item }">
    <div
      v-if="!marketing_cta" class="py-1"
      :class="[{ 'flex items-center border-b border-b-gray-light': selection }]"
    >
      <NuxtLink class="hover:text-primary" :to="localePath(third_level_link)">
        <VueSvgIcon
          v-if="selection"
          color="#E6362E"
          :data="require(`@/assets/svg/selections/${selection}.svg`)"
          width="20px"
        />
        <span class="text-sm cmw-font-light" :class="{ 'text-primary-400': is_last_item || is_red }">{{ third_level_name }}</span>
      </NuxtLink>
    </div>
    <NuxtLink v-else :to="localePath(third_level_link)">
      <Card
        :bg-url="marketing_image.url" :title="third_level_name" :subtitle="marketing_cta"
        :icon="icon"
      />
    </NuxtLink>
  </div>
</template>
