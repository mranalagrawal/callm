<template>
  <div class="container-fluid px-md-5">
    <div class="row">
      <div class="col-12">
        <button v-if="winelist" class="btn btn-dark-red">{{ winelist }}</button>
      </div>
    </div>
    <div class="row">
      <div class="col-12 col-md-3">
        <!-- <p>Winelist: {{ winelist }}</p>
        <p>Category: {{ categories }}</p>
        <p>Region: {{ region }}</p>
        <p>Dosage: {{ dosage }}</p>
        <p>Selections: {{ selections }}</p> -->

        <div v-if="allCategories">
          <dropdown-filter
            label="Categories"
            :items="allCategories"
            keyword="C"
          />
        </div>
        <div v-if="allWinelists">
          <dropdown-filter label="Winelist" :items="allWinelists" keyword="V" />
        </div>
      </div>
      <div class="col-12 col-md-9">
        <div v-for="(hit, i) in hits" :key="i">
          {{ hit._source.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* 
const activeFilters = {
  category : {
    id: "C5",
    slug : "vini-rossi"
  },
  winelist : {
    id: "V7",
    slug : "barolo"
  }
}

url = "vini-rossi" + 'barolo' + ".htm" + "C5" + "V7" */

import DropdownFilter from "./UI/DropdownFilter.vue";

const slugify = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

export default {
  components: { DropdownFilter },
  props: ["winelist", "categories", "region", "dosage", "selections"],
  data() {
    return {
      search: null,
      hits: null,
      allWinelists: null,
      allCategories: null,
    };
  },
  async fetch() {
    /* this.loading = true; */

    // ho i filtri come props

    // in base a ciò che arriva da _handle, che controlla l'url, faccio partire query
    let query = "https://callmewine-api.dojo.sh/api/products/search?";
    if (this.winelist) query += "&winelists=" + this.winelist;
    if (this.categories) query += "&categories=" + this.categories;
    if (this.region) query += "&regions=" + this.region;
    if (this.dosage) query += "&dosagecontent=" + "Dry";
    console.clear();
    console.log(query, "query");

    /* console.log("nofitlers");
    const searchResult = await fetch(
      "https://callmewine-api.dojo.sh/api/products/search?"
    ); */

    const searchResult = await fetch(query);

    const search = await searchResult.json();
    this.search = search;
    this.hits = search.hits.hits;

    console.log(search);

    const winelists = search.aggregations["agg-winelists"]["inner"]["result"][
      "buckets"
    ].map((el) => {
      return {
        key: el.key,
        name: el.name.buckets[0].key,
        count: el.doc_count,
        slug: slugify(el.name.buckets[0].key),
      };
    });
    this.allWinelists = winelists;

    const categories = search.aggregations["agg-categories"]["inner"]["result"][
      "buckets"
    ].map((el) => {
      return {
        key: el.key,
        name: el.name.buckets[0].key,
        count: el.doc_count,
        slug: slugify(el.name.buckets[0].key),
      };
    });
    this.allCategories = categories;
  },
};
</script>
