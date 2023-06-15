<script>
import editIcon from 'assets/svg/edit.svg'
import { onMounted, useContext, useFetch } from '@nuxtjs/composition-api'
import { storeToRefs } from 'pinia'
import { useCustomer } from '~/store/customer'
import { useSplash } from '~/store/splash'

export default {
  setup() {
    const { i18n, $cmwGtmUtils } = useContext()
    const splash = useSplash()
    const customerStore = useCustomer()
    const { customer } = storeToRefs(customerStore)

    useFetch(async () => {
      await customerStore.getCustomer()
    })

    const openEditEmailSplash = () => {
      splash.$patch({
        currentSplash: 'UpdateCustomerEmail',
        title: i18n.t('profile.setNewEmailAddress'),
        size: 'lg',
      })

      customerStore.$patch({
        editingCustomer: { email: customer.value.email },
      })
    }

    const openEditPasswordSplash = () => {
      splash.$patch({
        currentSplash: 'UpdateCustomerPassword',
        title: i18n.t('profile.setNewPassword'),
        size: 'lg',
      })
    }

    const openEditDataSplash = () => {
      splash.$patch({
        currentSplash: 'UpdateCustomerData',
        title: i18n.t('profile.setNewPersonalData'),
        size: 'lg',
      })

      customerStore.$patch({
        editingCustomer: {
          acceptsMarketing: customer.value.acceptsMarketing,
          firstName: customer.value.firstName,
          lastName: customer.value.lastName,
          phone: customer.value.phone,
        },
      })
    }

    onMounted(() => {
      process.browser && $cmwGtmUtils.pushPage('page')
    })

    return { customer, editIcon, openEditEmailSplash, openEditPasswordSplash, openEditDataSplash }
  },
}
</script>

<template>
  <div>
    <p v-if="$fetchState.pending" class="px-4">
      {{ $t("loading") }}
    </p>
    <div v-else class="md:(mt-9 max-w-10/12)">
      <div class="px-4 h4 font-semibold" v-text="$t('profile.accessData')" />
      <div class="grid sm:grid-cols-2 gap-4 p-4">
        <div>
          <div
            class="h-full flex items-center font-sans rounded-sm border border-gray-light
           hover:shadow-elevation"
          >
            <div class="pl-4 py-8">
              <div class="overline-2 uppercase text-secondary-700" v-text="$t('email')" />
              <div class="font-sans" v-text="customer.email" />
            </div>
            <div class="ml-auto mt-auto mb-3 mr-3">
              <ButtonIcon
                :icon="editIcon" variant="icon" @click.native="openEditEmailSplash"
              />
            </div>
          </div>
        </div>
        <div>
          <div
            class="h-full flex items-center font-sans rounded-sm border border-gray-light
           hover:shadow-elevation"
          >
            <div class="pl-4 py-8">
              <div class="overline-2 uppercase text-secondary-700" v-text="$t('password')" />
              <div class="font-sans">
                ***********
              </div>
            </div>
            <div class="ml-auto mt-auto mb-3 mr-3">
              <ButtonIcon
                :icon="editIcon" variant="icon" @click.native="openEditPasswordSplash"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="px-4 h4 font-semibold mt-10" v-text="$t('profile.personalData')" />
      <div class="p-4">
        <div
          class="h-full flex items-center font-sans rounded-sm border border-gray-light
           hover:shadow-elevation"
        >
          <div class="grid sm:grid-cols-2 desktop:grid-cols-4 flex-1">
            <div class="pl-4 pt-8 pb-2 sm:py-8">
              <div class="overline-2 uppercase text-secondary-700" v-text="$t('firstName')" />
              <div class="font-sans" v-text="customer.firstName" />
            </div>
            <div class="pl-4 py-2 sm:py-8">
              <div class="overline-2 uppercase text-secondary-700" v-text="$t('lastName')" />
              <div class="font-sans" v-text="customer.lastName" />
            </div>
            <div class="pl-4 py-2 sm:py-8">
              <div class="overline-2 uppercase text-secondary-700" v-text="$t('phone')" />
              <div class="font-sans" v-text="customer.phone" />
            </div>
            <div class="pl-4 pt-2 pb-8 sm:py-8">
              <div class="overline-2 uppercase text-secondary-700" v-text="$t('newsletter.label')" />
              <div class="font-sans" v-text="$t(customer.acceptsMarketing ? 'newsletter.subscribed' : 'newsletter.unsubscribed')" />
            </div>
          </div>
          <div class="ml-auto mt-auto mb-3 mr-3">
            <ButtonIcon
              :icon="editIcon" variant="icon" @click.native="openEditDataSplash"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
