<script>
import promoTagIcon from 'assets/svg/promo-tag.svg'
import lapelIcon from 'assets/svg/lapel.svg'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'CardLapel',
  props: {
    icon: {
      type: Object,
      default: () => promoTagIcon,
    },
    label: {
      type: String,
      default: '',
    },
    variant: {
      validator: prop => ['default', 'simple'].includes(prop),
      default: 'default',
    },
  },
  setup(props) {
    const getVariant = () => ({
      default: 'c-lapel',
      simple: 'c-lapel -simple',
    })[props.variant]
    return { lapelIcon, promoTagIcon, getVariant }
  },
}
</script>

<template>
  <div
    class="
      c-lapel cmw-relative cmw-flex cmw-items-center cmw-gap-1 cmw-px-2 cmw-bg-secondary-800 cmw-text-white cmw-h-$lapel-height
      before:(cmw-content-DEFAULT cmw-absolute cmw-top-0 cmw-left-$lapel-edge-left cmw-w-$lapel-edge-width cmw-h-$lapel-height)
      after:(cmw-content-DEFAULT cmw-absolute cmw-top-0 cmw-left-[calc(100%_-_1px)] cmw-w-$lapel-edge-width cmw-h-$lapel-height)
"
    :class="getVariant()"
  >
    <VueSvgIcon
      :data="icon"
      class="cmw-block !cmw-fill-white cmw-w-$lapel-swg-width"
      width="var(--lapel-swg-width)"
      height="auto"
    />
    <span
      class="c-lapel__label cmw-overline-2 cmw-font-medium cmw-uppercase"
      v-text="label || $t('product.promoLabel')"
    />
  </div>
</template>

<style scoped>
/* eslint disable */
.c-lapel {
  --lapel-height: 32px;
  --lapel-edge-width: 28px;
  --lapel-edge-left: -27px;
  --lapel-swg-width: 24px;
}

.c-lapel::before, .c-lapel::after {
  background-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIGlkPSJhYyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMjggMzIiPjxnIGlkPSJhZCI+PGcgaWQ9ImFlIj48cG9seWdvbiBpZD0iYWYiIHBvaW50cz0iNy44OSAwIC44OSA2IDEyLjAzIDYgNy44OSAwIiBzdHlsZT0iZmlsbDojMTAzMTJiOyBmaWxsLXJ1bGU6ZXZlbm9kZDsiLz48cGF0aCBpZD0iYWciIGQ9Im0yOCwzMmMtNC4xNywwLTcuOTMtMi40OC05LjUtNi4yOEw3Ljg5LDBoMjAuMTF2MzJaIiBzdHlsZT0iZmlsbDojMTM0YzQ1OyBmaWxsLXJ1bGU6ZXZlbm9kZDsiLz48L2c+PC9nPjwvc3ZnPg==");
  background-size: cover;
}

.c-lapel.-simple::before, .c-lapel.-simple::after {
  background-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIGlkPSJ0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyOCAzMiI+PGcgaWQ9InUiPjxnIGlkPSJ2Ij48cGF0aCBpZD0idyIgZD0ibTI4LDMyYy00LjE3LDAtNy45My0yLjQ4LTkuNS02LjI4TDcuODksMGgyMC4xMXYzMloiIHN0eWxlPSJmaWxsOiMxMzRjNDU7IGZpbGwtcnVsZTpldmVub2RkOyIvPjwvZz48L2c+PC9zdmc+");
}

.c-lapel::after {
  transform: scaleX(-1);
}
/* eslint enable */
</style>
