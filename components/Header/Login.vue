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
        await customerStore.getCustomer('login')
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
    <div class="border-t-4 border-t-primary-900 py-4 px-6">
      <template v-if="!customer.id">
        <ValidationObserver v-slot="{ handleSubmit }" slim>
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
              class="text-sm text-error mt-3"
            >
              {{ message }}
            </p>

            <Button
              class="mt-8"
              type="submit"
              :disabled="isSubmitting"
              :label="$t('navbar.user.signIn').toString()"
            />

            <NuxtLink
              to="/recover"
              class="block w-max my-3 mx-auto text-primary-400"
            >
              {{ $t("navbar.user.forgotPassword") }}
            </NuxtLink>
          </form>
        </ValidationObserver>
      </template>
      <template v-else>
        <nav class="min-w-[425px]">
          <NuxtLink
            v-for="({ to, label }) in $options.userNavigation"
            :key="to"
            :to="localePath(to)"
            class="block mb-4 w-max text-body hover:(text-primary font-bold)"
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
      class="min-w-[425px] bg-gray-lightest py-4 flex justify-center gap-4 text-sm px-8 w-max"
    >
      <div>{{ $t("navbar.user.notRegisteredYet") }}</div>
      <NuxtLink
        :to="localePath('/login')"
        class="text-uppercase text-primary-400"
      >
        {{ $t("navbar.user.register") }}
      </NuxtLink>
    </div>
  </div>
</template>
