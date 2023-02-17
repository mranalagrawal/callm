<script>
import { ref } from '@nuxtjs/composition-api'
import closeIcon from '~/assets/svg/close.svg'
// noinspection ES6UnusedImports
import { isObject } from '~/utilities/validators'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'ProductBoxAward',
  props: {
    /** @Type: {AwardType.Award} */
    award: {
      required: true,
      validator(value) {
        return isObject(value)
      },
    },
  },
  setup() {
    const show = ref(false)
    const handleMouseEnter = () => show.value = true
    const handleMouseLeave = () => show.value = false

    const getAwardIcon = (id = 1) => ({
      1: 'vitae-ais',
      2: 'bibenda',
      3: 'espresso',
      4: 'veronelli',
      5: 'slowine',
      6: 'robert-parker',
      7: 'wine-spectator',
      8: 'james-suckling',
      9: 'gambero-rosso',
      10: 'wine-enthusiast',
      11: 'luca-maroni',
      14: 'decanter',
      15: 'antonio-galloni',
      20: 'hacette',
    })[id] || 'decanter'

    return { handleMouseEnter, handleMouseLeave, show, closeIcon, getAwardIcon }
  },
}
</script>

<template>
  <div
    class="cmw-font-sans cmw-text-body cmw-relative cmw-flex cmw-gap-1 cmw-items-center cmw-pr-1.5 cmw-cursor-help"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @touchstart.passive="handleMouseEnter"
    @touchstend.passive="handleMouseLeave"
  >
    <span class="cmw-text-gray-darkest cmw-font-light cmw-text-sm">{{ award.value }}</span>
    <!-- Note: Why we have award.type === 'icona' || award.type === 'numerico' ? -->
    <!-- Note: Why are we using number? we should have a unique code for awards es.(gambero-rosso) -->
    <!-- Note: Also, are these awards or guides? I see guida on Alkemy -->
    <VueSvgIcon
      :data="require(`@/assets/svg/awards/award-${getAwardIcon(award.id)}.svg`)"
      :title="`-@@-${award.id}-${award.title}`"
      width="20"
      height="20"
      class="cmw-text-gray cmw-font-light"
    />
    <!-- Note: With nuxt 3 we can use Vue3 Teleport component to place this tooltip on body or have a global tooltip -->
    <transition
      name="fadeFromTop"
      mode="out-in"
    >
      <div
        v-if="show"
        class="
        cmw-absolute cmw-w-max cmw-transform cmw-rounded-sm cmw-translate-x-0 cmw-translate-y-0
        cmw-bottom-full cmw-left-[-1rem] cmw-z-tooltip cmw-mb-2"
      >
        <div
          class="cmw-relative cmw-bg-gray-lightest cmw-rounded-sm cmw-py-3 cmw-pl-3 cmw-pr-8 cmw-shadow-lg cmw-text-xs
          before:(cmw-content-DEFAULT cmw-absolute cmw-w-0 cmw-h-0 cmw-bottom-[-0.5rem] cmw-left-2)
          before:(cmw-border-[0.5rem_0.75rem_0_0.75rem] cmw-border-transparent cmw-border-t-gray-lightest)"
        >
          <div
            class="cmw-font-bold cmw-my-1"
            v-text="$t('product.tooltip.guide', { guide: award.title })"
          />
          <div class=" cmw-my-1">
            {{ $t('product.tooltip.score', { value: award.value, maxValue: award.maxValue }) }}
          </div>
          <div class=" cmw-my-1">
            {{ $t('product.tooltip.year', { year: award.year }) }}
          </div>
          <div class=" cmw-mt-1">
            <i
              data-before="❝ "
              data-after=" ❞"
              class="before:(cmw-content-[attr(data-before)] cmw-text-primary) after:(cmw-content-[attr(data-after)] cmw-text-primary)"
            >{{ award.quote[$i18n.locale] }}</i>
          </div>
          <button class="cmw-absolute cmw-top-[-0.25rem] cmw-right-0 cmw-p-2 cmw-text-gray md:cmw-hidden" @click="handleMouseLeave">
            <VueSvgIcon :data="closeIcon" width="12" height="auto" />
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>
