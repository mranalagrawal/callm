<template>
  <div class="w-100 d-block">
    <div
      class="btn d-flex w-100 justify-content-between px-0"
      @click="visible = !visible"
    >
      <span class="small text-dark-secondary text-uppercase">{{ label }}</span>
      <i
        class="fal fa-chevron-down text-light-secondary mr-3"
        :class="visible ? 'fa-rotate-180' : ''"
      ></i>
    </div>
    <div v-if="visible" class="content mb-5">
      <div
        v-for="item in selections"
        :key="item.key_as_string"
        class="text-left"
        @click="goto(item)"
      >
        <div
          class="content-item p-2 d-flex justify-content-between align-items-center pointer"
          :class="item.key[0] == active ? 'active' : ''"
        >
          <!-- {{ item }} -->
          <div>
            <!-- <img
              :src="`../../assets/images/selections/favourite.svg`"
              class="selection-svg"
            /> -->
            <img
              :src="require(`@/assets/images/selections/${item.key[1]}.svg`)"
              class="selection-svg"
            />
            <span>{{ $t(`selections.${item.key[1]}`) }}</span>
            <span class="text-muted">({{ item.doc_count }})</span>
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
      visible: false,

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
  filter: brightness(0) opacity(0.4);
  width: 36px;
}

.content-item {
  font-size: 14px;
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
