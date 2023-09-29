<script lang="ts">
import { defineComponent, inject, onMounted, ref, useContext, useFetch, watch } from '@nuxtjs/composition-api'
import chevronDownIcon from '~/assets/svg/chevron-down.svg'
import { generateKey } from '~/utilities/strings'

export default defineComponent({
  setup() {
    const { i18n } = useContext()
    const isDesktop = inject('isDesktop')
    const currentItem = ref('')
    const data = ref<Record<string, any> | null>(null)
    const preFooterMenu = ref({})
    const jsIsDisabled = ref(true)

    const { fetch } = useFetch(async ({ $cmwRepo }) => {
      data.value = await $cmwRepo.prismic.getSinglePage('footer')
      preFooterMenu.value = data.value?.body
    })

    const handleTriggerClick = (id: string) => {
      currentItem.value = currentItem.value === id ? '' : id
    }

    watch(() => i18n.locale, () => fetch(), { deep: true })
    onMounted(() => {
      if (process.client) { jsIsDisabled.value = !window.navigator }
    })

    return {
      chevronDownIcon,
      currentItem,
      handleTriggerClick,
      isDesktop,
      jsIsDisabled,
      preFooterMenu,
    }
  },
  methods: { generateKey },

})
</script>

<template>
  <div class="max-w-screen-xl mx-auto md:px-4">
    <div class="h2 text-center pt-20 pb-8">
      {{ $t('footer.explore') }}
    </div>
    <div class="grid justify-stretch lg:grid-cols-[repeat(auto-fit,_minmax(100px,_1fr))]">
      <div v-for="item in preFooterMenu" :key="item.id" class="px-2">
        <div
          class="w-full flex justify-between items-center border-b border-b-transparent"
          :class="{ 'border-b-gray': !isDesktop }"
        >
          <component
            :is="item?.primary?.link ? 'NuxtLink' : 'div'"
            :to="item?.primary?.link ? localePath(item?.primary?.link) : null"
            class="block overline-2 text-secondary-700 text-uppercase text-sm pl-2 py-2 select-none"
          >
            {{ item?.primary?.title }}
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
          <p
            v-for="link in item.items"
            :key="generateKey(`inner_${link.name}`)"
            class="px-2"
          >
            <NuxtLink v-if="link?.link && link?.name" :to="localePath(link.link || '/')">
              {{ link.name }}
            </NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
