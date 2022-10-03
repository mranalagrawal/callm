<template>
  <div class="mt-5">
    <product v-if="product" :product="product" />
    <filter-page
      v-if="winelist || categories || region || dosage || selections"
      :winelist="winelist"
      :categories="categories"
      :region="region"
      :dosage="dosage"
      :selections="selections"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      product: null,
      winelist: null,
      categories: null,
      region: null,
      dosage: null,
      selections: null,
    };
  },
  created() {
    const path = this.$route.path;
    console.log(this.$route, "this.$route");
    // check if product page
    const isProduct = /[P][0-9]+/;
    if (isProduct.test(path)) {
      this.product = "P" + this.$route.path.split("-P")[1];
      return;
    }

    // rules
    const filters = [
      { name: "winelist", rule: /[V][0-9]+/ },
      { name: "categories", rule: /[C][0-9]+/ },
      { name: "region", rule: /[R][0-9]+/ },
      { name: "dosage", rule: /[D][0-9]+/ },
      { name: "selections", rule: null },
    ];

    // loop and assign, MUST BE this way
    filters.forEach((el) => {
      if (el.name != "selections" && path.match(el.rule)) {
        this[el.name] = path.match(el.rule)[0].substring(1);
      }
      if (el.name == "selections") {
        if (this.$route.fullPath.split("?sel=")[1]) {
          this.selections = this.$route.fullPath.split("?sel=")[1];
        }
      }
    });

    console.clear();

    /* this.$router.push("/search"); */

    const noFilterInURL = filters
      .filter((el) => el.rule !== null)
      .every((el) => !el.rule.test(path));

    const noSelection = !this.$route.fullPath.split("?sel=")[1];

    if (noFilterInURL && noSelection) this.$router.push("/search");
    // if no filter AND no selection, redirect to search
    /* if (
      filters
        .filter((el) => el.rule !== null)
        .every((el) => !el.rule.test(path)) &&
      this.$route.fullPath.split("?sel=")[1]
    ) {
      this.$router.push("/search");
    } */
  },
};
</script>

<style scoped></style>
