<script lang="ts">
import {
  defineComponent,
  inject,
  onMounted,
  ref, useContext,
  useFetch, watch,
} from '@nuxtjs/composition-api'
import { kv } from '@vercel/kv'

import chevronDownIcon from '~/assets/svg/chevron-down.svg'

import type { TISO639 } from '~/config/themeConfig'
import { generateKey } from '~/utilities/strings'

export default defineComponent({
  setup() {
    const { i18n } = useContext()
    const isDesktop = inject('isDesktop')
    const currentItem = ref('')
    const jsIsDisabled = ref(true)
    const filteredItems = ref<Record<string, any>[]>([])

    const handleTriggerClick = (id: string) => {
      currentItem.value = currentItem.value === id ? '' : id
    }

    const { fetch } = useFetch(async ({ $i18n, $cmwStore }) => {
      const locale = $i18n.locale as TISO639
      const prismicLocale = $cmwStore.prismicSettings.isoCode[locale]
      const data: any = await kv.get(`prismic/pre-footer/pre-footer-${prismicLocale}`)

      filteredItems.value = data.map((menuItem: { id: string; items: any[]; primary: any }) => {
        const filteredItems = menuItem.items
          .filter(item => item.name !== null && item.name !== undefined && item.link !== null && item.link !== undefined)
        return {
          id: menuItem.id,
          items: filteredItems,
          primary: menuItem.primary,
        }
      })
    })

    onMounted(() => {
      if (process.client) {
        jsIsDisabled.value = !window.navigator
      }
    })

    watch(() => i18n.locale, () => fetch())

    return {
      chevronDownIcon,
      currentItem,
      filteredItems,
      handleTriggerClick,
      isDesktop,
      jsIsDisabled,
    }
  },
  methods: { generateKey },

})
</script>

<template>
  <div class="max-w-screen-xl mx-auto md:px-4">
    <div class="h2 text-center pt-20 pb-8 !mt-0">
      {{ $t('footer.explore') }}
    </div>
    <div class="grid justify-stretch lg:grid-cols-[repeat(auto-fit,_minmax(100px,_1fr))]">
      <div v-for="item in filteredItems" :key="item.id" class="px-2">
        <div
          class="w-full flex justify-between items-center border-b border-b-transparent"
          :class="{ 'border-b-gray': !isDesktop }"
        >
          <component
            :is="item.primary?.link ? 'NuxtLink' : 'div'"
            :to="item.primary?.link ? localePath(item.primary.link) : null"
            class="block overline-2 text-secondary-700 text-uppercase text-sm pl-2 py-2 select-none"
          >
            {{ item.primary?.title }}
          </component>
          <button
            type="button"
            class="w-12 h-12 text-primary flex md:hidden"
            :class="[currentItem === item.id ? '' : 'text-body']"
            @click="handleTriggerClick(item.id)"
          >
            <VueSvgIcon
              class="transform transition-transform text-primary m-auto"
              :class="currentItem === item.id ? 'rotate-180' : 'rotate-0'"
              width="18"
              height="42"
              color="#992545"
              :data="chevronDownIcon"
            />
          </button>
        </div>
        <div
          class="transition transition-max-h"
          :class="currentItem === item.id || isDesktop || jsIsDisabled ? 'max-h-screen' : 'max-h-1px overflow-hidden'"
        >
          <NuxtLink
            v-for="link in item.items" :key="generateKey(`inner_${link.name}`)"
            :to="localePath(link.link || '/')" class="block px-2 my-2 text-body"
          >
            {{ link.name }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
