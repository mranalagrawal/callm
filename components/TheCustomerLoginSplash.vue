<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { useCart } from '~/store/cart'
import { useCustomerOrders } from '~/store/customerOrders'
import { useSplash } from '~/store/splash'

export default defineComponent({
  setup() {
    const customerOrders = useCustomerOrders()
    const { getInitialCart } = useCart()
    const splash = useSplash()
    const handleSuccess = async () => {
      await customerOrders.getOrders('processed_at:>2010-01-01')
      await getInitialCart()
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
