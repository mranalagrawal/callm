<script>
import { ref, useContext } from '@nuxtjs/composition-api'
import { storeToRefs } from 'pinia'
import { useSplash } from '@/store/splash'
import { useCustomer } from '@/store/customer'
import { useCustomerOrders } from '~/store/customerOrders'
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
    const { requestOrderAssistanceNumber } = storeToRefs(customerOrders)
    const { customer } = storeToRefs(customerStore)
    const formEl = ref(null)
    const customerMessage = ref('')

    const onSubmit = async () => {
      const { isValid } = await formEl.value.validateWithInfo()

      if (isValid) {
        const { status, message } = await $cmwRepo.orders.requestAssistance({
          message: customerMessage.value,
          order: requestOrderAssistanceNumber.value,
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
      class="sm:cmw-px-4 cmw-my-8"
      @submit.prevent="onSubmit"
    >
      <div class="cmw-max-w-sm cmw-mx-auto">
        <ValidationProvider
          v-slot="{ errors }"
          vid="message"
          rules="required|min:10"
          name="message"
          slim
        >
          <div class="cmw-relative">
            <textarea
              id="message"
              v-model="customerMessage"
              :placeholder="$t('profile.messagePlaceholder')"
              rows="4"
              class="
              peer cmw-px-4 cmw-text-gray-dark cmw-py-3 cmw-w-full cmw-bg-transparent cmw-border cmw-border-gray-light
              cmw-rounded cmw-transition-colors
              hover:(cmw-border-gray)
              focus:(cmw-outline-none cmw-border-gray-dark cmw-placeholder-gray-light)
              autofill:(cmw-text-body cmw-border-info cmw-text-base)
              disabled:(cmw-border-gray-light/70 cmw-cursor-not-allowed)
"
              :class="customerMessage ? 'cmw-placeholder-gray-light' : 'cmw-placeholder-transparent'"
            />
            <label
              for="message"
              class="cmw-absolute cmw-m-0 cmw-left-4 cmw-transition-all cmw-select-none cmw-pointer-events-none cmw-truncate
               peer-focus:(cmw-text-[0.775rem] cmw-px-2 cmw-top-[-0.4rem] cmw-bg-white cmw-w-auto)
               peer-disabled:(cmw-text-gray-light/70) peer-focus:cmw-bg-white -cmw-bg-white"
              :class="[
                customerMessage ? `cmw-text-[0.775rem] cmw-px-2 cmw-top-[-0.4rem] cmw-bg-white cmw-w-auto` : 'cmw-top-[0.75rem] cmw-w-full cmw-pr-8',
                !!errors.length ? 'cmw-text-error' : customerMessage ? 'cmw-text-secondary-800' : 'cmw-text-gray',
              ]"
            >{{ $t('profile.message') }}</label>
          </div>
          <span v-if="!!errors.length" class="cmw-block cmw-text-sm cmw-text-error">{{ errors[0] }}</span>
        </validationprovider>
        <!-- Todo: Implement upload file plugin, this one is good https://github.com/lian-yue/vue-upload-component -->
      </div>
      <div class="cmw-text-center cmw-mt-8 cmw-max-w-1/3 cmw-mx-auto">
        <Button :label="$t('common.cta.send').toString()" type="submit" />
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
