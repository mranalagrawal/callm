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
    class="font-sans text-body relative flex gap-1 items-center pr-1.5 cursor-help"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @touchstart.passive="handleMouseEnter"
    @touchstend.passive="handleMouseLeave"
  >
    <span class="text-gray-darkest font-light text-sm">{{ award.value }}</span>
    <!-- Note: Why we have award.type === 'icona' || award.type === 'numerico' ? -->
    <!-- Note: Why are we using number? we should have a unique code for awards es.(gambero-rosso) -->
    <!-- Note: Also, are these awards or guides? I see guida on Alkemy -->
    <VueSvgIcon
      :data="require(`@/assets/svg/awards/award-${getAwardIcon(award.id)}.svg`)"
      :title="`-@@-${award.id}-${award.title}`"
      width="20"
      height="20"
      class="text-gray font-light"
    />
    <!-- Note: With nuxt 3 we can use Vue3 Teleport component to place this tooltip on body or have a global tooltip -->
    <transition
      name="fadeFromTop"
      mode="out-in"
    >
      <div
        v-if="show"
        class="
        absolute w-max transform rounded-sm translate-x-0 translate-y-0
        bottom-full left-[-1rem] z-tooltip mb-2"
      >
        <div
          class="relative bg-gray-lightest rounded-sm py-3 pl-3 pr-8 shadow-lg text-xs
          before:(content-DEFAULT absolute w-0 h-0 bottom-[-0.5rem] left-2)
          before:(border-[0.5rem_0.75rem_0_0.75rem] border-transparent border-t-gray-lightest)"
        >
          <div
            class="font-bold my-1"
            v-text="$t('product.tooltip.guide', { guide: award.title })"
          />
          <div class=" my-1">
            {{ $t('product.tooltip.score', { value: award.value, maxValue: award.maxValue }) }}
          </div>
          <div class=" my-1">
            {{ $t('product.tooltip.year', { year: award.year }) }}
          </div>
          <div class=" mt-1">
            <i
              data-before="❝ "
              data-after=" ❞"
              class="before:(content-[attr(data-before)] text-primary) after:(content-[attr(data-after)] text-primary)"
            >{{ award.quote[$i18n.locale] }}</i>
          </div>
          <button class="absolute top-[-0.25rem] right-0 p-2 text-gray md:hidden" @click="handleMouseLeave">
            <VueSvgIcon :data="closeIcon" width="18" height="auto" />
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>
