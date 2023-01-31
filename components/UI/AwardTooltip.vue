<script>
export default {
  name: 'AwardTooltip',
  props: ['award'],
  data() {
    return {
      awards: [1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 14, 20],
    }
  },
  computed: {
    preview() {
      const locale = this.$i18n.locale
      return this.award[`name_${locale}`]
        ? this.award[`name_${locale}`]
          .split(' ')
          .map(el => el[0])
          .join('')
        : ''
    },
  },
}
</script>

<template>
  <div class="award-tooltip">
    {{ award.value }}

    <VueSvgIcon
      v-if="awards.includes(award.id)"
      :data="require(`@/assets/images/awards/${award.id}.svg`)"
      width="20"
      height="20"
    />
    <strong v-else>{{ preview }}</strong>

    <span class="award-tooltiptext px-2 shadow">
      <span class="cmw-block mb-0 font-weight-bold">{{ $t('product.tooltip.guide', { guide: award.title || award.name }) }}</span>
      <span class="cmw-block mb-0">{{ $t('product.tooltip.year', { year: award.year }) }}</span>
      <span class="cmw-block mb-0">{{ $t('product.tooltip.score', { value: award.value, maxValue: award.maxValue }) }}</span>
      <em v-if="award.quote">"{{ award.quote[$i18n.locale] }}"</em>
    </span>
  </div>
</template>

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
