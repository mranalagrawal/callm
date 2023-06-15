<script lang="ts">
import type { PropType } from '@nuxtjs/composition-api'
import { computed, defineComponent } from '@nuxtjs/composition-api'
import type { IProductMapped } from '~/types/product'
import { getUniqueListBy } from '~/utilities/arrays'
import { generateKey } from '~/utilities/strings'

export default defineComponent({
  props: {
    product: {
      type: Object as PropType<IProductMapped>,
      required: false,
    },
    productDetails: {
      type: Object,
      required: false,
    },
  },
  setup(props) {
    const productDetailsAwards = computed(() => props.productDetails && getUniqueListBy(props.productDetails.awards, 'id'))
    return { productDetailsAwards }
  },
  methods: { generateKey },
})
</script>

<template>
  <div class="mt-6">
    <table
      v-if="productDetails.awards.length > 0"
      class="table table-striped"
    >
      <thead>
        <tr class="bg-dark-primary text-white">
          <th style="border-radius: 15px 0 0 0" scope="col">
            {{ $t('product.guide') }}
          </th>
          <th style="" scope="col">
            {{ $t('product.year') }}
          </th>

          <th style="" scope="col">
            {{ $t('product.score') }}
          </th>

          <th style="border-radius: 0px 15px 0px 0px" scope="col">
            {{ $t('product.quote') }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(award) in productDetailsAwards" :key="generateKey(`details-awards-${award.title}`)">
          <td scope="row">
            <strong>{{ award.title }}</strong>
          </td>
          <td>{{ award.year }}</td>
          <td>
            <strong>{{ award.value }}</strong> /
            {{ award.maxValue }}
          </td>
          <td>
            <em>
              {{ award.quote[$i18n.locale] }}
            </em>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
