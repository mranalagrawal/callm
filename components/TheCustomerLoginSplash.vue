<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { useSplash } from '~/store/splash'

export default defineComponent({
  setup() {
    const splash = useSplash()
    const handleSuccess = () => {
      splash.$reset()
    }
    return { handleSuccess }
  },
})
</script>

<template>
  <div>
    <LoginForm skip-redirect @login-success="handleSuccess" />
  </div>
</template>
