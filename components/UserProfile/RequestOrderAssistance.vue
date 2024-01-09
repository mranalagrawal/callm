<script>
import { ref, useContext } from '@nuxtjs/composition-api'
import { storeToRefs } from 'pinia'
import { useSplash } from '~/store/splash'
import { useCustomer } from '@/store/customer'
import { useCustomerOrders } from '~/store/customerOrders.ts'
import { SweetAlertToast } from '~/utilities/Swal'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'RequestOrderAssistance',
  props: {},
  setup() {
    const { $config, $cmwRepo, i18n } = useContext()
    const splash = useSplash()
    const customerOrders = useCustomerOrders()
    const customerStore = useCustomer()
    const { requestOrderAssistanceNumber, requestOrderAssistanceName } = storeToRefs(customerOrders)
    const { customer } = storeToRefs(customerStore)
    const formEl = ref(null)
    const customerMessage = ref('')

    const onSubmit = async () => {
      const { isValid } = await formEl.value.validateWithInfo()

      if (isValid) {
        const { status, message } = await $cmwRepo.orders.requestAssistance({
          message: customerMessage.value,
          order: requestOrderAssistanceName.value || requestOrderAssistanceNumber.value,
          fullname: `${customer.value.firstName} ${customer.value.lastName}`,
          email: customer.value.email,
          store: $config.STORE,
        })

        if (status === 200 && message === 'Ok') {
          splash.$reset()
          SweetAlertToast.fire({
            icon: 'success',
            text: i18n.t('common.feedback.OK.requestAssistance'),
          })
        }
      }
    }

    return { customerMessage, formEl, onSubmit }
  },
}
</script>

<template>
  <ValidationObserver ref="formEl" slim>
    <form
      class="sm:px-4 my-8"
      @submit.prevent="onSubmit"
    >
      <div class="max-w-sm mx-auto">
        <ValidationProvider
          v-slot="{ errors }"
          vid="message"
          rules="required|min:10"
          name="message"
          slim
        >
          <div class="relative">
            <textarea
              id="message"
              v-model="customerMessage"
              :placeholder="$t('profile.messagePlaceholder')"
              rows="4"
              class="
              peer px-4 text-gray-dark py-3 w-full bg-transparent border border-gray-light
              rounded transition-colors
              hover:(border-gray)
              focus:(outline-none border-gray-dark placeholder-gray-light)
              autofill:(text-body border-info text-base)
              disabled:(border-gray-light/70 cursor-not-allowed)
"
              :class="customerMessage ? 'placeholder-gray-light' : 'placeholder-transparent'"
            />
            <label
              for="message"
              class="absolute m-0 left-4 transition-all select-none pointer-events-none truncate
               peer-focus:(text-[0.775rem] px-2 top-[-0.4rem] bg-white w-auto)
               peer-disabled:(text-gray-light/70) peer-focus:bg-white -bg-white"
              :class="[
                customerMessage ? `text-[0.775rem] px-2 top-[-0.4rem] bg-white w-auto` : 'top-[0.75rem] w-full pr-8',
                !!errors.length ? 'text-error' : customerMessage ? 'text-secondary-800' : 'text-gray',
              ]"
            >{{ $t('profile.message') }}</label>
          </div>
          <span v-if="!!errors.length" class="block text-sm text-error">{{ errors[0] }}</span>
        </validationprovider>
        <!-- Todo: Implement upload file plugin, this one is good https://github.com/lian-yue/vue-upload-component -->
      </div>
      <div class="text-center mt-8 max-w-1/3 mx-auto">
        <CmwButton :label="$t('common.cta.send')" type="submit" />
      </div>
    </form>
  </ValidationObserver>
</template>

<style scoped>
textarea::-webkit-resizer {
  background-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIGlkPSJhbyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgNjQgNjQiPjxwYXRoIGQ9Im01Ni40Myw3LjU3Yy43Mi43MS43NiwxLjg1LjE0LDIuNjFsLS4xNC4xNUwxMC4zMyw1Ni40M2MtLjM1LjM1LS44NC41Ni0xLjM3LjU2aDBjLTEuMDgsMC0xLjk1LS44OC0xLjk1LTEuOTVoMGMwLS40Ny4xNi0uODkuNDQtMS4yM2gwczAsMCwwLDBsLjEzLS4xNUw1My42Nyw3LjU3Yy4zNS0uMzUuODQtLjU3LDEuMzgtLjU3czEuMDMuMjIsMS4zOC41N2gwWm0wLDMwLjU2Yy4zNS4zNS41Ny44NC41NywxLjM3aDBjMCwuNDctLjE3LjktLjQ0LDEuMjRoMHMtLjEzLjE0LS4xMy4xNGwtMTUuNTYsMTUuNTZjLS4zNS4zNS0uODQuNTctMS4zOC41N2gwYy0xLjA4LDAtMS45NC0uODctMS45NC0xLjk0aDBjMC0uNDcuMTctLjkuNDQtMS4yNGgwczAsMCwwLDBsLjEzLS4xNSwxNS41Ni0xNS41NmMuMzUtLjM1Ljg0LS41NywxLjM4LS41N3MxLjAyLjIyLDEuMzguNTdoMFoiLz48L3N2Zz4=");
  background-size: 12px;
  background-position: center;
  background-repeat: no-repeat;
}
</style>
