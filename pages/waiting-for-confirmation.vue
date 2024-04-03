<script lang="ts">
import { computed, defineComponent, useContext } from '@nuxtjs/composition-api'
import { storeToRefs } from 'pinia'

import Alert from '~/components/FeedBack/Alert.vue'
import { useCustomer } from '~/store/customer'

export default defineComponent({
  components: { Alert },
  middleware({ $cmwStore, redirect, localeLocation }) {
    if (!$cmwStore.isB2b) { return redirect(localeLocation('/login') as unknown as string) }
  },
  setup() {
    const { i18n } = useContext()
    const { customer } = storeToRefs(useCustomer())
    const msg = computed(() => customer.value.approved ? i18n.t('waitingForConfirmation.alreadyApproved') : i18n.t('waitingForConfirmation.msg'))

    return { customer, msg }
  },
})
</script>

<template>
  <div class="max-w-screen-sm mx-auto p-4 my-8">
    <Alert severity="info" class="my-8">
      {{ msg }}
    </Alert>
  </div>
</template>
