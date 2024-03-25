<script lang="ts">
import { defineComponent, ref, useContext, useRouter } from '@nuxtjs/composition-api'

import type { RawLocation } from 'vue-router'
import type { TranslateResult } from 'vue-i18n'

import Alert from '~/components/FeedBack/Alert.vue'
import eyeHideIcon from '~/assets/svg/eye-hide.svg'
import eyeShowIcon from '~/assets/svg/eye-show.svg'
import loginApple from '~/assets/svg/login-apple.svg'
import loginFacebook from '~/assets/svg/login-facebook.svg'
import loginGoogle from '~/assets/svg/login-google.svg'
import socialFacebook from '~/assets/svg/social-facebook.svg'
import socialGoogle from '~/assets/svg/social-google.svg'
import { useCart } from '~/store/cart'
import { useCustomer } from '~/store/customer'

export default defineComponent({
  components: { Alert },
  props: {
    skipRedirect: { type: Boolean },
  },
  emits: ['login-success'],
  setup(props, { emit }) {
    const { i18n, localeLocation, $cmwGtmUtils } = useContext()
    const { getInitialCart } = useCart()
    const router = useRouter()
    const customerStore = useCustomer()
    const isSubmitting = ref(false)
    const passwordIsVisible = ref(false)
    const message = ref<TranslateResult>('')
    const form = ref({
      email: '',
      password: '',
    })
    const onSubmit = async () => {
      isSubmitting.value = true

      const valid = await customerStore.login(form.value.email, form.value.password)

      if (valid) {
        await customerStore.getCustomer()
          .then(() => {
            emit('login-success', true)
            getInitialCart()
            $cmwGtmUtils.pushCustomLoginEvent()
            !props.skipRedirect && router.push(localeLocation('/') as RawLocation)
          })
      } else {
        message.value = i18n.t('common.feedback.KO.login')
      }
      isSubmitting.value = false
    }

    return {
      customerStore,
      eyeHideIcon,
      eyeShowIcon,
      form,
      isSubmitting,
      loginApple,
      loginFacebook,
      loginGoogle,
      message,
      onSubmit,
      passwordIsVisible,
      socialFacebook,
      socialGoogle,
    }
  },
})
</script>

<template>
  <div>
    <ClientOnly>
      <ValidationObserver v-slot="{ handleSubmit }" slim>
        <form @submit.prevent="handleSubmit(onSubmit)">
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

          <CmwButton
            class="js-login-cta mt-8"
            type="submit"
            :disabled="isSubmitting"
            :label="$t('common.cta.signIn')"
          />

          <NuxtLink
            to="/recover"
            class="block w-max my-3 text-primary-400"
          >
            {{ $t('navbar.user.forgotPassword') }}
          </NuxtLink>
          <a
            v-if="$cmwStore.isIt" class="my-8 cmw-font-bold text-secondary-400" href="https://b2b.callmewine.com"
            v-text="'PORTALE OPERATORI HO.RE.CA.'"
          />
        </form>
      </ValidationObserver>

      <div v-if="!$cmwStore.isB2b" class="">
        <p class="mb-5">
          {{ $t("navbar.user.orLoginWith") }}
        </p>
        <a
          :href="`${$config.MULTIPASS_URL}/social-login/${$config.STORE}/facebook/`"
          class="btn-base cmw-font-bold w-full text-sm text-white btn-base-spacing my-3 facebook"
        >
          <VueSvgIcon :data="socialFacebook" color="white" width="30" height="auto" />
          <span class="px-3">{{ $t("navbar.user.facebookLogin") }}</span>
        </a>
        <a
          :href="`${$config.MULTIPASS_URL}/social-login/${$config.STORE}/google/`"
          class="btn-base cmw-font-bold w-full text-sm btn-base-spacing mb-3 google"
        >
          <VueSvgIcon :data="socialGoogle" original width="30" height="auto" />
          <span class="px-3">{{ $t("navbar.user.googleLogin") }}</span>
        </a>
      </div>
    </ClientOnly>
  </div>
</template>

<style scoped>
  .facebook {
    background-color: #004bce;
    border-color: #004bce;
    text-transform: unset;
  }
  .google {
    background-color: #fff;
    text-transform: unset;
    color: black;
    border-color: black;
    border-width: 1px;
  }
</style>
