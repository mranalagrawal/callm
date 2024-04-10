<script lang="ts">
import { defineComponent, onMounted, ref, useContext } from '@nuxtjs/composition-api'

import { useSplash } from '~/store/splash'

import GqlCustomerRecover from '~/graphql/mutations/customerRecover.graphql'
import { SweetAlertToast } from '~/utilities/Swal'

export default defineComponent({
  setup() {
    const { $graphql, $sentry, i18n, $cmwGtmUtils } = useContext()
    const splash = useSplash()
    const isSubmitting = ref(false)
    const form = ref({
      email: '',
    })

    const onSubmit = async () => {
      isSubmitting.value = true

      await $graphql.default.request(GqlCustomerRecover, {
        lang: i18n.locale.toUpperCase(),
        email: form.value.email,
      })
        .then(({ customerRecover }) => {
          if (customerRecover && !customerRecover.customerUserErrors.length) {
            splash.$patch({
              currentSplash: 'CustomerRecoverFeedback',
              size: 'lg',
              localData: form.value.email,
            })
          } else {
            SweetAlertToast.fire({
              icon: 'error',
              text: customerRecover.customerUserErrors[0].message,
            })
          }
        })
        .catch((err) => {
          $sentry.captureException(new Error(`Catch resetting customer password: ${err}`))
          SweetAlertToast.fire({
            icon: 'error',
            text: i18n.t('common.feedback.KO.unknown'),
          })
        })

      isSubmitting.value = false
    }

    onMounted(() => {
      process.browser && $cmwGtmUtils.pushPage('page')
    })

    return { form, isSubmitting, onSubmit }
  },
})
</script>

<template>
  <div class="grid grid-cols-[minmax(auto,_640px)] justify-center justify-items-center my-20 px-4">
    <div class="h3 mb-8" v-text="$t('recoverPwd.title')" />
    <div class="text-center" v-text="$t('recoverPwd.paragraph')" />
    <ValidationObserver
      v-slot="{ handleSubmit, valid }"
      slim
    >
      <form class="w-full md:w-2/4" @submit.prevent="handleSubmit(onSubmit)">
        <InputField
          v-model="form.email"
          type="email"
          name="register-user-email" :label="$t('email')"
          :placeholder="$t('email')" rules="required|email" theme="gray"
        />

        <CmwButton
          class="my-8"
          type="submit"
          :disabled="!form.email || !valid"
          :label="$t('common.cta.send')"
        />
      </form>
    </ValidationObserver>
    <p class="text-center">
      {{ $t("navbar.user.notRegisteredYet") }}
      <CmwButton variant="text" class="w-max inline-block" :to="localePath('/register')">
        <strong class="text-primary-400 uppercase" v-text="$t('common.cta.register')" />
      </CmwButton>
    </p>
    <p class="text-center">
      {{ $t('navbar.user.alreadyRegistered') }}
      <CmwButton variant="text" class="w-max inline-block" :to="localePath('/login')">
        <strong class="text-primary-400 uppercase" v-text="$t('common.cta.signIn')" />
      </CmwButton>
    </p>
  </div>
</template>
