<script>
import editIcon from 'assets/svg/edit.svg'
import { onMounted, useContext, useFetch } from '@nuxtjs/composition-api'
import { storeToRefs } from 'pinia'
import useGtm from '@/components/composables/useGtm'
import { useCustomer } from '~/store/customer'
import { useSplash } from '~/store/splash'

export default {
  setup() {
    const { i18n } = useContext()
    const splash = useSplash()
    const customerStore = useCustomer()
    const { customer } = storeToRefs(customerStore)
    const { gtmPushPage } = useGtm()

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
      process.browser && gtmPushPage('page')
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
    <div v-else class="md:(cmw-mt-9 cmw-max-w-10/12)">
      <div class="cmw-px-4 cmw-h4 cmw-font-semibold" v-text="$t('profile.accessData')" />
      <div class="cmw-grid sm:cmw-grid-cols-2 cmw-gap-4 cmw-p-4">
        <div>
          <div
            class="cmw-h-full cmw-flex cmw-items-center cmw-font-sans cmw-rounded-sm cmw-border cmw-border-gray-light
           hover:cmw-shadow-elevation"
          >
            <div class="cmw-pl-4 cmw-py-8">
              <div class="cmw-overline-2 cmw-uppercase cmw-text-secondary-700" v-text="$t('email')" />
              <div class="cmw-font-sans" v-text="customer.email" />
            </div>
            <div class="cmw-ml-auto cmw-mt-auto cmw-mb-3 cmw-mr-3">
              <ButtonIcon
                :icon="editIcon" variant="icon" @click.native="openEditEmailSplash"
              />
            </div>
          </div>
        </div>
        <div>
          <div
            class="cmw-h-full cmw-flex cmw-items-center cmw-font-sans cmw-rounded-sm cmw-border cmw-border-gray-light
           hover:cmw-shadow-elevation"
          >
            <div class="cmw-pl-4 cmw-py-8">
              <div class="cmw-overline-2 cmw-uppercase cmw-text-secondary-700" v-text="$t('password')" />
              <div class="cmw-font-sans">
                ***********
              </div>
            </div>
            <div class="cmw-ml-auto cmw-mt-auto cmw-mb-3 cmw-mr-3">
              <ButtonIcon
                :icon="editIcon" variant="icon" @click.native="openEditPasswordSplash"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="cmw-px-4 cmw-h4 cmw-font-semibold cmw-mt-10" v-text="$t('profile.personalData')" />
      <div class="cmw-p-4">
        <div
          class="cmw-h-full cmw-flex cmw-items-center cmw-font-sans cmw-rounded-sm cmw-border cmw-border-gray-light
           hover:cmw-shadow-elevation"
        >
          <div class="cmw-grid sm:cmw-grid-cols-2 desktop:cmw-grid-cols-4 cmw-flex-1">
            <div class="cmw-pl-4 cmw-pt-8 cmw-pb-2 sm:cmw-py-8">
              <div class="cmw-overline-2 cmw-uppercase cmw-text-secondary-700" v-text="$t('firstName')" />
              <div class="cmw-font-sans" v-text="customer.firstName" />
            </div>
            <div class="cmw-pl-4 cmw-py-2 sm:cmw-py-8">
              <div class="cmw-overline-2 cmw-uppercase cmw-text-secondary-700" v-text="$t('lastName')" />
              <div class="cmw-font-sans" v-text="customer.lastName" />
            </div>
            <div class="cmw-pl-4 cmw-py-2 sm:cmw-py-8">
              <div class="cmw-overline-2 cmw-uppercase cmw-text-secondary-700" v-text="$t('phone')" />
              <div class="cmw-font-sans" v-text="customer.phone" />
            </div>
            <div class="cmw-pl-4 cmw-pt-2 cmw-pb-8 sm:cmw-py-8">
              <div class="cmw-overline-2 cmw-uppercase cmw-text-secondary-700" v-text="$t('newsletter.label')" />
              <div class="cmw-font-sans" v-text="$t(customer.acceptsMarketing ? 'newsletter.subscribed' : 'newsletter.unsubscribed')" />
            </div>
          </div>
          <div class="cmw-ml-auto cmw-mt-auto cmw-mb-3 cmw-mr-3">
            <ButtonIcon
              :icon="editIcon" variant="icon" @click.native="openEditDataSplash"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
