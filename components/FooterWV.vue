<template>
  <div class="container-fluid pt-5 mt-5 px-0" style="background: #f8f8f8">
    <div class="container-fluid px-md-5">
      <div class="row">
        <div class="col-12">
          <p class="font-weight-bold h2 text-center mb-5">
            {{ $t("footer.explore") }}
          </p>
        </div>
      </div>
      <div class="row d-md-none" v-if="data">
        <div class="col-12" v-for="item in data" :key="item.id">
          <nuxt-link
            :to="item.primary.link"
            class="text-uppercase primary-title"
          >
            {{ item.primary.title }}
          </nuxt-link>

          <hr />
        </div>
      </div>
      <div class="row d-none d-md-flex" v-if="data">
        <div class="col" v-for="item in data" :key="item.id">
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
            class="pb-0"
            v-for="link in item.items"
            :key="`inner_${link.name}`"
          >
            <nuxt-link
              :to="link.link"
              class="text-decoration-none secondary-title"
              >{{ link.name }}
            </nuxt-link>
          </p>
        </div>
      </div>
    </div>

    <div
      v-if="data && info"
      class="container-fluid bg-dark-primary text-light-footer px-md-5 py-5 mt-5"
    >
      <div class="row justify-content-end">
        <nuxt-link
          class="text-decoration-none text-white fs-0875 mr-3"
          :to="switchLocalePath('it')"
          :class="$i18n.locale == 'it' ? 'font-weight-bold' : ''"
          >IT</nuxt-link
        >
        <nuxt-link
          class="text-decoration-none text-white fs-0875 mr-3"
          :to="switchLocalePath('en')"
          :class="$i18n.locale == 'en' ? 'font-weight-bold' : ''"
          >EN</nuxt-link
        >
      </div>
      <div class="row">
        <div class="col-12">
          <img
            src="../assets/images/logo-white-wv.svg"
            class="img-fluid"
            width="180px"
            alt=""
          />
          <p class="mt-2 fs-14">
            {{ info.description }}
          </p>
        </div>
      </div>
      <div class="row">
        <div class="col-12 col-lg-6 pr-md-5">
          <p class="fs-14">
            <i
              class="fal fa-envelope mr-2 text-white"
              style="font-size: 18px"
            ></i>
            Newsletter
          </p>
          <p class="">
            {{ info.newsletter_cta }}
          </p>
          <form class="mb-5 pr-md-4">
            <div
              class="row border border-light py-1 mx-0"
              style="border-radius: 10px"
            >
              <div class="col-7 col-md-10">
                <input
                  type="email"
                  class="form-control bg-transparent border-0"
                  id=""
                />
              </div>
              <div class="col-5 col-md-2 px-md-1 text-right">
                <button
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
                    type="checkbox"
                    class="custom-control-input"
                    id="customCheck1"
                    v-model="newsletter"
                  />
                  <label
                    class="custom-control-label fs-0875 pl-3"
                    for="customCheck1"
                    >{{ info.first_check }}
                    <a href="#" class="text-decoration-none text-white"
                      >Privacy Policy</a
                    ></label
                  >
                </div>
              </div>
              <div v-show="newsletter" class="col-12 mt-3">
                <div class="custom-control form-control-lg custom-checkbox">
                  <input
                    type="checkbox"
                    class="custom-control-input"
                    id="customCheck2"
                    v-model="marketing"
                  />
                  <label
                    class="custom-control-label fs-0875 pl-3"
                    for="customCheck2"
                    >{{ info.second_check }}
                    <a href="#" class="text-decoration-none text-white"
                      >Privacy Policy</a
                    ></label
                  >
                </div>
              </div>
            </div>
          </form>
        </div>
        <div class="col-12 col-lg-6" style="font-size: 0.875rem">
          <div class="row">
            <div class="col-12 col-lg-6 mb-5">
              <p class="h5 mb-4" style="font-weight: 400">
                {{ $t("footer.company") }}
              </p>
              <nuxt-link
                :to="localePath('/about-us')"
                class="text-decoration-none text-white"
                >{{ $t("footer.who") }}</nuxt-link
              >
            </div>
            <div class="col-12 col-lg-6 mb-5">
              <p class="h5 mb-4" style="font-weight: 400">
                {{ $t("footer.support") }}
              </p>
              <nuxt-link
                :to="localePath('/shipping')"
                class="text-decoration-none text-white d-block mb-2"
                >{{ $t("footer.shipping") }}</nuxt-link
              >
              <nuxt-link
                :to="localePath('/payments')"
                class="text-decoration-none text-white d-block mb-2"
                >{{ $t("footer.payments") }}</nuxt-link
              >
              <nuxt-link
                :to="localePath('/terms-of-sales')"
                class="text-decoration-none text-white d-block mb-2"
                >{{ $t("footer.termsOfSales") }}</nuxt-link
              >
              <nuxt-link
                :to="localePath('/contact')"
                class="text-decoration-none text-white d-block mb-2"
                >{{ $t("footer.contacts") }}</nuxt-link
              >
            </div>
          </div>
        </div>
      </div>

      <hr class="separator" />

      <div class="row">
        <div class="col-12 text-center">
          <span class="payment"
            ><i
              class="fal fa-wallet text-white mr-2"
              style="font-size: 24px"
            ></i
            >{{ $t("footer.paymentMethods") }}</span
          >
          <img
            src="../assets/images/american-express.png"
            width="65px"
            height="65px"
            style="margin: 0px 2px"
          />
          <img
            src="../assets/images/mastercard.png"
            width="65px"
            height="65px"
            style="margin: 0px 2px"
          />
          <img
            src="../assets/images/visa.png"
            width="65px"
            height="65px"
            style="margin: 0px 2px"
          />
          <img
            src="../assets/images/paypal.png"
            width="65px"
            height="65px"
            style="margin: 0px 2px"
          />
          <img
            src="../assets/images/bonifico.png"
            width="65px"
            height="65px"
            style="margin: 0px 2px"
          />
          <img
            src="../assets/images/comodo.png"
            width="65px"
            height="65px"
            style="margin: 0px 2px"
          />
        </div>
      </div>

      <hr class="separator" />
      <div class="row justify-content-center mt-4">
        <div class="col-12 col-md-10 text-center px-4">
          <p class="credit">{{ info.info }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.credit {
  font-size: 0.75rem;
}
.separator {
  background: #134c45;
}
.payment {
  font-size: 1.25rem;
  font-weight: 400;
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

.shadow-menu {
  box-shadow: 0 0.5rem 0.75rem rgb(0 0 0 / 15%) !important;
  border-bottom: 1px solid #ddd;
}
.menu-link {
  color: black;
  text-decoration: none;
}
.menu-link:hover {
  color: var(--dark-secondary);
  text-decoration: none;
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

<script>
export default {
  data() {
    return {
      data: null,
      info: null,
      newsletter: false,
      marketing: false,
    };
  },
  watch: {
    "$i18n.locale": "$fetch",
  },
  async fetch() {
    let lang = "";
    if (this.$i18n.locale == "en") {
      lang = "en-gb";
    } else {
      lang = "it-it";
    }
    const response = await this.$prismic.api.getSingle("wv_footer", {
      lang: lang,
    });
    const data = response.data.body;
    this.data = data;

    const responseInfo = await this.$prismic.api.getSingle("wv_footer-info", {
      lang: lang,
    });
    const info = responseInfo.data;

    this.info = info;
  },
};
</script>
