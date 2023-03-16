<script>
import logo from 'assets/svg/logo-call-me-wine.svg'
import walletIcon from 'assets/svg/wallet.svg'
import { SweetAlertToast } from '~/utilities/Swal'
/* import locales from '../locales-mapper' */
export default {
  data() {
    return {
      logo,
      walletIcon,
      data: null,
      info: null,
      newsletter: false,
      marketing: false,
      email: '',
    }
  },
  async fetch() {
    let lang = this.$i18n.localeProperties.iso.toLowerCase()

    if (lang === 'en-gb' && this.$config.STORE === 'CMW')
      lang = 'en-eu'

    const response = await this.$prismic.api.getSingle('footer', {
      lang,
    })
    const data = response.data.body
    this.data = data

    const responseInfo = await this.$prismic.api.getSingle('footer-info', {
      lang,
    })
    const info = responseInfo.data

    this.info = info
  },
  watch: {
    '$i18n.locale': '$fetch',
  },
  methods: {
    async handleSubmit() {
      const response = await fetch(`${this.$config.CUSTOMER_API}${this.$config.STORE}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({
          email: this.email,
        }),
      }).then(r => r.ok)

      if (response) {
        await SweetAlertToast.fire({
          icon: 'success',
          text: this.$i18n.t('common.feedback.OK.emailAdded'),
        })
        this.email = ''
      } else {
        await SweetAlertToast.fire({
          icon: 'error',
          text: this.$i18n.t('common.feedback.KO.unknown'),
        })
      }
    },
  },

}
</script>

<template>
  <footer class="container-fluid pt-5 mt-5 px-0" style="background: #f8f8f8">
    <div class="container-fluid px-md-5">
      <div class="row">
        <div class="col-12">
          <p class="font-weight-bold h2 text-center mb-5">
            {{ $t("footer.explore") }}
          </p>
        </div>
      </div>
      <div v-if="data" class="row d-md-none">
        <div v-for="item in data" :key="item.id" class="col-12">
          <nuxt-link
            :to="item.primary.link"
            class="text-uppercase primary-title"
          >
            {{ item.primary.title }}
          </nuxt-link>

          <hr>
        </div>
      </div>
      <div v-if="data" class="row d-none d-md-flex">
        <div v-for="item in data" :key="item.id" class="col">
          <p class="" style="margin-bottom: 36px">
            <nuxt-link
              :to="item.primary.link"
              style="color: #176a62"
              class="text-uppercase text-decoration-none primary-title"
            >
              {{ item.primary.title }}
            </nuxt-link>
          </p>
          <p
            v-for="link in item.items"
            :key="`inner_${link.name}`"
            class="pb-0"
          >
            <nuxt-link
              :to="link.link"
              class="text-decoration-none secondary-title"
            >
              {{ link.name }}
            </nuxt-link>
          </p>
        </div>
      </div>
    </div>

    <div
      v-if="data && info"
      class="container-fluid bg-dark-primary text-light-footer px-md-5 py-5 mt-5"
    >
      <div v-if="$config.STORE === 'CMW'" class="row justify-content-end">
        <nuxt-link
          class="text-decoration-none text-uppercase text-white fs-0875 mr-3"
          :to="switchLocalePath($config.DEFAULT_LOCALE)"
          :class="
            $i18n.locale === $config.DEFAULT_LOCALE ? 'font-weight-bold' : ''
          "
        >
          {{ $config.DEFAULT_LOCALE }}
        </nuxt-link>

        <nuxt-link
          v-if="$config.DEFAULT_LOCALE !== 'en'"
          class="text-decoration-none text-uppercase text-white fs-0875 mr-3"
          :to="switchLocalePath('en')"
          :class="$i18n.locale === 'en' ? 'font-weight-bold' : ''"
        >
          EN
        </nuxt-link>
        <nuxt-link
          v-else
          class="text-decoration-none text-uppercase text-white fs-0875 mr-3"
          :to="switchLocalePath('it')"
          :class="$i18n.locale === 'it' ? 'font-weight-bold' : ''"
        >
          IT
        </nuxt-link>
      </div>
      <div class="row">
        <div class="col-12">
          <VueSvgIcon :data="logo" color="white" width="180" height="auto" />
          <p class="mt-2 fs-14 cmw-text-secondary-100" v-text="info.description" />
        </div>
      </div>
      <div class="row">
        <div class="col-12 col-lg-6 pr-md-5">
          <p class="fs-14">
            <span
              class="fal fa-envelope mr-2 text-white"
              style="font-size: 18px"
            />
            <span class="cmw-text-secondary-100">Newsletter</span>
          </p>
          <p class=" cmw-text-secondary-100">
            {{ info.newsletter_cta }}
          </p>
          <form class="mb-5 pr-md-4" @submit.prevent="handleSubmit">
            <div
              class="row border border-light py-1 mx-0"
              style="border-radius: 10px"
            >
              <div class="col-7 col-md-10">
                <input
                  v-model="email"
                  type="email"
                  class="form-control bg-transparent border-0 shadow-none focus:shadow-none text-white"
                  required
                >
              </div>
              <div class="col-5 col-md-2 px-md-1 text-right">
                <button
                  type="submit"
                  class="btn font-weight-bold text-uppercase w-100 btn-newsletter"
                >
                  {{ $t("navbar.user.signIn") }}
                </button>
              </div>
            </div>
            <div class="row mt-3">
              <div class="col-12">
                <div class="custom-control form-control-lg custom-checkbox">
                  <input
                    id="customCheck1"
                    v-model="newsletter"
                    type="checkbox"
                    class="custom-control-input"
                    required
                  >
                  <label
                    class="custom-control-label fs-0875 pl-3"
                    for="customCheck1"
                  >{{ info.first_check }}
                    <a href="#" class="text-decoration-none text-white">Privacy Policy</a></label>
                </div>
              </div>
              <div v-show="newsletter" class="col-12 mt-3">
                <div class="custom-control form-control-lg custom-checkbox">
                  <input
                    id="customCheck2"
                    v-model="marketing"
                    type="checkbox"
                    class="custom-control-input"
                  >
                  <label
                    class="custom-control-label fs-0875 pl-3"
                    for="customCheck2"
                  >{{ info.second_check }}
                    <a href="#" class="text-decoration-none text-white">Privacy Policy</a></label>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div class="col-12 col-lg-6" style="font-size: 0.875rem">
          <div class="row">
            <div class="col-12 col-lg-4 mb-5">
              <p class="h5 mb-4 cmw-text-secondary-100" style="font-weight: 400">
                {{ $t("footer.company") }}
              </p>
              <nuxt-link
                :to="localePath('/about-us')"
                class="text-decoration-none text-white"
              >
                {{ $t("footer.who") }}
              </nuxt-link>
            </div>
            <div class="col-12 col-lg-4 mb-5">
              <p class="h5 mb-4 cmw-text-secondary-100" style="font-weight: 400">
                {{ $t("footer.services") }}
              </p>
              <nuxt-link
                :to="localePath('/restaurants-wineshops')"
                class="text-decoration-none text-white d-block mb-2"
              >
                {{ $t("footer.restaurantsAndWineshops") }}
              </nuxt-link>
              <!-- <nuxt-link
                :to="localePath('/business-gifts')"
                class="text-decoration-none text-white d-block mb-2"
                >Regali aziendali</nuxt-link
              >
              <nuxt-link
                :to="localePath('/gift-cards')"
                class="text-decoration-none text-white d-block mb-2"
                >Buoni regalo</nuxt-link
              > -->
            </div>
            <div class="col-12 col-lg-4 mb-5">
              <p class="h5 mb-4 cmw-text-secondary-100" style="font-weight: 400">
                {{ $t("footer.support") }}
              </p>
              <nuxt-link
                :to="localePath('/shipping')"
                class="text-decoration-none text-white d-block mb-2"
              >
                {{ $t("footer.shipping") }}
              </nuxt-link>
              <nuxt-link
                :to="localePath('/payments')"
                class="text-decoration-none text-white d-block mb-2"
              >
                {{ $t("footer.payments") }}
              </nuxt-link>
              <nuxt-link
                :to="localePath('/terms-of-sales')"
                class="text-decoration-none text-white d-block mb-2"
              >
                {{ $t("footer.termsOfSales") }}
              </nuxt-link>
              <nuxt-link
                :to="localePath('/privacy')"
                class="text-decoration-none text-white d-block mb-2"
              >
                Privacy policy
              </nuxt-link>
              <nuxt-link
                :to="localePath('/cookie')"
                class="text-decoration-none text-white d-block mb-2"
              >
                Cookie policy
              </nuxt-link>
              <nuxt-link
                :to="localePath('/contact')"
                class="text-decoration-none text-white d-block mb-2"
              >
                {{ $t("footer.contacts") }}
              </nuxt-link>
            </div>
          </div>
        </div>
      </div>
      <FooterSocials />

      <hr class="separator">

      <div class="md:cmw-flex cmw-text-center cmw-justify-center">
        <div class="cmw-flex cmw-gap-2 cmw-items-center cmw-justify-center">
          <VueSvgIcon :data="walletIcon" color="white" width="30" height="30" />
          <span>{{ $t("footer.paymentMethods") }}</span>
        </div>
        <div class="cmw-grid cmw-grid-cols-3 md:cmw-grid-cols-6 cmw-justify-items-center cmw-content-center cmw-px-8 cmw-py-4">
          <img
            src="https://cdn.shopify.com/s/files/1/0578/7497/2719/files/american-express.png?v=1677682511&format=webp"
            width="65"
            height="64"
            alt="american express logo"
          >
          <img
            src="../assets/images/mastercard.png"
            width="65"
            height="64"
            alt="mastercard logo"
          >
          <img
            src="../assets/images/visa.png"
            width="65"
            height="64"
            alt="visa logo"
          >
          <img
            src="../assets/images/paypal.png"
            width="65"
            height="64"
            alt="paypal logo"
          >
          <img
            src="../assets/images/bonifico.png"
            width="65"
            height="64"
            alt="bonifico logo"
          >
          <img
            src="../assets/images/comodo.png"
            width="65"
            height="64"
            alt="comodo logo"
          >
        </div>
      </div>

      <hr class="separator">
      <div class="row justify-content-center mt-4">
        <div class="col-12 col-md-10 text-center px-4">
          <p class="credit cmw-text-secondary-100">
            {{ info.info }}
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.credit {
  font-size: 0.75rem;
}
.separator {
  background: #134c45;
}
.btn-newsletter {
  border-radius: 10px;
  height: 34px;
  position: relative;
  top: 2px;
  right: 4px;
  font-size: 13px;
  background: white;
  color: #d86c82;
}

.btn-newsletter:hover {
  background: #ad2b48;
  color: white;
}

.fs-0875 {
  font-size: 0.875rem;
}

.text-light-footer {
  color: #add3d1;
}

.primary-title {
  font-size: 0.875rem;
  color: #176a62;
  font-weight: normal;
  line-height: 1.5;
  letter-spacing: 2.1px;
  font-style: normal;
  text-transform: uppercase;
}

.secondary-title {
  font-size: 15px;
  color: #000;
  font-weight: normal;
  letter-spacing: normal;
  font-style: normal;
  padding: 8px 0px !important;
}
.secondary-title:hover {
  color: var(--dark-secondary);
}

.custom-control-label:before {
  background-color: transparent;
  border-radius: 2px;
  border: 2px solid #add3d1;
  width: 18px;
  height: 18px;
}
.custom-control-label::after {
  width: 18px;
  height: 18px;
}

.custom-checkbox .custom-control-input:checked ~ .custom-control-label::before {
  background-color: transparent;
  border-color: #add3d1;
}
</style>
