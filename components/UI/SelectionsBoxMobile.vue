<template>
  <div class="w-100 d-block">
    <div class="row">
      <div
        v-for="item in selections"
        :key="item.key_as_string"
        class="col-6 mb-3"
        @click="goto(item)"
      >
        <div
          class="card align-items-center justify-content-around py-3 shadow"
          style="height: 120px"
        >
          <div class="text-center">
            <VueSvgIcon
              :src="require(`@/assets/svg/selections/${item.key[1]}.svg`)"
              class="selection-svg mx-auto d-block"
            />
            <div>
              <span class="small">{{ $t(`selections.${item.key[1]}`) }}</span>
              <br />
              <span class="small text-muted">({{ item.doc_count }})</span>
            </div>
          </div>
        </div>
        <!-- <p>debug: {{ item.key_as_string }}</p> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["label", "items", "keyword", "search"],
  data() {
    return {
      allSelections: [
        "favourite",
        "artisanal",
        "isnew",
        "inpromotion",
        "topsale",
        "foreveryday",
        "organic",
        "togift",
        "unusualvariety",
        "rarewine",
      ],
    };
  },
  /* mounted() {
    const aggregations = this.search.aggregations;

    const selectionsListMapped = [];
    this.allSelections.forEach((el) => {
      let tmp = aggregations[`agg-${el}`][`agg-${el}`].buckets.find(
        (el) => el.key == 1
      );

      if (tmp) {
        tmp.key = [Boolean(tmp.key), el];
        tmp.key_as_string = el;
        selectionsListMapped.push(tmp);
      }
    });

    this.selections = selectionsListMapped;

  },
 */
  computed: {
    active() {
      return this.$route.query[this.keyword];
    },
    selections() {
      const aggregations = JSON.parse(JSON.stringify(this.search.aggregations));

      const selectionsListMapped = [];
      this.allSelections.forEach((el) => {
        let tmp = aggregations[`agg-${el}`][`agg-${el}`].buckets.find(
          (el) => el.key == 1
        );

        if (tmp) {
          tmp.key = [Boolean(tmp.key), el];
          tmp.key_as_string = el;
          selectionsListMapped.push(tmp);
        }
      });

      return selectionsListMapped;
    },
  },
  methods: {
    goto(id) {
      const query = Object.assign({}, this.$route.query);

      let activeFilter = Object.keys(query).filter((el) =>
        this.allSelections.includes(el)
      )[0];

      // switch active filter
      /* if (activeFilter) {
        delete query[activeFilter];
      } */
      query[id.key_as_string] = true;

      if (id !== this.active) query["page"] = 1;

      this.$router.push({
        path: "catalog",
        query: query,
      });
    },
  },
};
</script>

<style scoped>
.selection-svg {
  filter: brightness(0.7);
  width: 36px;
}

.content-item:hover {
  background: #fae4e8;
  color: var(--dark-secondary);
}
.active {
  background: #fae4e8;
  color: var(--dark-secondary);
}
</style>
