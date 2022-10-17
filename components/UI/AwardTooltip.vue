<template>
  <div class="award-tooltip">
    {{ award.value }} <strong>{{ preview }}</strong>
    <!-- {{ award.id }} -->

    <span class="award-tooltiptext px-2 shadow">
      <p class="mb-0 font-weight-bold">Guida {{ award.title }}</p>
      <p class="mb-0">Annata {{ award.year }}</p>
      <p class="mb-0">Punteggio {{ award.value }} su {{ award.maxValue }}</p>
      <em v-if="award.quote">"{{ award.quote }}"</em>
      <!-- {{ award }} -->
    </span>
  </div>
</template>

<script>
export default {
  name: "AwardTooltip",
  props: ["award"],
  computed: {
    preview() {
      return this.award.title
        .split(" ")
        .map((el) => el[0])
        .join("");
    },
    imagePath() {
      return require(`../../assets/images/awards/${1}.svg`);
    },
  },
};
</script>
<style scoped>
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
