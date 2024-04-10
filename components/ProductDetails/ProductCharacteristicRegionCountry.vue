<script lang="ts">
import { defineComponent, inject } from '@nuxtjs/composition-api'

import i18n from '~/plugins/i18n'

export default defineComponent({
  name: 'ProductCharacteristicRegionCountry',
  setup() {
    const { region, country } = inject('productCharacteristics') as { region: any; country: any }

    return {
      region,
      country,
    }
  },
  methods: { i18n },
})
</script>

<template>
  <div v-if="region?.name?.[$i18n.locale] || country?.name?.[$i18n.locale]">
    <h3 class="text-sm mb-0" v-text="$t(`product.regionCountry`)" />
    <div class="text-sm mb-4">
      <component
        :is="(region?.slug?.[$i18n.locale]) ? 'NuxtLink' : 'span'"
        v-if="region?.name?.[$i18n.locale]"
        :to="region?.slug?.[$i18n.locale] ? localePath(`/${region.slug[$i18n.locale]}`) : null"
      >
        {{ region.name[$i18n.locale] }}
      </component>
      <template v-if="country?.name?.[$i18n.locale]">
        (
        <component
          :is="(country?.slug?.[$i18n.locale]) ? 'NuxtLink' : 'span'"
          v-if="country?.name?.[$i18n.locale]"
          :to="country?.slug?.[$i18n.locale] ? localePath(`/${country.slug[$i18n.locale]}`) : null"
        >
          {{ country.name[$i18n.locale] }}
        </component>
        )
      </template>
    </div>
  </div>
</template>

<style scoped>
a {
  color: theme('colors.primary.400');
}
</style>
