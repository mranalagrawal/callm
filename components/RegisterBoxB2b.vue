<script lang="ts">
import { defineComponent, ref, useContext, useRouter } from '@nuxtjs/composition-api'
import type { RawLocation } from 'vue-router'
import calendarIcon from '~/assets/svg/calendar.svg'
import { SweetAlertToast } from '~/utilities/Swal'
import { useCustomer } from '~/store/customer'

export default defineComponent({
  setup() {
    const { localeRoute, $gtm, $cmw, $handleApiErrors } = useContext()
    const router = useRouter()
    const customerStore = useCustomer()
    const isSubmitting = ref(false)
    const showPasswordToast = ref(false)

    const handleFocus = () => showPasswordToast.value = true
    const handleBlur = () => showPasswordToast.value = false

    const form = ref({
      firstName: '',
      lastName: '',
      businessName: '',
      vatNumber: '',
      businessType: '',
      phone: '',
      email: '',
      password: '',
      privacy: false,
      acceptsMarketing: false,
    })

    const registrationForm = ref<HTMLFormElement | null>(null)

    const onSubmit = async () => {
      isSubmitting.value = true

      try {
        const { data }: any = await $cmw.$post('/customers/b2b-register', form.value)

        if (data.customer) {
          $gtm.push({
            event: 'siteSubscription',
            userId: data.customer.id,
            userEmail: form.value.email,
          })

          const valid = await customerStore.login(form.value.email, form.value.password)

          if (valid) {
            await customerStore.getCustomer()
            router.push(localeRoute('/') as RawLocation)
          }
        } else {
          throw new Error('`customer` not found in response.data')
        }
      } catch (error: any) {
        if (error.response && error.response.status === 422) {
          // Handle 422 backend validation error
          // backend has same field names so i've removed register-form- prefix
          const backendErrors = error.response.data.errors
          const backendMessage = error.response.data.message
          registrationForm.value?.setErrors(backendErrors) // template ref

          if (backendMessage) {
            await SweetAlertToast.fire({
              icon: 'error',
              text: backendMessage,
            })
          }
        } else {
          // Handle other errors
          $handleApiErrors(`Handle other errors: ${error}`)
        }
      }

      isSubmitting.value = false
    }

    return {
      calendarIcon,
      form,
      handleBlur,
      handleFocus,
      isSubmitting,
      onSubmit,
      registrationForm,
      showPasswordToast,
    }
  },
})
</script>

<template>
  <div>
    <ValidationObserver v-slot="{ handleSubmit }" ref="registrationForm" slim>
      <form @submit.prevent="handleSubmit(onSubmit)">
        <InputField
          v-model="form.firstName" name="register-user-firstname" :label="$t('firstName')"
          :placeholder="$t('firstName')" rules="required" theme="gray"
        />

        <InputField
          v-model="form.lastName" name="register-user-lastname" :label="$t('lastName')"
          :placeholder="$t('lastName')" rules="required" theme="gray"
        />

        <InputField
          v-model="form.email" type="email" name="register-user-email" :label="$t('email')"
          :placeholder="$t('email')" rules="required|email" theme="gray"
        />

        <CmwStrongPassword v-model="form.password" vid="password" theme="gray" :placeholder="$t('passwordPlaceholder')" />

        <InputField
          v-model="form.businessName" name="register-business-name" :label="$t('businessName')"
          :placeholder="$t('businessName')" :rules="{ required: true }" theme="gray"
        />

        <InputField
          v-model="form.vatNumber" name="register-vat-number" :label="$t('vatNumber')"
          :rules="{ required: true, regex: /^(IT)?[0-9]{11}$/i }" :placeholder="$t('vatNumber')" theme="gray"
        />

        <InputField
          v-model="form.businessType" name="register-business-type" :label="$t('businessType')"
          :rules="{ required: true }" :placeholder="$t('businessType')" theme="gray"
        />

        <InputField
          v-model="form.phone" name="register-phone" :label="$t('phone')"
          :rules="{ required: true, regex: /^[0,3]\d{8,9}$/ }" :placeholder="$t('phonePlaceholder')" theme="gray"
        />

        <CmwCheckbox
          id="privacy" v-model="form.privacy" :checked="form.privacy" is-required
          @change="form.privacy = !form.privacy"
        >
          <template #label>
            {{ $t('privacyPolicy') }}
          </template>
        </CmwCheckbox>

        <CmwCheckbox
          id="acceptsMarketing" v-model="form.acceptsMarketing" :checked="form.acceptsMarketing"
          @change="form.acceptsMarketing = !form.acceptsMarketing"
        >
          <template #label>
            {{ $t('acceptMarketing') }}
          </template>
        </CmwCheckbox>

        <CmwButton
          class="sm:max-w-330px mt-8" type="submit"
          :disabled="isSubmitting"
          :label="$t('common.cta.register')"
        />
      </form>
    </ValidationObserver>
  </div>
</template>
