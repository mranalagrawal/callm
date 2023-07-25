<script>
import { storeToRefs } from 'pinia'
import { defineComponent, ref, useContext, useRouter } from '@nuxtjs/composition-api'
import eyeShowIcon from '~/assets/svg/eye-show.svg'
import eyeHideIcon from '~/assets/svg/eye-hide.svg'
import { useCustomer } from '~/store/customer'
import Alert from '~/components/FeedBack/Alert.vue'

export default defineComponent({
  components: { Alert },
  props: {
    skipRedirect: { type: Boolean },
  },
  emits: ['login-success'],
  setup(props, { emit }) {
    const { i18n, localeLocation } = useContext()
    const router = useRouter()
    const customerStore = useCustomer()
    const { customer } = storeToRefs(customerStore)
    const isSubmitting = ref(false)
    const passwordIsVisible = ref(false)
    const message = ref('')
    const form = ref({
      email: '',
      password: '',
    })
    const onSubmit = async () => {
      isSubmitting.value = true

      const valid = await customerStore.login(form.value.email, form.value.password)

      if (valid) {
        await customerStore.getCustomer('login')
          .then(async () => {
            emit('login-success', true)
            !props.skipRedirect && router.push(localeLocation('/profile/my-orders'))
          })
      } else {
        message.value = i18n.t('common.feedback.KO.login')
      }
      isSubmitting.value = false
    }

    return { customerStore, customer, form, passwordIsVisible, isSubmitting, eyeShowIcon, eyeHideIcon, message, onSubmit }
  },
})
</script>

<template>
  <ValidationObserver
    v-slot="{ handleSubmit }"
    slim
  >
    <form
      class="px-4 pt-3 pb-2 md:w-3/4 mx-auto"
      @submit.prevent="handleSubmit(onSubmit)"
    >
      <InputField
        v-model="form.email"
        type="email"
        name="user-email"
        :label="$t('email')"
        :placeholder="$t('emailPlaceholder')"
        rules="required|email"
      />

      <InputField
        v-model="form.password"
        :type="!passwordIsVisible ? 'password' : 'text'"
        name="user-password"
        :label="$t('password')"
        :placeholder="$t('passwordPlaceholder')"
        rules="required|min:4"
        :icon="passwordIsVisible ? eyeHideIcon : eyeShowIcon"
        :click-icon="() => passwordIsVisible = !passwordIsVisible"
      />

      <Alert
        v-if="message"
        severity="error"
      >
        {{ message }}
      </Alert>

      <Button
        class="sm:max-w-330px mt-8"
        type="submit"
        :disabled="isSubmitting"
        :label="$t('navbar.user.signIn')"
      />

      <NuxtLink
        to="/recover"
        class="block w-max my-3 text-primary-400"
      >
        {{ $t("navbar.user.forgotPassword") }}
      </NuxtLink>
    </form>
  </ValidationObserver>
</template>
