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
        ab pariatur quos. Iure fuga possimus porro itaque maiores? Ut eligendi,
        odio possimus iste sed est, inventore pariatur quis dolor officiis
        perferendis. Velit consequuntur sit quis quam voluptate facere
        voluptatum natus, molestiae deleniti veniam debitis error nesciunt.
        Illum sit minus velit repellendus, voluptatem laudantium excepturi,
        architecto dolor vel magni repellat obcaecati necessitatibus.
        Perspiciatis, sunt minus! Unde assumenda excepturi, deleniti qui culpa
        maxime maiores consequuntur. Eveniet quia illum, voluptatem molestias
        vero aspernatur vel. Voluptatem soluta tempora eos sunt voluptatibus!
        Perferendis architecto quidem tempore libero, harum quas. Quibusdam
        itaque praesentium vitae beatae, harum eius quae vel eum repellat
        laudantium neque, similique ducimus iste, quos molestias provident
        reprehenderit accusamus? Sequi commodi dicta non saepe id minima ea eum,
        rerum, hic quidem blanditiis dolor odit neque. Vitae, aspernatur
        doloribus, ipsa culpa praesentium beatae nobis ipsam odit debitis natus
        blanditiis odio aliquid! Sunt minima impedit tenetur explicabo
        molestiae! Iusto soluta assumenda sunt iste rem molestiae, quae
        inventore repellat natus iure adipisci nisi eveniet delectus voluptatem,
        fugit explicabo cum autem quisquam. Porro a excepturi reiciendis
        laudantium nemo? Itaque exercitationem reprehenderit sunt ipsum pariatur
        tempora eum adipisci, veritatis iusto quasi natus quas odio mollitia
        recusandae fugiat facere quae amet obcaecati! Incidunt rerum, voluptate
        expedita vel hic quia aliquam ipsum saepe fuga, dolor cumque. Labore
        incidunt repudiandae numquam dignissimos dicta magnam aut accusamus
        eveniet minus, assumenda, nesciunt pariatur saepe repellendus ratione,
        mollitia nemo iusto! Quo porro corrupti maxime illo distinctio molestias
        labore quos, tenetur iste quod maiores, fuga blanditiis ipsam at animi
        architecto optio! Possimus, quam cumque mollitia corporis ex optio, amet
        debitis accusamus quaerat ut voluptatibus? Quibusdam quod nisi non
        dolorum laborum fugiat quia blanditiis quaerat iusto, quis, qui id
        voluptatem, laboriosam ullam nulla ipsam. Itaque facilis similique
        tempore error, labore voluptates quae, quo ad saepe libero accusantium
        porro quidem amet excepturi harum iure obcaecati necessitatibus
        consequuntur aperiam atque hic. Possimus eligendi rerum sint, ex eaque
        at, eos id ducimus nobis assumenda fuga quo exercitationem! At sunt
        blanditiis omnis temporibus repudiandae ipsa quas, natus reprehenderit
        perferendis, quam laudantium praesentium possimus rem ipsum suscipit
        officia facere minus totam, nulla corporis optio nisi eius. Facilis et
        nisi harum quasi, modi in eum expedita reiciendis quaerat unde aliquam,
        corporis aspernatur amet mollitia! Ipsum provident rerum temporibus
        suscipit earum nisi fugit tempore dolores minus magni facilis, possimus
        tenetur excepturi porro eligendi vero dolorem corrupti ex in sint
        laudantium repellat dignissimos inventore pariatur! Sapiente tempora
        maiores culpa illo voluptatibus natus laudantium facere ea eligendi
        ipsum, doloribus dolore esse illum quidem nisi, tempore quisquam
        excepturi recusandae blanditiis! Modi, quas aspernatur hic optio
        dignissimos, distinctio enim laboriosam numquam quidem perferendis
        repellat nisi unde neque deleniti natus ex vel veniam laborum dolorem
        assumenda vero magnam? Deleniti ullam eius quidem aperiam! Nam sint
        quidem animi saepe culpa ipsam vitae et debitis. Possimus vel porro
        totam assumenda. Nesciunt eligendi dolores nam temporibus ipsam aliquam
        delectus maiores quaerat voluptates. Accusamus, numquam libero!
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.dropdown-menu) {
  box-shadow: 0 0.5rem 1rem rgb(0 0 0 / 15%) !important;
  min-width: 250px;
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
export default {
  components: {
    Dropdown,
    DropdownRange,
  },
  data() {
    return {
      category: null,
    };
  },

  created() {
    this.category = this.$route.params.category;
  },
};
</script>
