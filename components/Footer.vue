<template>
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
  </div>
</template>

<script></script>

<style scoped>
.text-light-footer {
  color: #add3d1;
}
</style>
