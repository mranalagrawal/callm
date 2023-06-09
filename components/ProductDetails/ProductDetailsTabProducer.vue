<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import favouriteIcon from '~/assets/svg/selections/favourite.svg'

export default defineComponent({
  props: {
    brand: {
      type: Object,
      required: false,
    },
    brandMetaFields: {
      type: Object,
      required: false,
    },
  },
  setup() {
    return { favouriteIcon }
  },
})
</script>

<template>
  <div class="cmw-mt-6">
    <div v-if="brand">
      <div v-if="brandMetaFields.isPartner" class="ribbon cmw-flex cmw-items-center">
        <!-- TODO: This will use the new lapel component -->
        <VueSvgIcon
          :data="favouriteIcon"
          class="svg-favourite"
          width="20" height="auto"
        />
        <span class="small !cmw-top-0">{{
          $t('product.recommendedByCallmewine')
        }}</span>
      </div>
      <h3 class="cmw-text-primary-400">
        {{ brand.title }}
      </h3>
      <div class="row">
        <div class="col-12 col-md-8">
          <div class="row py-3 bg-light">
            <div class="col-6 font-weight-bold">
              {{ $t('product.mainWines') }}
            </div>
            <div class="col-6" />
          </div>
          <div class="row py-3">
            <div class="col-6 font-weight-bold">
              {{ $t('product.foundation') }}
            </div>
            <div class="col-6">
              {{ brandMetaFields.year }}
            </div>
          </div>
          <div class="row py-3 bg-light">
            <div class="col-6 font-weight-bold">
              {{ $t('product.vineyardHectares') }}
            </div>
            <div class="col-6">
              {{ brandMetaFields.hectares }}
            </div>
          </div>
          <div class="row py-3">
            <div class="col-6 font-weight-bold">
              {{ $t('product.ownGrapes') }}
            </div>
            <div class="col-6">
              {{ brandMetaFields.ownedGrapes }} %
            </div>
          </div>
          <div class="row py-3 bg-light">
            <div class="col-6 font-weight-bold">
              {{ $t('product.annualProduction') }}
            </div>
            <div class="col-6">
              {{ brandMetaFields.annualProduction }}
            </div>
          </div>
          <div class="row py-3">
            <div class="col-6 font-weight-bold">
              {{ $t('product.winemaker') }}
            </div>
            <div class="col-6" />
          </div>
          <div class="row py-3 bg-light">
            <div class="col-6 font-weight-bold">
              {{ $t('product.address') }}
            </div>
            <div class="col-6">
              {{ brandMetaFields.address }}
            </div>
          </div>
        </div>
        <div class="col-12 col-md-4">
          <img :src="brand.image.url" alt="">
        </div>
      </div>
      <!-- <img :src="search.image.url" alt="" />
      <div v-html="search.contentHtml"></div> -->
    </div>
  </div>
</template>
