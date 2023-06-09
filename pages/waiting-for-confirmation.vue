<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  layout({ $config }) {
    return $config.STORE
  },
  middleware({ $config, redirect }) {
    if ($config.STORE !== 'B2B')
      return redirect('/login')
  },
})
</script>

<template>
  <div class="cmw-max-w-screen-xl cmw-mx-auto cmw-p-4 cmw-mt-5">
    {{ $t('waitingForConfirmation') }}
  </div>
</template>
