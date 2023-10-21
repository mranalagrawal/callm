<script lang="ts">
import { computed, defineComponent, onMounted, useContext } from '@nuxtjs/composition-api'
import registerImg from '~/assets/images/red-grapes.jpg'

export default defineComponent({
  setup() {
    const { $cmwGtmUtils } = useContext()

    const registerBg = computed(() => {
      return {
        backgroundImage: `url(${registerImg})`,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }
    })

    onMounted(() => {
      process.browser && $cmwGtmUtils.pushPage('page')
    })

    return {
      registerBg,
      registerImg,
    }
  },
})
</script>

<template>
  <div class="max-w-screen-xl mx-auto min-h-screen px-4 items-center lg:(grid gap-4 grid-cols-2)">
    <div class="<lg:hidden self-stretch" :style="registerBg" />
    <div class="<lg:mt-8 w-[min(85%,_24rem)] m-inline-auto">
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
