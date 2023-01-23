<script>
import { storeToRefs } from 'pinia'
import { ref, useContext, useRouter } from '@nuxtjs/composition-api'
import { useCustomer } from '~/store/customer'
import eyeShowIcon from '~/assets/svg/eye-show.svg'
import eyeHideIcon from '~/assets/svg/eye-hide.svg'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'HeaderLogin',
  props: {
    show: {
      type: [Boolean],
    },
  },
  setup() {
    const { i18n, localeLocation } = useContext()
    const router = useRouter()
    const customerStore = useCustomer()
    const { customer } = storeToRefs(customerStore)
    const { logout } = customerStore
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
        await customerStore.getCustomer()
          .then(() => router.push(localeLocation('/profile/my-orders')))
      } else {
        message.value = i18n.t('common.feedback.KO.login')
      }
      isSubmitting.value = false
    }

    return { customerStore, customer, form, passwordIsVisible, isSubmitting, eyeShowIcon, eyeHideIcon, message, logout, onSubmit }
  },
  userNavigation: [
    {
      to: '/profile/my-orders',
      label: 'navbar.user.myOrders',
    },
    {
      to: '/profile/buy-again',
      label: 'navbar.user.buyAgain',
    },
    {
      to: '/profile/wishlist',
      label: 'navbar.user.favorites',
    },
    {
      to: '/profile/addresses',
      label: 'navbar.user.addresses',
    },
    {
      to: '/profile/access-data',
      label: 'navbar.user.accessData',
    },
  ],
}
</script>

<template>
  <div>
    <div class="cmw-border-t-4 cmw-border-t-primary-900 cmw-py-4 cmw-px-6">
      <template v-if="!customer.id">
        <ValidationObserver
          ref="formEl"
          v-slot="{ handleSubmit }"
          slim
        >
          <form
            autocomplete="off"
            @submit.prevent="handleSubmit(onSubmit)"
          >
            <InputField
              v-model="form.email"
              name="user-email-navbar"
              :label="$t('email').toString()"
              autocomplete="off"
              :placeholder="$t('emailPlaceholder')"
              rules="required|email"
            />

            <InputField
              v-model="form.password"
              :type="!passwordIsVisible ? 'password' : 'text'"
              name="user-password-navbar"
              :label="$t('password').toString()"
              autocomplete="off"
              :placeholder="$t('passwordPlaceholder').toString()"
              rules="required|min:4"
              :icon="passwordIsVisible ? eyeHideIcon : eyeShowIcon"
              :click-icon="() => passwordIsVisible = !passwordIsVisible"
            />
            <p
              v-if="message"
              class="cmw-text-sm cmw-text-error mt-3"
            >
              {{ message }}
            </p>

            <Button
              class="cmw-mt-8"
              type="submit"
              :disabled="isSubmitting"
              :label="$t('navbar.user.signIn').toString()"
            />

            <NuxtLink
              to="/recover"
              class="cmw-block cmw-w-max cmw-text-center cmw-my-3 cmw-mx-auto cmw-text-primary-400 hover:(cmw-text-primary-400 cmw-no-underline)"
            >
              {{ $t("navbar.user.forgotPassword") }}
            </NuxtLink>
          </form>
        </ValidationObserver>
      </template>
      <template v-else>
        <nav class="cmw-min-w-[425px]">
          <NuxtLink
            v-for="({ to, label }) in $options.userNavigation"
            :key="to"
            :to="localePath(to)"
            class="cmw-block cmw-mb-4 cmw-w-max cmw-text-body cmw-no-underline hover:(cmw-no-underline cmw-text-primary cmw-font-bold)"
          >
            {{ $t(label) }}
          </NuxtLink>
          <div class="mt-5">
            <Button
              variant="ghost"
              @click.native="logout"
            >
              {{ $t("navbar.user.logout") }}
            </Button>
          </div>
        </nav>
      </template>
    </div>
    <div
      v-if="!customer.id"
      class="cmw-min-w-[425px] cmw-bg-gray-lightest cmw-py-4 cmw-flex cmw-justify-center cmw-gap-4 cmw-text-sm cmw-px-8 cmw-w-max"
    >
      <div>{{ $t("navbar.user.notRegisteredYet") }}</div>
      <NuxtLink
        :to="localePath('/login')"
        class="text-uppercase cmw-text-primary-400"
      >
        {{ $t("navbar.user.register") }}
      </NuxtLink>
    </div>
  </div>
</template>
