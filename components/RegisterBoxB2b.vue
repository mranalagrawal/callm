<script lang="ts">
import { defineComponent, ref, useContext, useRouter } from '@nuxtjs/composition-api'
import type { RawLocation } from 'vue-router'
import calendarIcon from '~/assets/svg/calendar.svg'
import { SweetAlertToast } from '~/utilities/Swal'
import { useCustomer } from '~/store/customer'

export default defineComponent({
  setup() {
    const { localeLocation, $gtm, $cmw, $handleApiErrors, $config } = useContext()
    const router = useRouter()
    const customerStore = useCustomer()
    const isSubmitting = ref(false)
    const showPasswordToast = ref(false)

    const handleFocus = () => showPasswordToast.value = true
    const handleBlur = () => showPasswordToast.value = false
    const isCmwItB2b = $config.STORE === 'B2B'

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

    // used in for ref= template in ValidationObserver
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
            router.push(localeLocation('/profile/my-orders') as RawLocation)
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
      isCmwItB2b,
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
      <form class="px-4 pt-3 py-2 md:w-3/4 mx-auto" @submit.prevent="handleSubmit(onSubmit)">
        <InputField
          v-model="form.firstName" name="firstName" :label="$t('firstName')"
          :placeholder="$t('firstName')" rules="required" theme="gray"
        />

        <InputField
          v-model="form.lastName" name="lastName" :label="$t('lastName')"
          :placeholder="$t('lastName')" rules="required" theme="gray"
        />

        <InputField
          v-model="form.email" type="email" name="email" :label="$t('email')"
          :placeholder="$t('email')" rules="required|email" theme="gray"
        />

        <CmwStrongPassword v-model="form.password" vid="password" theme="gray" :placeholder="$t('passwordPlaceholder')" />

        <InputField
          v-model="form.businessName" name="businessName" :label="$t('businessName')"
          :placeholder="$t('businessName')" :rules="{ required: true }" theme="gray"
        />

        <InputField
          v-model="form.vatNumber" name="vatNumber" :label="$t('vatNumber')"
          :rules="{ required: true, regex: /^(IT)?[0-9]{11}$/i }" :placeholder="$t('vatNumber')" theme="gray"
        />

        <InputField
          v-model="form.businessType" name="businessType" :label="$t('businessType')"
          :rules="{ required: true }" :placeholder="$t('businessType')" theme="gray"
        />

        <InputField
          v-model="form.phone" name="phone" :label="$t('phone')"
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
          :label="$t('navbar.user.register')"
        />
      </form>
    </ValidationObserver>
  </div>
</template>
