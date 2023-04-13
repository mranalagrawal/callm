<script>
import { ref } from '@nuxtjs/composition-api'

export default {
  components: { },
  props: {
    menu: {
      type: [Array],
      required: true,
    },
  },
  emits: ['close-sidebar'],
  setup(_, { emit }) {
    const activeItem = ref({})
    const closeSidebar = (full) => {
      activeItem.value = {}
      if (full) {
        setTimeout(() =>
          emit('close-sidebar', full), 300)
      }
    }

    const handleAfterEnter = (target) => {
      const scrollableEl = target.querySelector('.js-scroll')
      scrollableEl && scrollableEl.scrollTo({ left: 0, top: 0, behavior: 'smooth' })
    }

    return { activeItem, closeSidebar, handleAfterEnter }
  },
}
</script>

<template>
  <div class="cmw-w-full cmw-bg-white">
    <div class="cmw-shadow cmw-h-[3px]" />
    <div class="cmw-overflow-auto cmw-h-screen">
      <button
        v-for="(item) in menu"
        :key="item.name.toLowerCase().replaceAll(' ', '-')"
        class="cmw-relative cmw-flex cmw-justify-between cmw-items-center cmw-w-full cmw-py-4 cmw-px-2"
        @click="activeItem = item"
      >
        <span class="cmw-uppercase cmw-text-sm cmw-font-light cmw-tracking-wide">{{ item.name }}</span>
        <VueSvgIcon
          :data="require(`@/assets/svg/chevron-right.svg`)"
          width="16"
          height="16"
          color="#d94965"
        />
        <span class="cmw-absolute cmw-w-[calc(100%_-_1rem)] cmw-left-2 cmw-bottom-0 cmw-h-px cmw-bg-gray-light" />
      </button>
    </div>
    <transition name="menu-mobile-second-level" @after-enter="handleAfterEnter">
      <div v-if="!!Object.keys(activeItem).length" class="cmw-fixed cmw-top-0 cmw-left-0 cmw-w-full cmw-z-amenadiel cmw-pt-$cmw-top-banner-height">
        <MenuMobileSecondLayer :menu="activeItem" @close-sidebar="closeSidebar" />
      </div>
    </transition>
  </div>
</template>
