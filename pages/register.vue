<script lang="ts">
import { defineComponent, onMounted, useContext } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    const { $cmwGtmUtils } = useContext()

    onMounted(() => {
      process.browser && $cmwGtmUtils.pushPage('page')
    })

    return {}
  },
})
</script>

<template>
  <div class="max-w-screen-xl min-h-screen px-4 m-inline-auto">
    <div class="justify-center grid grid-cols-[minmax(200px,_24rem)] m-inline-auto mt-8">
      <ClientOnly>
        <h3 class="text-center pt-8" v-text="$t('createYourAccount')" />
        <RegisterBox-B2b v-if="$cmwStore.isB2b" />
        <RegisterBox v-else />
        <div class="py-3">
          <p class="text-center">
            {{ $t('navbar.user.alreadyRegistered') }}
            <CmwButton variant="text" class="w-max inline-block" :to="localePath('/login')">
              <strong class="text-primary-400 uppercase" v-text="$t('common.cta.signIn')" />
            </CmwButton>
          </p>
        </div>
      </ClientOnly>
    </div>
  </div>
</template>
