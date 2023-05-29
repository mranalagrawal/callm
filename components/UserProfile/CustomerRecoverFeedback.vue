<script lang="ts">
import { defineComponent, ref } from '@nuxtjs/composition-api'
import { storeToRefs } from 'pinia'
import { useSplash } from '~/store/splash'
import emailSentIcon from '~/assets/svg/email-sent.svg'

export default defineComponent({
  name: 'CustomerRecoverFeedback',
  setup() {
    const splash = useSplash()
    const { localData } = storeToRefs(splash)

    const customerMessage = ref('')

    return { splash, localData, customerMessage, emailSentIcon }
  },
})
</script>

<template>
  <div class="cmw-max-w-md cmw-mx-auto cmw-text-center">
    <div class="cmw-mx-auto">
      <VueSvgIcon :data="emailSentIcon" width="90" height="auto" original />
    </div>
    <i18n
      path="recoverPwd.feedback"
      tag="p"
    >
      <strong
        class="cmw-font-sans cmw-text-body cmw-tracking-normal"
        v-text="localData"
      />
    </i18n>
    <hr>
    <i18n
      path="recoverPwd.feedbackFooter.text"
      tag="p"
    >
      <button
        class="cmw-font-sans cmw-text-primary-400 cmw-tracking-normal"
        @click="splash.$reset()"
        v-text="$t('recoverPwd.feedbackFooter.link')"
      />
    </i18n>
  </div>
</template>
