<script lang="ts">
import { ref, useContext, useRouter } from '@nuxtjs/composition-api'
import type { RawLocation } from 'vue-router'
import calendarIcon from '~/assets/svg/calendar.svg'
import GqlCustomerCreate from '~/graphql/mutations/customerCreate.graphql'
import { SweetAlertToast } from '~/utilities/Swal'
import { useCustomer } from '~/store/customer'

export default {
  setup() {
    const { $graphql, i18n, localeLocation } = useContext()
    const router = useRouter()
    const customerStore = useCustomer()
    const isSubmitting = ref(false)
    const showPasswordToast = ref(false)
    const now = new Date()

    const handleFocus = () => showPasswordToast.value = true
    const handleBlur = () => showPasswordToast.value = false

    const form = ref({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      privacy: false,
      acceptsMarketing: false,
      age: '',
    })

    const onSubmit = async () => {
      isSubmitting.value = true

      // eslint-disable-next-line unused-imports/no-unused-vars
      const { age, privacy, ...input } = form.value
      const { customerCreate: { customerUserErrors } } = await $graphql.default.request(GqlCustomerCreate, {
        lang: i18n.locale.toUpperCase(),
        input,
      })

      if (!customerUserErrors.length) {
        // Handle success
        // Todo: Call API to save customer birthday
        const valid = await customerStore.login(form.value.email, form.value.password)

        if (valid) {
          await customerStore.getCustomer('register')
            .then(() => router.push(localeLocation('/profile/my-orders') as RawLocation))
        }
      } else {
        await SweetAlertToast.fire({
          icon: 'error',
          text: customerUserErrors[0].message,
        })
      }
      isSubmitting.value = false
    }

    return {
      now,
      isSubmitting,
      form,
      showPasswordToast,
      calendarIcon,
      handleFocus,
      handleBlur,
      onSubmit,
    }
  },
}
</script>

<template>
  <div>
    <ValidationObserver v-slot="{ handleSubmit }" slim>
      <form class="px-4 pt-3 py-2 w-75 mx-auto" @submit.prevent="handleSubmit(onSubmit)">
        <InputField
          v-model="form.firstName"
          name="register-user-firstname" :label="$t('firstName').toString()"
          :placeholder="$t('firstName').toString()" rules="required" theme="gray"
        />

        <InputField
          v-model="form.lastName"
          name="register-user-lastname" :label="$t('lastName').toString()"
          :placeholder="$t('lastName').toString()" rules="required" theme="gray"
        />

        <InputField
          v-model="form.email"
          type="email"
          name="register-user-email" :label="$t('email').toString()"
          :placeholder="$t('email').toString()" rules="required|email" theme="gray"
        />

        <CmwStrongPassword v-model="form.password" theme="gray" :placeholder="$t('passwordPlaceholder').toString()" />

        <InputField
          v-model="form.age"
          type="date"
          name="register-user-age" :label="$t('birthday').toString()"
          placeholder="dd/mm/yyyy" rules="required"
          theme="gray"
        />

        <p
          v-if="new Date(now) - new Date(form.age) < 568036800000"
          class="text-danger font-weight-bold small mt-2"
        >
          Devi essere maggiorenne per poterti registrare al sito.
        </p>

        <CmwCheckbox
          id="privacy" v-model="form.privacy"
          :checked="form.privacy" is-required @change="form.privacy = !form.privacy"
        >
          <template #label>
            {{ $t('privacyPolicy') }}
          </template>
        </CmwCheckbox>

        <CmwCheckbox
          id="acceptsMarketing" v-model="form.acceptsMarketing"
          :checked="form.acceptsMarketing" @change="form.acceptsMarketing = !form.acceptsMarketing"
        >
          <template #label>
            {{ $t('acceptMarketing') }}
          </template>
        </CmwCheckbox>

        <Button
          class="sm:cmw-max-w-330px cmw-mt-8"
          type="submit"
          :disabled="isSubmitting || !(new Date(now) - new Date(form.age) > 568036800000)"
          :label="$t('navbar.user.register').toString()"
        />
      </form>
    </ValidationObserver>
  </div>
</template>
