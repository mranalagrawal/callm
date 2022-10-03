<template>
  <div class="container-fluid pt-5 mt-5 px-0 bg-light">
    <!-- <nuxt-link
      class=""
      v-if="$i18n.locale !== 'en'"
      :to="switchLocalePath('en')"
    >
      🇬🇧
    </nuxt-link>

    <nuxt-link
      class=""
      v-if="$i18n.locale !== 'it'"
      :to="switchLocalePath('it')"
    >
      🇮🇹
    </nuxt-link> -->
    <div class="container-fluid px-md-5">
      <div class="row" v-if="data">
        <div class="col" v-for="item in data" :key="item.id">
          <p class="text-uppercase" style="color: #176a62">
            {{ item.primary.title }}
          </p>
          <p class="" v-for="link in item.items" :key="`inner_${link.name}`">
            <nuxt-link :to="link.link" class="text-decoration-none menu-link"
              >{{ link.name }}
            </nuxt-link>
          </p>
        </div>
      </div>
    </div>

    <div
      class="container-fluid bg-dark-green text-light-footer px-md-5 py-5 mt-5"
    >
      <div class="row">
        <div class="col-12">
          <img
            src="../assets/images/logo-white.svg"
            class="img-fluid"
            width="180px"
            alt=""
          />
          <p class="mt-2">
            Callmewine è un’enoteca online specializzata nella vendita di vino,
            champagne e distillati.
          </p>
        </div>
      </div>
      <div class="row">
        <div class="col-12 col-lg-6">
          <p class="lead">Newsletter</p>
          <div class="mb-5">
            <form>
              <div class="row border border-light rounded-lg py-2 mx-0">
                <div class="col-9">
                  <input
                    type="email"
                    class="form-control bg-transparent border-0"
                    id=""
                    placeholder="Inserisci qui la tua email"
                  />
                </div>
                <div class="col-3">
                  <button class="btn btn-light w-100">Iscriviti</button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div class="col-12 col-lg-6" style="font-size: 0.875rem">
          <div class="row">
            <div class="col-12 col-lg-4 mb-5">
              <p class="h4 mb-4">L'azienda</p>
              <nuxt-link to="/" class="text-decoration-none text-white"
                >Chi siamo</nuxt-link
              >
            </div>
            <div class="col-12 col-lg-4 mb-5">
              <p class="h4 mb-4">Servizi offerti</p>
              <nuxt-link
                to="/"
                class="text-decoration-none text-white d-block mb-2"
                >Enoteche e Ristoranti</nuxt-link
              >
              <nuxt-link
                to="/"
                class="text-decoration-none text-white d-block mb-2"
                >Regali aziendali</nuxt-link
              >
              <nuxt-link
                to="/"
                class="text-decoration-none text-white d-block mb-2"
                >Buoni regalo</nuxt-link
              >
              <nuxt-link
                to="/"
                class="text-decoration-none text-white d-block mb-2"
                >Guida ai nostri vini</nuxt-link
              >
            </div>
            <div class="col-12 col-lg-4 mb-5">
              <p class="h4 mb-4">Supporto</p>
              <nuxt-link
                to="/"
                class="text-decoration-none text-white d-block mb-2"
                >Spedizioni</nuxt-link
              >
              <nuxt-link
                to="/"
                class="text-decoration-none text-white d-block mb-2"
                >Pagamenti</nuxt-link
              >
              <nuxt-link
                to="/"
                class="text-decoration-none text-white d-block mb-2"
                >Condizioni di vendita</nuxt-link
              >
              <nuxt-link
                to="/"
                class="text-decoration-none text-white d-block mb-2"
                >Contattaci</nuxt-link
              >
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-12 text-white text-center">
          <span class="h3"
            ><i class="fal fa-wallet mr-2"></i>Metodi di pagamento</span
          >
          <img src="../assets/images/american-express.png" />
          <img src="../assets/images/mastercard.png" />
          <img src="../assets/images/visa.png" />
          <img src="../assets/images/paypal.png" />
          <img src="../assets/images/bonifico.png" />
          <img src="../assets/images/comodo.png" />
        </div>
      </div>

      <hr class="bg-light" />
      <div class="row">
        <div class="col-12 px-4">
          <p class="small text-center">
            © Callmewine 2021, tutti i diritti riservati. CALLMEWINE S.R.L., Via
            Lovanio 5, 20121 Milano (IT), Capitale Sociale 12.245,92 euro (IV),
            CF/P.IVA 07130650968, Cam.Com MI REA 1937916 - Società soggetta a
            direzione e coordinamento di Italmobiliare S.p.A., C.F. 00796400158
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
  color: var(--dark-red);
  text-decoration: none;
}
</style>

<script>
export default {
  data() {
    return {
      data: null,
    };
  },
  watch: {
    "$i18n.locale": "$fetch",
  },
  async fetch() {
    console.log(this.$i18n.locale, "LAN");

    let lang = "";
    if (this.$i18n.locale == "en") {
      lang = "en-gb";
    } else {
      lang = "it-it";
    }
    const response = await this.$prismic.api.getSingle("footer", {
      lang: lang,
    });
    const data = response.data.body;
    this.data = data;
    console.log(data, "footer");
  },
};
</script>
