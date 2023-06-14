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
  <div class="max-w-screen-xl mx-auto p-4 mt-5">
    {{ $t('waitingForConfirmation') }}
  </div>
</template>
