<script lang="ts">
import { storeToRefs } from 'pinia'
import closeIcon from 'assets/svg/close.svg'
import { defineComponent, ref, watchEffect } from '@nuxtjs/composition-api'
import { useSplash } from '@/store/splash'
import ProductRequestNotification from '~/components/ProductBox/ProductRequestNotification.vue'
import CreateUserAddress from '~/components/UserProfile/CreateUserAddress.vue'
import CustomerRecoverFeedback from '~/components/UserProfile/CustomerRecoverFeedback.vue'
import EditCustomerAddress from '~/components/UserProfile/EditCustomerAddress.vue'
import RequestOrderAssistance from '~/components/UserProfile/RequestOrderAssistance.vue'
import UpdateCustomerData from '~/components/UserProfile/UpdateCustomerData.vue'
import UpdateCustomerEmail from '~/components/UserProfile/UpdateCustomerEmail.vue'
import UpdateCustomerPassword from '~/components/UserProfile/UpdateCustomerPassword.vue'
import TheNewsletterSplash from '~/components/TheNewsletterSplash.vue'

export default defineComponent({
  name: 'CmwSplash',
  components: {
    EditCustomerAddress,
    CreateUserAddress,
    UpdateCustomerData,
    UpdateCustomerEmail,
    UpdateCustomerPassword,
    ProductRequestNotification,
    TheNewsletterSplash,
  },
  setup() {
    const splash = useSplash()
    const { currentSplash, title, subtitle, size } = storeToRefs(splash)

    const showBody = ref(false)
    const closeModal = () => {
      if (typeof splash.onBeforeCloseModal === 'function' && splash.onBeforeCloseModal !== (() => {}))
        splash.onBeforeCloseModal()

      showBody.value = false
    }
    const handleAfterEnter = () => {
      showBody.value = true
    }
    const handleAfterLeave = () => {
      splash.$reset()
    }

    // Note: for now we need to import all modals, on Nuxt3 we can use resolveComponent function to handle this
    const lookUp = (key: string) => ({
      EditCustomerAddress,
      CustomerRecoverFeedback,
      CreateUserAddress,
      RequestOrderAssistance,
      UpdateCustomerData,
      UpdateCustomerEmail,
      UpdateCustomerPassword,
      ProductRequestNotification,
      TheNewsletterSplash,
    })[key]

    watchEffect(() => {
      if (process.browser && document.body)
        document.body.classList.toggle('lock-scroll', !!currentSplash.value)
    })
    return { currentSplash, title, subtitle, size, showBody, closeModal, handleAfterEnter, handleAfterLeave, lookUp, closeIcon }
  },
})
</script>

<template>
  <transition name="fade" @after-enter="handleAfterEnter">
    <div v-if="currentSplash" class="cmw-fixed cmw-top-0 cmw-left-0 cmw-w-screen cmw-h-screen cmw-bg-black/50 cmw-z-amenadiel" @click.self="closeModal">
      <transition
        name="fadeFromBottom"
        mode="out-in"
        @after-leave="handleAfterLeave"
      >
        <div
          v-show="showBody"
          class="c-splash__content cmw-overflow-y-auto cmw-bg-white cmw-center-the-unknown cmw-p-4 cmw-h-screen sm:(cmw-rounded cmw-h-auto)"
          :class="size"
        >
          <!-- splash-header -->
          <div class="cmw-relative">
            <div v-if="title" class="cmw-text-center cmw-h3 cmw-pt-4" v-text="title" />
            <div v-if="subtitle" class="cmw-text-center cmw-my-2 cmw-max-w-3/4 cmw-mx-auto" v-text="subtitle" />
            <div class="cmw-absolute cmw-top-0 cmw-right-0">
              <ButtonIcon :icon="closeIcon" variant="icon" :size="18" @click.native="closeModal" />
            </div>
          </div>
          <!-- splash-body -->
          <div>
            <component :is="lookUp(currentSplash)" />
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<style scoped>
.c-splash__content {
  --splash-max-w: 32rem;
  width: min(100%, var(--splash-max-w));
  margin-inline: auto;
}

.c-splash__content.lg {
  --splash-max-w: 48rem;
}
</style>
