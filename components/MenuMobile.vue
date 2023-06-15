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
  <div class="w-full bg-white">
    <div class="shadow h-[3px]" />
    <div class="overflow-auto h-screen">
      <button
        v-for="(item) in menu"
        :key="item.name.toLowerCase().replaceAll(' ', '-')"
        class="relative flex justify-between items-center w-full py-4 px-2"
        @click="activeItem = item"
      >
        <span class="uppercase text-sm font-light tracking-wide">{{ item.name }}</span>
        <VueSvgIcon
          :data="require(`@/assets/svg/chevron-right.svg`)"
          width="16"
          height="16"
          color="#d94965"
        />
        <span class="absolute w-[calc(100%_-_1rem)] left-2 bottom-0 h-px bg-gray-light" />
      </button>
    </div>
    <transition name="menu-mobile-second-level" @after-enter="handleAfterEnter">
      <div v-if="!!Object.keys(activeItem).length" class="fixed top-0 left-0 w-full z-amenadiel pt-$top-banner-height">
        <MenuMobileSecondLayer :menu="activeItem" @close-sidebar="closeSidebar" />
      </div>
    </transition>
  </div>
</template>
