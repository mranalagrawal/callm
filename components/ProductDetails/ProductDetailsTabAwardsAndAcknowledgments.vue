<script lang="ts">
import type { PropType } from '@nuxtjs/composition-api'
import { defineComponent } from '@nuxtjs/composition-api'

import type { IProductMapped } from '~/types/product'
import { generateKey } from '~/utilities/strings'

export default defineComponent({
  props: {
    product: {
      type: Object as PropType<IProductMapped>,
      required: false,
    },
  },
  methods: { generateKey },
})
</script>

<template>
  <div class="mt-6">
    <table
      v-if="product?.awards.length > 0"
      class="w-full table table-striped"
    >
      <thead>
        <tr class="text-white cmw-font-light">
          <th scope="col" class="text-base bg-secondary cmw-font-light py-3 px-4 overline-2 uppercase text-left rounded-tl">
            {{ $t('product.guide') }}
          </th>
          <th scope="col" class="text-base bg-secondary cmw-font-light py-3 px-4 overline-2 uppercase">
            {{ $t('product.year') }}
          </th>

          <th scope="col" class="text-base bg-secondary cmw-font-light py-3 px-4 overline-2 uppercase">
            {{ $t('product.score') }}
          </th>

          <th scope="col" class="text-base bg-secondary cmw-font-light py-3 px-4 overline-2 uppercase text-left rounded-tr">
            {{ $t('product.quote') }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="award in product?.awards" :key="generateKey(`details-awards-${award.title}`)"
          class="odd:bg-gray-lightest"
        >
          <td scope="row" class="py-3 px-4">
            <strong>{{ award.title }}</strong>
          </td>
          <td class="text-center">
            {{ award.year }}
          </td>
          <td class="text-center">
            <strong>{{ award.value }}</strong> /
            {{ award.maxValue }}
          </td>
          <td class="py-3 px-4">
            <em v-text="award.quote" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
