<template>
  <div class="container-fluid px-md-5 mt-5">
    <div class="row pt-5">
      <div class="col-12">
        <h1>Titolo</h1>
        <p class="h3">
          Descrizione Lorem ipsum dolor sit, amet consectetur adipisicing elit.
          Nostrum, facilis!
        </p>
      </div>
    </div>
    <div class="row mt-5">
      <div class="col-12">
        <p class="font-weight-bold">Filtra per:</p>
        <hr class="mb-2" />
      </div>
      <div class="col-12">
        <dropdown label="Brands" :items="brands" />
        <dropdown
          label="Selezioni"
          :items="[
            {
              label: 'Preferiti di Callmewine',
              link: 'preferiti',
            },
            {
              label: 'Artigianali',
              link: 'artigianali',
            },
            {
              label: 'Biologici e Biodinamici',
              link: 'bio',
            },
            {
              label: 'Perfetti da regalare',
              link: 'regali',
            },
            {
              label: 'Vini rari',
              link: 'rari',
            },
          ]"
        />

        <dropdown
          label="Carta vini e altri prodotti"
          :items="[
            {
              label: 'Aglianico',
              link: 'aglianico',
            },
            {
              label: 'Aglianico del Vulture',
              link: 'vulture',
            },
            {
              label: 'Aidani',
              link: 'aidani',
            },
            {
              label: 'Airén',
              link: 'airen',
            },
            {
              label: 'Albana Secco',
              link: 'albana-secco',
            },
            {
              label: 'Albarino',
              link: 'albarino',
            },
          ]"
        />

        <dropdown
          label="Filosofia produttiva"
          :items="[
            {
              label: 'Artigianali',
              link: 'artigianali',
            },
            {
              label: 'Biologici',
              link: 'biologici',
            },
            {
              label: 'Biodinamici',
              link: 'biodinamici',
            },
            {
              label: 'Lieviti indigeni',
              link: 'lieviti-indigeni',
            },
            {
              label: 'Vignaioli indipendenti',
              link: 'vignaioli-indipendenti',
            },
            {
              label: 'Triple A',
              link: 'triple-a',
            },
          ]"
        />

        <dropdown-range label="Prezzo" min="0" max="999" />

        <div class="float-right">
          <b-button
            v-b-toggle.more-filters
            variant="danger"
            class="bg-transparent border-0"
          >
            <span class="small text-dark-red"
              >Altri filtri <i class="fal fa-plus ml-3"></i
            ></span>
          </b-button>
        </div>
      </div>
    </div>
    <div class="row">
      <b-collapse class="col-12" id="more-filters">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aliquam quod
        unde cum cumque dolorum totam accusantium magni aperiam, facilis odio!
      </b-collapse>
    </div>
    <div class="row">
      <div class="col-12">
        <hr />
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <div>
          <b-badge href="#" variant="light-red">
            Filtro fake <i class="fal fa-times ml-2"></i>
          </b-badge>
          <b-badge href="#" variant="light-red">
            Filtro fake <i class="fal fa-times ml-2"></i>
          </b-badge>
          <b-badge href="#" variant="light-red">
            Filtro fake <i class="fal fa-times ml-2"></i>
          </b-badge>
          <b-badge href="#" variant="light-red">
            Filtro fake <i class="fal fa-times ml-2"></i>
          </b-badge>
          <b-badge href="#" variant="light-red">
            Filtro fake <i class="fal fa-times ml-2"></i>
          </b-badge>
          <b-badge href="#" variant="light-red">
            Filtro fake <i class="fal fa-times ml-2"></i>
          </b-badge>
        </div>
      </div>
    </div>
    <div class="row mt-5">
      <div class="col-12">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo,
        fuga, nesciunt culpa corrupti tenetur temporibus ut itaque deserunt
        exercitationem reiciendis cupiditate aliquam cumque qui accusantium rem
        ab pariatur quo
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.dropdown-menu) {
  box-shadow: 0 0.5rem 1rem rgb(0 0 0 / 15%) !important;
  min-width: 300px;
  max-height: 300px !important;
  overflow: scroll !important;
}
:deep(.dropdown-item:hover) {
  background: #fae4e8;
  color: var(--dark-red);
}
:deep(.dropdown.b-dropdown.show.btn-group) {
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 5px 5px 0 0;
}
:deep(.dropdown.b-dropdown.show.btn-group::after) {
  position: absolute;
  content: "";
  width: 100%;
  height: 10px;
  bottom: -2px;
  z-index: 99999;
  left: 0px;
  background: white;
}
:deep(.dropdown-menu.show) {
  transform: translate3d(0px, 34px, 0px) !important;
  left: -1px !important;
}

.badge {
  border-radius: 2rem !important;
  padding: 0.25em 1em;
  font-weight: normal;
}
</style>

<script>
import Dropdown from "../components/UI/Dropdown.vue";
import DropdownRange from "../components/UI/DropdownRange.vue";

import fakeData from "../assets/example.json";

export default {
  components: {
    Dropdown,
    DropdownRange,
  },
  data() {
    return {
      category: null,
      brands: null,
    };
  },

  created() {
    this.category = this.$route.params.category;
  },
  async fetch() {
    let data = fakeData;

    const brands = data.aggregations["agg-brand.keyword"].buckets
      .map((el) => {
        return {
          label: el.key,
          link: el.doc_count,
        };
      })
      .sort((a, b) => a.label.localeCompare(b.label));
    /* console.log(brands); */
    this.brands = brands;

    console.log(data.hits.hits, "SS");
    const testBrands = data.hits.hits.reduce((t, n) => {
      t[n.brand] ? t[n.brand]++ : (t[n.brand] = 1);
      return t;
    }, {});
    /* console.log(testBrands); */
  },
};
</script>
