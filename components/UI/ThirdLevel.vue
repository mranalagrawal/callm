<script>
import { toRefs, useContext, useRouter } from '@nuxtjs/composition-api'

export default {
  props: ['thirdLevel'],
  emits: ['close-banner'],
  setup(props, { emit }) {
    const { localeLocation, $sentry } = useContext()
    const router = useRouter()
    const { marketing_cta, marketing_image, third_level_name, third_level_link, is_last_item, selection, icon } = toRefs(props.thirdLevel)
    const handleClick = (to) => {
      if (!to) {
        $sentry.captureException(new Error('Missing destination on third level menu'))
        router.push(localeLocation(('/')))
        return
      }
      emit('close-banner')
      router.push(localeLocation((to)))
    }
    return { marketing_cta, marketing_image, third_level_name, third_level_link, is_last_item, selection, icon, handleClick }
  },
}
</script>

<template>
  <div class="cmw-font-sans" :class="{ 'cmw-mt-auto cmw-pt-4 cmw-pb-2': is_last_item }">
    <div
      v-if="!marketing_cta" class="cmw-py-1"
      :class="[{ 'cmw-flex cmw-items-center cmw-border-b cmw-border-b-gray-light': selection }]"
    >
      <!-- Note: on Nuxt 3 this will be handle by the navigation instead so we can properly use <NuxtLink /> -->
      <button class="hover:cmw-text-primary" @click="handleClick(third_level_link)">
        <VueSvgIcon
          v-if="selection"
          color="#E6362E"
          :data="require(`@/assets/svg/selections/${selection}.svg`)"
          width="20px"
        />
        <span class="cmw-text-sm cmw-font-light" :class="{ 'cmw-text-primary-400': is_last_item }">{{ third_level_name }}</span>
      </button>
    </div>
    <Card
      v-else :bg-url="marketing_image.url" :title="third_level_name" :subtitle="marketing_cta"
      :icon="icon"
      @click.native="handleClick(third_level_link)"
    />
  </div>
</template>
