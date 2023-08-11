<script lang="ts">
import type { PropType } from '@nuxtjs/composition-api'
import {
  computed,
  defineComponent,
} from '@nuxtjs/composition-api'
import closeIcon from '~/assets/svg/close.svg'
// import plusIcon from 'assets/svg/plus.svg'

// interface Query {
//   [key: string]: string | undefined
// }

interface IViews {
  key: string
  name: string
  field: string
}

/* interface IFilters {
  winelists: []
  pairings: []
  dosagecontents: []
  bodystyles: []
  boxes: []
  areas: []
  provenience: []
  awards: []
  agings: []
  philosophies: []
} */

export default defineComponent({
  props: {
    inputParameters: {
      type: Object as PropType<Record<string, any>>,
      required: false,
    },
    view: {
      type: Object as PropType<Record<string, any>>,
      required: false,
    },
  },
  emits: ['remove-selection-from-query', 'reset-filter'],
  setup(props, { emit }) {
    const allSelections = [
      'artisanal',
      'exclusive',
      'favourite',
      'foreveryday',
      'inpromotion',
      'isnew',
      'organic',
      'rarewine',
      'togift',
      'topsale',
      'unusualvariety',
    ]

    const activeSelections = computed<string[] | undefined>(() => {
      if (!props.inputParameters)
        return

      return Object.keys(props.inputParameters).filter(el =>
        allSelections.includes(el),
      )
    })

    const mappedViews = computed<IViews[] | []>(() => {
      if (props.view && !Object.keys(props.view).length)
        return []

      const viewValues = Object.values(props.view as Record<string, any>)

      return viewValues.filter(el => el !== null)
    })

    const removeSelectionFromQuery = (selection: string) => {
      emit('remove-selection-from-query', selection)
    }

    const resetFilter = () => {
      emit('reset-filter')
    }

    return {
      activeSelections,
      closeIcon,
      mappedViews,
      removeSelectionFromQuery,
      resetFilter,
    }
  },
})
</script>

<template>
  <div class="flex justify-between items-center">
    <div>
      <div
        v-if="(!!activeSelections?.length) || !!mappedViews.length"
      >
        <div v-if="!!activeSelections?.length || !!mappedViews.length" class="my-4 flex gap-2">
          <!-- selections -->
          <template v-if="!!activeSelections?.length">
            <CmwChip
              v-for="item in activeSelections" :key="item" size="xs"
              :label="$t(`common.features.${item}`)" :on-delete="() => removeSelectionFromQuery(item)"
            />
          </template>
          <!-- other filters -->
          <template v-if="!!mappedViews.length">
            <CmwChip
              v-for="(item) in mappedViews" :key="item.name" size="xs"
              :label="item.name" :on-delete="() => removeSelectionFromQuery(item.field)"
            />
          </template>
        </div>
      </div>
    </div>
    <div v-if="!!activeSelections?.length || Object.values(view).some(v => v !== null)">
      <Button
        variant="text"
        size="sm"
        class=""
        @click.native="resetFilter"
      >
        <span class="text-body flex items-center gap-1">
          <VueSvgIcon :data="closeIcon" width="14" height="14" />
          {{ $t('search.removeAll') }}</span>
      </Button>
    </div>
  </div>
</template>
