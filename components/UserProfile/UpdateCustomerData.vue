<script>
import { ref, toRefs, useContext } from '@nuxtjs/composition-api'
import { storeToRefs } from 'pinia'
import { useSplash } from '@/store/splash'
import { useCustomer } from '@/store/customer'
// noinspection JSUnusedGlobalSymbols
export default {
  name: 'UpdateCustomerData',
  props: {},
  setup() {
    const { i18n } = useContext()
    const splash = useSplash()
    const customerStore = useCustomer()
    const { editingCustomer } = storeToRefs(customerStore)
    const formEl = ref(null)

    const { acceptsMarketing, firstName, lastName, phone } = toRefs(editingCustomer.value)

    const onSubmit = async () => {
      const { isValid } = await formEl.value.validateWithInfo()

      if (isValid) {
        await customerStore.customerUpdateData({
          acceptsMarketing: acceptsMarketing.value,
          firstName: firstName.value,
          lastName: lastName.value,
          phone: phone.value ? phone.value : null,
        },
        i18n.t('common.feedback.OK.customerUpdateData'),
        i18n.t('common.feedback.KO.customerUpdateData'))
          .then(() => splash.$reset())
      }
    }

    return { acceptsMarketing, firstName, lastName, phone, formEl, onSubmit }
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
        <InputField
          v-model="firstName"
          name="customer-edit-firstname"
          :label="$t('firstName').toString()"
          :placeholder="$t('firstName').toString()"
          rules="required"
        />
        <InputField
          v-model="lastName"
          name="customer-edit-lastname"
          :label="$t('firstName').toString()"
          :placeholder="$t('firstName').toString()"
          rules="required"
        />
        <InputField
          v-model="phone"
          name="customer-edit-phone"
          :label="$t('phone').toString()"
          :placeholder="$t('phonePlaceholder').toString()"
          :rules="{ required: !!phone, max: 13, min: 9, regex: /^[+]\d{8,13}$/ }"
        />
        <div>
          <CmwCheckbox id="newsletter" v-model="acceptsMarketing" :checked="acceptsMarketing" @change="acceptsMarketing = !acceptsMarketing">
            <template #label>
              {{ $t('newsletter.headline') }}
            </template>
          </CmwCheckbox>
        </div>
      </div>
      <div class="cmw-text-center cmw-mt-8 cmw-max-w-sm cmw-mx-auto">
        <Button :label="$t('common.cta.confirm').toString()" type="submit" />
      </div>
    </form>
  </ValidationObserver>
</template>
