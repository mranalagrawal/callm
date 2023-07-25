<script lang="ts">
import { defineComponent, inject, onMounted, ref, useContext } from '@nuxtjs/composition-api'

export default defineComponent({
  layout({ $config }) {
    return $config.STORE
  },
  setup() {
    const { $cmwGtmUtils, $config } = useContext()
    const registerIsVisible = ref(false)
    const isDesktop = inject('isDesktop')

    const isB2bStore = $config.STORE === 'B2B'

    onMounted(() => {
      process.browser && $cmwGtmUtils.pushPage('page')
    })

    return { registerIsVisible, isDesktop, isB2bStore }
  },
})
</script>

<template>
  <div class="min-h-screen px-4">
    <div v-if="!isDesktop" class="h-full md:(hidden)">
      <div v-if="!registerIsVisible">
        <h3 class="text-center">
          {{ $t("navbar.user.alreadyRegistered") }}
        </h3>
        <LoginForm />
        <div class="bg-gray-lightest py-3">
          <p
            class="text-center mb-0"
            @click="registerIsVisible = true"
          >
            {{ $t("navbar.user.notRegisteredYet") }}
            <strong class="text-primary-400 uppercase" v-text="$t('navbar.user.register')" />
          </p>
        </div>
      </div>
      <div v-else>
        <h3 class="text-center" v-text="$t('createYourAccount')" />
        <RegisterBox-B2b v-if="isB2bStore" />
        <RegisterBox v-else />
      </div>
    </div>
    <div v-else class="hidden h-full md:(grid grid-cols-2)">
      <div class="pt-20">
        <h3 class="text-center" v-text="$t('navbar.user.alreadyRegistered')" />
        <LoginForm />
        <div class="bg-gray-lightest py-3">
          <p class="text-center mb-0">
            {{ $t("navbar.user.notRegisteredYet") }}
            <strong class="text-primary-400 uppercase" v-text="$t('navbar.user.register')" />
          </p>
        </div>
      </div>
      <div class="bg-gray-lightest py-20">
        <h3 class="text-center" v-text="$t('createYourAccount')" />
        <RegisterBox-B2b v-if="isB2bStore" />
        <RegisterBox v-else />
      </div>
    </div>
  </div>
</template>
