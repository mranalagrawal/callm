<script>
import { toRefs, useContext, useRouter } from '@nuxtjs/composition-api'

export default {
  props: ['thirdLevel'],
  emits: ['close-banner'],
  setup(props, { emit }) {
    const { localeLocation, $sentry } = useContext()
    const router = useRouter()
    const { marketing_cta, marketing_image, third_level_name, third_level_link, is_last_item, is_red, selection, icon } = toRefs(props.thirdLevel)
    const handleClick = (to) => {
      if (!to) {
        $sentry.captureException(new Error('Missing destination on third level menu'))
        router.push(localeLocation(('/')))
        return
      }
      emit('close-banner')
      router.push(localeLocation((to)))
    }
    return { marketing_cta, marketing_image, third_level_name, third_level_link, is_last_item, is_red, selection, icon, handleClick }
  },
}
</script>

<template>
  <div class="font-sans" :class="{ 'mt-auto pt-4 pb-2': is_last_item }">
    <div
      v-if="!marketing_cta" class="py-1"
      :class="[{ 'flex items-center border-b border-b-gray-light': selection }]"
    >
      <!-- Note: on Nuxt 3 this will be handle by the navigation instead so we can properly use <NuxtLink /> -->
      <button class="hover:text-primary" @click="handleClick(third_level_link)">
        <VueSvgIcon
          v-if="selection"
          color="#E6362E"
          :data="require(`@/assets/svg/selections/${selection}.svg`)"
          width="20px"
        />
        <span class="text-sm font-light" :class="{ 'text-primary-400': is_last_item || is_red }">{{ third_level_name }}</span>
      </button>
    </div>
    <Card
      v-else :bg-url="marketing_image.url" :title="third_level_name" :subtitle="marketing_cta"
      :icon="icon"
      @click.native="handleClick(third_level_link)"
    />
  </div>
</template>
