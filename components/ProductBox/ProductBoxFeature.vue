<script>
import { ref, useContext } from '@nuxtjs/composition-api'
import closeIcon from '~/assets/svg/close.svg'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'ProductBoxFeature',
  props: {
    feature: {
      required: true,
      validator: prop => ['favourite', 'isnew', 'inpromotion', 'foreveryday', 'togift', 'unusualvariety', 'rarewine', 'artisanal', 'organic', 'topsale']
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
      favourite: { icon: 'feature-cmw-favourite', title: i18n.t('common.features.FAVOURITE') },
      isnew: { icon: 'feature-is-new', title: i18n.t('common.features.NEW') },
      inpromotion: { icon: 'feature-in-promotion', title: i18n.t('common.features.IN_PROMOTION') },
      foreveryday: { icon: 'feature-for-everyday', title: i18n.t('common.features.FOR_EVERYDAY') },
      togift: { icon: 'feature-to-gift', title: i18n.t('common.features.TO_GIFT') },
      unusualvariety: { icon: 'feature-unusual-variety', title: i18n.t('common.features.UNUSUAL_VARIETY') },
      rarewine: { icon: 'feature-rare-wine', title: i18n.t('common.features.RARE_WINE') },
      artisanal: { icon: 'feature-artisanal', title: i18n.t('common.features.ARTISANAL') },
      organic: { icon: 'feature-organic', title: i18n.t('common.features.ORGANIC') },
      topsale: { icon: 'feature-best-seller', title: i18n.t('common.features.BEST_SELLER') },
    })[key]

    return { handleMouseEnter, handleMouseLeave, show, closeIcon, getFeature }
  },
}
</script>

<template>
  <div
    class="cmw-font-sans cmw-text-body cmw-relative cmw-flex cmw-items-center cmw-cursor-help"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @touchstart.passive="handleMouseEnter"
    @touchstend.passive="handleMouseLeave"
  >
    <VueSvgIcon
      :data="require(`@/assets/svg/${getFeature(feature).icon}.svg`)"
      class="cmw-block !cmw-fill-gray"
      :class="feature === 'favourite' ? '!cmw-fill-primary' : '!cmw-fill-gray-dark'"
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
        cmw-absolute cmw-w-max cmw-transform cmw-rounded-sm cmw-translate-x-0 cmw-translate-y-[-50%]
        cmw-top-1/2 cmw-left-[110%] cmw-z-tooltip"
      >
        <div
          class="cmw-relative cmw-bg-gray-lightest cmw-border cmw-border-gray-lightest cmw-rounded-sm cmw-py-3 cmw-px-3 cmw-pr-8 cmw-shadow-lg cmw-text-xs
          before:(cmw-content-DEFAULT cmw-transform cmw-absolute cmw-w-0 cmw-h-0 cmw-top-1/2 cmw-left-0 cmw-translate-x-[-100%] cmw-translate-y-[-50%])
          before:(cmw-border-[0.75rem_0.5rem_0.75rem_0] cmw-border-transparent cmw-border-r-gray-lightest)"
        >
          <div
            class="cmw-font-bold cmw-my-1"
            v-text="getFeature(feature).title"
          />
          <button class="cmw-absolute cmw-top-[-0.25rem] cmw-right-0 cmw-p-2 cmw-text-gray md:cmw-hidden" @click="handleMouseLeave">
            <VueSvgIcon :data="closeIcon" width="12" height="auto" />
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>
