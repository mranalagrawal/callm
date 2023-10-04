<script lang="ts">
import { computed, defineComponent, inject, onMounted, useContext, useRoute, useRouter } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    const { $cmwGtmUtils, localePath } = useContext()
    const route = useRoute()
    const router = useRouter()
    const isDesktop = inject('isDesktop')
    const registerIsVisible = computed(() => route.value.hash === '#register')

    const handleGoToLogin = (hash = '') => {
      router.push(localePath({ path: '/login', hash }))
    }
    onMounted(() => {
      process.browser && $cmwGtmUtils.pushPage('page')
    })

    return {
      handleGoToLogin,
      isDesktop,
      registerIsVisible,
    }
  },
})
</script>

<template>
  <div class="min-h-screen px-4">
    <!-- SMALL SCREENS -->
    <div v-if="!isDesktop" class="h-full md:(hidden) pt-8">
      <div v-if="!registerIsVisible">
        <h3 class="text-center">
          {{ $t("navbar.user.alreadyRegistered") }}
        </h3>
        <LoginForm />
        <div class="bg-gray-lightest py-3">
          <p
            class="text-center mb-0"
            @click="handleGoToLogin('register')"
          >
            {{ $t("navbar.user.notRegisteredYet") }}
            <strong class="text-primary-400 uppercase" v-text="$t('navbar.user.register')" />
          </p>
        </div>
      </div>
      <div v-else>
        <h3 class="text-center" v-text="$t('createYourAccount')" />
        <RegisterBox-B2b v-if="$cmwStore.isB2b" />
        <RegisterBox v-else />
        <CmwButton variant="text" type="button" @click.native="handleGoToLogin()">
          {{ $t('navbar.user.signIn') }}
        </CmwButton>
      </div>
    </div>
    <!-- LARGE SCREENS -->
    <div v-else class="hidden h-full md:(grid grid-cols-2)">
      <div class="pt-20">
        <h3 class="text-center" v-text="$t('navbar.user.alreadyRegistered')" />
        <LoginForm />
        <div class="md:hidden bg-gray-lightest py-3">
          <p class="text-center mb-0">
            {{ $t("navbar.user.notRegisteredYet") }}
            <strong class="text-primary-400 uppercase" v-text="$t('navbar.user.register')" />
          </p>
        </div>
      </div>
      <div class="bg-gray-lightest py-20">
        <h3 class="text-center" v-text="$t('createYourAccount')" />
        <RegisterBox-B2b v-if="$cmwStore.isB2b" />
        <RegisterBox v-else />
      </div>
    </div>
  </div>
</template>
