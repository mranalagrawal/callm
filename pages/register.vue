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
  <div class="max-w-screen-xl mx-auto min-h-screen px-4 items-center lg:(grid gap-4 grid-cols-2)">
    <div class="<lg:hidden self-stretch">
      <picture>
        <source srcset="https://cdn.shopify.com/s/files/1/0656/7824/6108/files/red-grapes.jpg?width=1200" media="(min-width: 992px)" width="1200" height="1612">
        <source srcset="https://cdn.shopify.com/s/files/1/0656/7824/6108/files/red-grapes.jpg?width=100" width="100" height="134">
        <img
          src="https://cdn.shopify.com/s/files/1/0656/7824/6108/files/red-grapes.jpg?width=100"
          class="w-full object-contain object-center"
          alt="Red grapes"
          width="400"
          height="400"
          loading="lazy"
          decoding="async"
        >
      </picture>
    </div>
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
