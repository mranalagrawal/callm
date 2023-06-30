<script>
import { ref, useContext } from '@nuxtjs/composition-api'
import closeIcon from '~/assets/svg/close.svg'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'ProductBoxFeature',
  props: {
    feature: {
      required: true,
      validator: prop => ['favourite', 'isnew', 'isInPromotion', 'foreveryday', 'togift', 'unusualvariety', 'rarewine', 'artisanal', 'organic', 'topsale']
        .includes(prop),
    },
  },
  setup() {
    const { i18n } = useContext()
    const show = ref(false)
    const handleMouseEnter = () => show.value = true
    const handleMouseLeave = () => show.value = false

    // Note: if we align these features as ENUMS we could use them directly es. enums.feature.$ProdFeature,
    //  we also can have a better look to the tags property and see if they properly fit for these
    const getFeature = key => ({
      favourite: { icon: 'feature-cmw-favourite', iconColor: '!fill-primary', title: i18n.t('common.features.FAVOURITE') },
      isnew: { icon: 'feature-is-new', iconColor: '!fill-gray-dark', title: i18n.t('common.features.NEW') },
      isInPromotion: { icon: 'feature-in-promotion', iconColor: '!fill-gray-dark', title: i18n.t('common.features.IN_PROMOTION') },
      inpromotion: { icon: 'feature-in-promotion', iconColor: '!fill-gray-dark', title: i18n.t('common.features.IN_PROMOTION') },
      foreveryday: { icon: 'feature-for-everyday', iconColor: '!fill-gray-dark', title: i18n.t('common.features.FOR_EVERYDAY') },
      togift: { icon: 'feature-to-gift', iconColor: '!fill-gray-dark', title: i18n.t('common.features.TO_GIFT') },
      unusualvariety: { icon: 'feature-unusual-variety', iconColor: '!fill-gray-dark', title: i18n.t('common.features.UNUSUAL_VARIETY') },
      rarewine: { icon: 'feature-rare-wine', iconColor: '!fill-gray-dark', title: i18n.t('common.features.RARE_WINE') },
      artisanal: { icon: 'feature-artisanal', iconColor: '!fill-success', title: i18n.t('common.features.ARTISANAL') },
      organic: { icon: 'feature-organic', iconColor: '!fill-gray-dark', title: i18n.t('common.features.ORGANIC') },
      topsale: { icon: 'feature-best-seller', iconColor: '!fill-gray-dark', title: i18n.t('common.features.BEST_SELLER') },
    })[key]

    return { handleMouseEnter, handleMouseLeave, show, closeIcon, getFeature }
  },
}
</script>

<template>
  <div
    class="font-sans text-body relative flex items-center cursor-help"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @touchstart.passive="handleMouseEnter"
    @touchstend.passive="handleMouseLeave"
  >
    <VueSvgIcon
      :data="require(`@/assets/svg/${getFeature(feature).icon}.svg`)"
      class="block"
      :class="getFeature(feature).iconColor || 'fill-gray'"
      width="28"
      height="auto"
    />
    <!-- Todo: implement a global tooltip with options and arrow dynamically positioned -->
    <transition
      name="fadeFromRight"
      mode="out-in"
    >
      <div
        v-if="show"
        class="
        absolute w-max transform rounded-sm translate-x-0 -translate-y-1/2
        top-1/2 left-[110%] z-tooltip"
      >
        <div
          class="relative bg-gray-lightest border border-gray-lightest rounded-sm py-3 px-3 pr-8 shadow-lg text-xs
          before:(content-DEFAULT transform absolute w-0 h-0 top-1/2 left-0 translate-x-[-100%] -translate-y-1/2)
          before:(border-[0.75rem_0.5rem_0.75rem_0] border-transparent border-r-gray-lightest)"
        >
          <div
            class="font-bold my-1"
            v-text="getFeature(feature).title"
          />
          <button class="absolute top-[-0.25rem] right-0 p-2 text-gray md:hidden" @click="handleMouseLeave">
            <VueSvgIcon :data="closeIcon" width="18" height="auto" />
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>
