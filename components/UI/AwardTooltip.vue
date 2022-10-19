<template>
  <div class="award-tooltip">
    {{ award.value }}

    <img
      v-if="this.awards.includes(award.id)"
      :src="require(`@/assets/images/awards/${award.id}.svg`)"
      alt=""
      class="award-img"
    />
    <strong v-else>{{ preview }}</strong>

    <span class="award-tooltiptext px-2 shadow">
      <p class="mb-0 font-weight-bold">Guida {{ award.title || award.name }}</p>
      <p class="mb-0">Annata {{ award.year }}</p>
      <p class="mb-0">Punteggio {{ award.value }} su {{ award.maxValue }}</p>
      <em v-if="award.quote">"{{ award.quote }}"</em>
    </span>
  </div>
</template>

<script>
export default {
  name: "AwardTooltip",
  props: ["award"],
  data() {
    return {
      awards: [1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 14, 20],
    };
  },
  computed: {
    preview() {
      return this.award.title
        ? this.award.title
            .split(" ")
            .map((el) => el[0])
            .join("")
        : this.award.name
            .split(" ")
            .map((el) => el[0])
            .join("");
    },
  },
};
</script>
<style scoped>
.award-img {
  filter: brightness(0);
  width: 20px;
}

.award-tooltip {
  position: relative;
  display: inline-block;
  font-size: 12px;
  cursor: pointer;
}

.award-tooltip .award-tooltiptext {
  display: none;
  background-color: white;
  padding: 5px 0;
  position: absolute;
  z-index: 1;
  width: 220px;
  bottom: 180%;
  left: 0;
  border-radius: 10px;
}

.award-tooltip .award-tooltiptext::after {
  content: "";
  position: absolute;
  bottom: -10px;
  left: 10px;
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;

  border-top: 10px solid #fff;
}

.award-tooltip:hover .award-tooltiptext {
  display: block;
}
</style>
