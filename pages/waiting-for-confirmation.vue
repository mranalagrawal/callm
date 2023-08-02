<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { storeToRefs } from 'pinia'
import { useCustomer } from '~/store/customer'

export default defineComponent({
  middleware({ $config, redirect, localeLocation }) {
    if ($config.STORE !== 'B2B')
      return redirect(localeLocation('/login') as unknown as string)
  },
  setup() {
    const { approved } = storeToRefs(useCustomer())

    return { approved }
  },
})
</script>

<template>
  <div class="max-w-screen-xl mx-auto p-4 mt-5">
    <div v-if="!approved">
      {{ $t('waitingForConfirmation.msg') }}
    </div>
    <div v-else v-text="$t('waitingForConfirmation.alreadyApproved')" />
  </div>
</template>
