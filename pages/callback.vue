<script lang="ts">
import {
  defineComponent,
  ref,
  useContext,
  useFetch,
  useRouter,
} from '@nuxtjs/composition-api'
import type { RawLocation } from 'vue-router'
import Loader from '~/components/UI/Loader.vue'
import { useCustomer } from '~/store/customer'

export default defineComponent({
  components: { Loader },
  fetchOnServer: false,
  middleware({ route, localeLocation, redirect, $config }) {
    // Talk to Valerio how to handle this edge case, it seems appropriate to me to redirect to the login page
    if ($config.STORE === 'B2B' || !route.query?.cmw_api_token) { return redirect(localeLocation('/login') as unknown as string) }
  },
  setup() {
    const { localeLocation, $handleApiErrors } = useContext()
    const customerStore = useCustomer()
    const router = useRouter()
    const valid = ref(false)

    useFetch(async ({ $route }) => {
      valid.value = await customerStore.loginWithMultipass($route.query.cmw_api_token as string)
      if (valid.value) {
        await customerStore.getCustomer('login')
          .then(() => router.push(localeLocation('/profile/my-orders') as RawLocation))
          .catch(e => $handleApiErrors(`Error while fetching customer data: ${e}`))
      }
    })

    return {
      valid,
    }
  },
})
</script>

<template>
  <Loader />
</template>
