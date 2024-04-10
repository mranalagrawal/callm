<script lang="ts">
import { defineComponent, ref } from '@nuxtjs/composition-api'
import { storeToRefs } from 'pinia'

import { useSplash } from '~/store/splash'

import closeIcon from '~/assets/svg/close.svg'

export default defineComponent({
  name: 'CmwSplash',
  setup() {
    const splash = useSplash()
    const { currentSplash, title, subtitle, size } = storeToRefs(splash)

    const showBody = ref(false)
    const closeModal = () => {
      if (typeof splash.onBeforeCloseModal === 'function' && splash.onBeforeCloseModal !== (() => {})) { splash.onBeforeCloseModal() }

      showBody.value = false
    }
    const handleAfterEnter = () => {
      showBody.value = true
    }
    const handleAfterLeave = () => {
      splash.$reset()
    }

    const componentMap = {
      EditCustomerAddress: () => import('~/components/UserProfile/EditCustomerAddress.vue'),
      CustomerRecoverFeedback: () => import('~/components/UserProfile/CustomerRecoverFeedback.vue'),
      CreateUserAddress: () => import('~/components/UserProfile/CreateUserAddress.vue'),
      RequestOrderAssistance: () => import('~/components/UserProfile/RequestOrderAssistance.vue'),
      UpdateCustomerData: () => import('~/components/UserProfile/UpdateCustomerData.vue'),
      UpdateCustomerEmail: () => import('~/components/UserProfile/UpdateCustomerEmail.vue'),
      UpdateCustomerPassword: () => import('~/components/UserProfile/UpdateCustomerPassword.vue'),
      ProductRequestNotification: () => import('~/components/ProductBox/ProductRequestNotification.vue'),
      TheCustomerLoginSplash: () => import('~/components/TheCustomerLoginSplash.vue'),
      TheNewsletterSplash: () => import('~/components/TheNewsletterSplash.vue'),
      ProductLowestPriceTooltip: () => import('~/components/ProductBox/ProductLowestPriceTooltip.vue'),
    }

    /* watchEffect(() => {
      if (process.browser && document.body) { document.body.classList.toggle('lock-scroll', !!currentSplash.value) }
    }) */

    return {
      currentSplash,
      title,
      subtitle,
      size,
      showBody,
      closeModal,
      handleAfterEnter,
      handleAfterLeave,
      componentMap,
      closeIcon,
    }
  },
})
</script>

<template>
  <transition name="fade" @after-enter="handleAfterEnter">
    <div
      v-if="currentSplash" class="fixed top-0 left-0 w-screen h-screen bg-black/50 z-amenadiel js-close-cmw-splash"
      @click.self="closeModal"
    >
      <transition
        name="fadeFromBottom"
        mode="out-in"
        @after-leave="handleAfterLeave"
      >
        <div
          v-show="showBody"
          class="c-splash__content overflow-y-auto bg-white center-the-unknown p-4 h-screen sm:(rounded h-auto)"
          :class="size"
        >
          <!-- splash-header -->
          <div class="relative">
            <div v-if="title" class="text-center h3 pt-4" v-text="title" />
            <div v-if="subtitle" class="text-center my-2 max-w-3/4 mx-auto" v-text="subtitle" />
            <div class="absolute top-0 right-0">
              <ButtonIcon class="js-close-cmw-splash" :icon="closeIcon" variant="icon" size="18" @click.native="closeModal" />
            </div>
          </div>
          <!-- splash-body -->
          <div>
            <component :is="componentMap[currentSplash]" v-if="componentMap[currentSplash]" />
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<style scoped>
.c-splash__content {
  width: min(100%, var(--splash-max-w));
  margin-inline: auto;
}

.c-splash__content.lg {
  --splash-max-w: 48rem;
}
</style>
