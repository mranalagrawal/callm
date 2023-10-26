<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { useCustomerOrders } from '~/store/customerOrders'
import { useSplash } from '~/store/splash'

export default defineComponent({
  setup() {
    const customerOrders = useCustomerOrders()
    const splash = useSplash()
    const handleSuccess = async () => {
      await customerOrders.getOrders('processed_at:>2010-01-01')
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
