<script>
import { ref, toRefs, useContext } from '@nuxtjs/composition-api'
import { storeToRefs } from 'pinia'
import { useSplash } from '@/store/splash'
import { useCustomer } from '@/store/customer'
import eyeShowIcon from '~/assets/svg/eye-show.svg'
import eyeHideIcon from '~/assets/svg/eye-hide.svg'
// noinspection JSUnusedGlobalSymbols
export default {
  name: 'UpdateCustomerPassword',
  props: {},
  setup() {
    const { i18n } = useContext()
    const splash = useSplash()
    const customerStore = useCustomer()
    const { editingCustomer } = storeToRefs(customerStore)
    const formEl = ref(null)
    const confirmPassword = ref('')
    const passwordIsVisible = ref(false)

    const { password } = toRefs(editingCustomer.value)
    const onSubmit = async () => {
      const { isValid } = await formEl.value.validateWithInfo()

      if (isValid) {
        await customerStore.customerUpdateData({
          password: password.value,
        },
        i18n.t('common.feedback.OK.customerUpdatePassword'),
        i18n.t('common.feedback.KO.customerUpdatePassword'))
          .then(() => splash.$reset())
      }
    }

    return { password, formEl, confirmPassword, passwordIsVisible, eyeShowIcon, eyeHideIcon, onSubmit }
  },
}
</script>

<template>
  <ValidationObserver ref="formEl" slim>
    <!-- Note: On the invision there's an old-password field, to implement this we could:
    call customerAccessTokenCreate again, then customerUpdate, but this can be tedious and redundant
      since the user should be login anyhow and I think is better the way it is right now on production (without this old-password field) -->
    <form
      class="sm:cmw-px-4 cmw-my-8"
      @submit.prevent="onSubmit"
    >
      <div class="cmw-max-w-sm cmw-mx-auto cmw-mt-20 cmw-min-h-[30vh]">
        <CmwStrongPassword v-model="password" autocomplete="new-password" :placeholder="$t('passwordPlaceholder').toString()" />
        <InputField
          v-model="confirmPassword"
          :type="!passwordIsVisible ? 'password' : 'text'"
          name="customer-edit-password"
          :label="$t('passwordConfirm').toString()"
          autocomplete="new-password"
          :placeholder="$t('passwordConfirmPlaceholder').toString()"
          rules="required|confirmed:new-password"
          :icon="passwordIsVisible ? eyeHideIcon : eyeShowIcon"
          :click-icon="() => passwordIsVisible = !passwordIsVisible"
        />
      </div>
      <div class="cmw-text-center cmw-mt-8 cmw-max-w-sm cmw-mx-auto">
        <Button :label="$t('common.cta.confirm').toString()" type="submit" />
      </div>
    </form>
  </ValidationObserver>
</template>