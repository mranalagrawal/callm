<script>
import { ref, toRefs, useContext } from '@nuxtjs/composition-api'
import { storeToRefs } from 'pinia'
import { useSplash } from '@/store/splash'
import { useCustomer } from '@/store/customer'
// noinspection JSUnusedGlobalSymbols
export default {
  name: 'UpdateCustomerEmail',
  props: {},
  setup() {
    const { i18n } = useContext()
    const splash = useSplash()
    const customerStore = useCustomer()
    const { editingCustomer } = storeToRefs(customerStore)
    const formEl = ref(null)

    const { email } = toRefs(editingCustomer.value)
    const onSubmit = async () => {
      const { isValid } = await formEl.value.validateWithInfo()

      if (isValid) {
        await customerStore.customerUpdateData({
          email: email.value,
        },
        i18n.t('common.feedback.OK.customerUpdateEmail'),
        i18n.t('common.feedback.KO.customerUpdateEmail'))
          .then(() => splash.$reset())
      }
    }

    return { email, formEl, onSubmit }
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
        <InputField
          v-model="email"
          name="customer-edit-email"
          :label="$t('email').toString()"
          :placeholder="$t('emailPlaceholder')"
          rules="required|email"
        />
      </div>
      <div class="text-center mt-8 max-w-sm mx-auto">
        <Button :label="$t('common.cta.confirm').toString()" type="submit" />
      </div>
    </form>
  </ValidationObserver>
</template>
