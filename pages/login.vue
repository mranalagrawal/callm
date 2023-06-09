<script lang="ts">
import { defineComponent, inject, onMounted, ref, useContext } from '@nuxtjs/composition-api'

export default defineComponent({
  layout({ $config }) {
    return $config.STORE
  },
  setup() {
    const { $cmwGtmUtils } = useContext()
    const registerIsVisible = ref(false)
    const isDesktop = inject('isDesktop')

    onMounted(() => {
      process.browser && $cmwGtmUtils.pushPage('page')
    })

    return { registerIsVisible, isDesktop }
  },
})
</script>

<template>
  <div class="cmw-px-4 cmw-min-h-screen">
    <div v-if="!isDesktop" class="cmw-h-full md:(cmw-hidden)">
      <div v-if="!registerIsVisible">
        <h3 class="cmw-text-center">
          {{ $t("navbar.user.alreadyRegistered") }}
        </h3>
        <LoginForm />
        <div class="cmw-bg-gray-lightest cmw-py-3">
          <p
            class="cmw-text-center cmw-mb-0"
            @click="registerIsVisible = true"
          >
            {{ $t("navbar.user.notRegisteredYet") }}
            <strong class="cmw-text-primary-400 cmw-uppercase" v-text="$t('navbar.user.register')" />
          </p>
        </div>
      </div>
      <div v-else>
        <h3 class="cmw-text-center" v-text="$t('createYourAccount')" />
        <RegisterBox />
      </div>
    </div>
    <div v-else class="cmw-hidden cmw-h-full md:(cmw-grid cmw-grid-cols-2)">
      <div class="cmw-pt-20">
        <h3 class="cmw-text-center" v-text="$t('navbar.user.alreadyRegistered')" />
        <LoginForm />
        <div class="cmw-bg-gray-lightest cmw-py-3">
          <p class="cmw-text-center cmw-mb-0">
            {{ $t("navbar.user.notRegisteredYet") }}
            <strong class="cmw-text-primary-400 cmw-uppercase" v-text="$t('navbar.user.register')" />
          </p>
        </div>
      </div>
      <div class="cmw-bg-gray-lightest cmw-py-20">
        <h3 class="text-center" v-text="$t('createYourAccount')" />
        <RegisterBox />
      </div>
    </div>
  </div>
</template>
