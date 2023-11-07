<script lang="ts">
import { computed, defineComponent, ref, useContext, useFetch } from '@nuxtjs/composition-api'
import metaobject from '~/graphql/queries/metaobject.graphql'
import type { ICollection } from '~/types/collection'
import { initialCollectionData } from '~/types/collection'
import type { ObjType, TImage } from '~/types/types'

export interface IEventDay {
  key: string
  reference: {
    product: {
      reference: ObjType<KeyType> // IProductMapped
    }
    date: { value: string }
    description: { value: string }
    image: { reference: { image: TImage } }
    title: { value: string }
    type: { value: string }
  }
}

export default defineComponent({
  middleware({ $cmwStore, $dayjs, localeRoute, redirect, error }) {
    if (!($cmwStore.isIt || $cmwStore.isB2b)) {
      return redirect(localeRoute('/') as unknown as string)
    }

    const endDate = $dayjs('2023-12-31')

    if ($dayjs().isAfter(endDate)) {
      return error({ statusCode: 410, message: 'Resource is gone.' })
    }
  },
  setup() {
    const { i18n, $dayjs, $cmwStore } = useContext()
    const metaObjectRef = ref<any>([])
    const currentDay = ref($dayjs().get('D'))
    const currentEventDay = ref<number>(0)
    const currentEvent = ref<IEventDay | undefined>(undefined)
    const date = ref($dayjs().format('YYYY-MM-DD'))
    const collectionRef = ref<ICollection>(initialCollectionData)

    useFetch(async ({ $graphql, $cmwRepo }) => {
      metaObjectRef.value = await $graphql.default.request(metaobject, {
        lang: i18n.locale.toUpperCase(),
        handle: {
          handle: 'advent-calendar-2023',
          type: 'advent_calendar',
        },
      })

      collectionRef.value = await $cmwRepo.products.getCollectionsByHandle({ handle: 'calendario-avvento' })
    })

    const eventDays = computed<IEventDay[]>(() => metaObjectRef.value?.metaobject?.fields || [])

    const eventClasses = computed(() => ({
      'day-01': {
        cursor: currentDay.value >= 1 ? 'cursor-pointer' : 'cursor-default',
        translate: currentEvent.value ? 'translate(-50 -200)' : 'translate(0 0)',
        bg: '#b60101',
        circle: currentDay.value >= 1 ? 'white' : 'none',
        number: currentDay.value >= 1 ? '#b60101' : 'none',
      },
      'day-02': {
        cursor: currentDay.value >= 2 ? 'cursor-pointer' : 'cursor-default',
        translate: currentEvent.value ? 'translate(-500 0)' : 'translate(0 0)',
        bg: '#b60101',
        circle: currentDay.value >= 2 ? 'white' : 'none',
        number: currentDay.value >= 2 ? '#b60101' : 'none',
      },
      'day-03': {
        cursor: currentDay.value >= 3 ? 'cursor-pointer' : 'cursor-default',
        translate: currentEvent.value ? 'translate(-500 0)' : 'translate(0 0)',
        bg: '#c63f63',
        circle: currentDay.value >= 3 ? 'white' : 'none',
        number: currentDay.value >= 3 ? '#c63f63' : 'none',
      },
      'day-04': {
        cursor: currentDay.value >= 4 ? 'cursor-pointer' : 'cursor-default',
        translate: currentEvent.value ? 'translate(-500 0)' : 'translate(0 0)',
        bg: '#c63f63',
        circle: currentDay.value >= 4 ? 'white' : 'none',
        number: currentDay.value >= 4 ? '#c63f63' : 'none',
      },
      'day-05': {
        cursor: currentDay.value >= 5 ? 'cursor-pointer' : 'cursor-default',
        translate: currentEvent.value ? 'translate(500 50) rotate(20)' : 'translate(0 0)',
        bg: '#9a2645',
        circle: currentDay.value >= 5 ? 'white' : 'none',
        number: currentDay.value >= 5 ? '#9a2645' : 'none',
      },
      'day-06': {
        cursor: currentDay.value >= 6 ? 'cursor-pointer' : 'cursor-default',
        translate: currentEvent.value ? 'translate(-500 0)' : 'translate(0 0)',
        bg: '#7b0404',
        circle: currentDay.value >= 6 ? 'white' : 'none',
        number: currentDay.value >= 6 ? '#7b0404' : 'none',
      },
      'day-07': {
        cursor: currentDay.value >= 7 ? 'cursor-pointer' : 'cursor-default',
        translate: currentEvent.value ? 'translate(-500 0)' : 'translate(0 0)',
        bg: '#7b0404',
        circle: currentDay.value >= 7 ? 'white' : 'none',
        number: currentDay.value >= 7 ? '#7b0404' : 'none',
      },
      'day-08': {
        cursor: currentDay.value >= 8 ? 'cursor-pointer' : 'cursor-default',
        translate: currentEvent.value ? 'translate(0 -400)' : 'translate(0 0)',
        bg: '#7b0404',
        circle: currentDay.value >= 8 ? 'white' : 'none',
        number: currentDay.value >= 8 ? '#7b0404' : 'none',
      },
      'day-09': {
        cursor: currentDay.value >= 9 ? 'cursor-pointer' : 'cursor-default',
        translate: currentEvent.value ? 'translate(-500 0)' : 'translate(0 0)',
        bg: '#9a2645',
        circle: currentDay.value >= 9 ? 'white' : 'none',
        number: currentDay.value >= 9 ? '#9a2645' : 'none',
      },
      'day-10': {
        cursor: currentDay.value >= 10 ? 'cursor-pointer' : 'cursor-default',
        translate: currentEvent.value ? 'translate(-500 -100) rotate(30)' : 'translate(0 0)',
        bg: '#c63f63',
        circle: currentDay.value >= 10 ? 'white' : 'none',
        number: currentDay.value >= 10 ? '#c63f63' : 'none',
      },
      'day-11': {
        cursor: currentDay.value >= 11 ? 'cursor-pointer' : 'cursor-default',
        translate: currentEvent.value ? 'translate(-500 0)' : 'translate(0 0)',
        bg: '#b60101',
        circle: currentDay.value >= 11 ? 'white' : 'none',
        number: currentDay.value >= 11 ? '#b60101' : 'none',
      },
      'day-12': {
        cursor: currentDay.value >= 12 ? 'cursor-pointer' : 'cursor-default',
        translate: currentEvent.value ? 'translate(-500 0)' : 'translate(0 0)',
        bg: '#9a2645',
        circle: currentDay.value >= 12 ? 'white' : 'none',
        number: currentDay.value >= 12 ? '#9a2645' : 'none',
      },
      'day-13': {
        cursor: currentDay.value >= 13 ? 'cursor-pointer' : 'cursor-default',
        translate: currentEvent.value ? 'translate(-500 0)' : 'translate(0 0)',
        bg: '#b60101',
        circle: currentDay.value >= 13 ? 'white' : 'none',
        number: currentDay.value >= 13 ? '#b60101' : 'none',
      },
      'day-14': {
        cursor: currentDay.value >= 14 ? 'cursor-pointer' : 'cursor-default',
        translate: currentEvent.value ? 'translate(-500 0)' : 'translate(0 0)',
        bg: '#7b0404',
        circle: currentDay.value >= 14 ? 'white' : 'none',
        number: currentDay.value >= 14 ? '#7b0404' : 'none',
      },
      'day-15': {
        cursor: currentDay.value >= 15 ? 'cursor-pointer' : 'cursor-default',
        translate: currentEvent.value ? 'translate(-500 0)' : 'translate(0 0)',
        bg: '#c63f63',
        circle: currentDay.value >= 11 ? 'white' : 'none',
        number: currentDay.value >= 11 ? '#c63f63' : 'none',
      },
      'day-16': {
        cursor: currentDay.value >= 16 ? 'cursor-pointer' : 'cursor-default',
        translate: currentEvent.value ? 'translate(-20 -500)' : 'translate(0 0)',
        bg: '#9a2645',
        circle: currentDay.value >= 16 ? 'white' : 'none',
        number: currentDay.value >= 16 ? '#9a2645' : 'none',
      },
      'day-17': {
        cursor: currentDay.value >= 17 ? 'cursor-pointer' : 'cursor-default',
        translate: currentEvent.value ? 'translate(-400 -50)' : 'translate(0 0)',
        bg: '#b60101',
        circle: currentDay.value >= 17 ? 'white' : 'none',
        number: currentDay.value >= 17 ? '#b60101' : 'none',
      },
      'day-18': {
        cursor: currentDay.value >= 18 ? 'cursor-pointer' : 'cursor-default',
        translate: currentEvent.value ? 'translate(-500 0)' : 'translate(0 0)',
        bg: '#7b0404',
        circle: currentDay.value >= 18 ? 'white' : 'none',
        number: currentDay.value >= 18 ? '#7b0404' : 'none',
      },
      'day-19': {
        cursor: currentDay.value >= 19 ? 'cursor-pointer' : 'cursor-default',
        translate: currentEvent.value ? 'translate(-500 0)' : 'translate(0 0)',
        bg: '#9a2645',
        circle: currentDay.value >= 19 ? 'white' : 'none',
        number: currentDay.value >= 19 ? '#9a2645' : 'none',
      },
      'day-20': {
        cursor: currentDay.value >= 20 ? 'cursor-pointer' : 'cursor-default',
        translate: currentEvent.value ? 'translate(500 -20)' : 'translate(0 0)',
        bg: '#7b0404',
        circle: currentDay.value >= 20 ? 'white' : 'none',
        number: currentDay.value >= 20 ? '#7b0404' : 'none',
      },
      'day-21': {
        cursor: currentDay.value >= 21 ? 'cursor-pointer' : 'cursor-default',
        translate: currentEvent.value ? 'translate(300 0)' : 'translate(0 0)',
        bg: '#c63f63',
        circle: currentDay.value >= 21 ? 'white' : 'none',
        number: currentDay.value >= 21 ? '#c63f63' : 'none',
      },
      'day-22': {
        cursor: currentDay.value >= 22 ? 'cursor-pointer' : 'cursor-default',
        translate: currentEvent.value ? 'translate(-500 0)' : 'translate(0 0)',
        bg: '#7b0404',
        circle: currentDay.value >= 22 ? 'white' : 'none',
        number: currentDay.value >= 22 ? '#7b0404' : 'none',
      },
      'day-23': {
        cursor: currentDay.value >= 23 ? 'cursor-pointer' : 'cursor-default',
        translate: currentEvent.value ? 'translate(-500 0)' : 'translate(0 0)',
        bg: '#9a2645',
        circle: currentDay.value >= 22 ? 'white' : 'none',
        number: currentDay.value >= 22 ? '#9a2645' : 'none',
      },
      'day-24': {
        cursor: currentDay.value >= 24 ? 'cursor-pointer' : 'cursor-default',
        translate: currentEvent.value ? 'translate(-500 0)' : 'translate(0 0)',
        bg: '#7b0404',
        circle: currentDay.value >= 24 ? 'white' : 'none',
        number: currentDay.value >= 24 ? '#7b0404' : 'none',
      },
      'day-25': {
        cursor: currentDay.value >= 25 ? 'cursor-pointer' : 'cursor-default',
        translate: currentEvent.value ? 'translate(-50 -500)' : 'translate(0 0)',
        bg: '#b60101',
        circle: currentDay.value >= 25 ? 'white' : 'none',
        number: currentDay.value >= 25 ? '#b60101' : 'none',
      },
    }))

    const handleCalendarChange = () => {
      currentDay.value = $cmwStore.isProd ? $dayjs().get('D') : $dayjs(date.value).get('D')
    }

    const handleClick = ({ currentTarget }: PointerEvent) => {
      const { id } = currentTarget as HTMLElement

      if (currentEvent.value) {
        currentEvent.value = undefined
        return
      }

      currentDay.value = $cmwStore.isProd ? $dayjs().get('D') : $dayjs(date.value).get('D')

      const eventDay = Number(id.replace('day-', ''))

      if (eventDay > currentDay.value) {
        currentEvent.value = undefined
        return
      }

      currentEventDay.value = eventDay
      currentEvent.value = eventDays.value.find(e =>
        $dayjs(e.reference.date.value).format('[day-]DD') === id)
    }

    return {
      collectionRef,
      currentDay,
      currentEvent,
      currentEventDay,
      date,
      eventClasses,
      handleCalendarChange,
      handleClick,
      metaObjectRef,
    }
  },
})
</script>

<template>
  <div class="l-page relative">
    <div
      class="max-w-screen-xl mx-auto filter blur-0 transition-filter duration-1500 md:px-4"
      :class="{ 'blur-40': currentEvent?.key }"
    >
      <h1 class="h3 text-primary text-center pt-10">
        <span class="text-primary">{{ $t('eventTitle') }}</span>
      </h1>
      <div class="w-10/12 m-inline-auto md:w-2/6">
        <!-- eslint-disable max-len -->
        <svg id="Layer_1" class="overflow-visible" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1242 1683">
          <g id="rectangles">
            <rect
              id="Rectangle-9" x="322" y="292" width="72" height="208" rx="34.72" ry="34.72" fill="#b60101"
              stroke-width="0"
            />
            <rect
              id="Rectangle-8" x="409" y="292" width="72" height="208" rx="34.72" ry="34.72" fill="#c63f63"
              stroke-width="0"
            />
            <rect
              id="Rectangle-7" x="720" y="621" width="207" height="76" rx="35.14" ry="35.14" fill="#c63f63"
              stroke-width="0"
            />
            <rect
              id="Rectangle-6" x="740" y="1407" width="207" height="76" rx="35.14" ry="35.14" fill="#c63f63"
              stroke-width="0"
            />
            <rect
              id="Rectangle-5" x="846" y="923" width="72" height="208" rx="34.72" ry="34.72"
              transform="translate(1764 2054) rotate(180)" fill="#b60101" stroke-width="0"
            />
            <rect
              id="Rectangle-4" x="759" y="923" width="72" height="208" rx="34.72" ry="34.72"
              transform="translate(1590 2054) rotate(180)" fill="#c63f63" stroke-width="0"
            />
            <rect
              id="Rectangle-3" x="357" y="1407" width="72" height="208" rx="34.72" ry="34.72" fill="#b60101"
              stroke-width="0"
            />
            <rect
              id="Rectangle-2" x="444" y="1407" width="72" height="208" rx="34.72" ry="34.72" fill="#c63f63"
              stroke-width="0"
            />
            <rect
              id="Rectangle-1" x="313" y="726" width="207" height="76" rx="35.14" ry="35.14"
              transform="translate(833 1528) rotate(-180)" fill="#c63f63" stroke-width="0"
            />
          </g>
          <g id="day-03" class="cursor-pointer" :class="eventClasses['day-03']['cursor-pointer']" :transform="`${eventClasses['day-03'].translate}`" @click.stop="handleClick">
            <rect
              x="84" y="70" width="208" height="208" rx="63.03" ry="63.03" :fill="eventClasses['day-03'].bg"
              stroke-width="0"
            />
            <circle cx="187.9" cy="173.76" r="78.76" :fill="eventClasses['day-03'].circle" stroke-width="0" />
            <g>
              <path
                d="m184.92,173.19c0,12.53-2.05,21.81-6.16,27.83-4.11,6.02-10.43,9.03-18.97,9.03s-14.52-3.11-18.72-9.33c-4.2-6.22-6.31-15.39-6.31-27.53s2.04-22,6.14-28c4.09-6,10.39-9.01,18.9-9.01s14.54,3.14,18.77,9.42c4.24,6.28,6.36,15.48,6.36,27.58Zm-35.09,0c0,8.8.76,15.11,2.28,18.92,1.52,3.81,4.08,5.72,7.68,5.72s6.09-1.93,7.66-5.79c1.57-3.86,2.36-10.14,2.36-18.85s-.79-15.12-2.38-18.97c-1.59-3.84-4.13-5.77-7.63-5.77s-6.12,1.92-7.66,5.77c-1.54,3.85-2.31,10.17-2.31,18.97Z"
                :fill="eventClasses['day-03'].number" stroke-width="0"
              />
              <path
                d="m239.89,153.36c0,4.48-1.36,8.29-4.07,11.44-2.72,3.14-6.53,5.3-11.44,6.48v.29c5.79.72,10.18,2.48,13.15,5.28,2.98,2.8,4.47,6.57,4.47,11.31,0,6.9-2.5,12.28-7.51,16.12-5.01,3.85-12.16,5.77-21.45,5.77-7.79,0-14.69-1.29-20.71-3.88v-12.91c2.78,1.41,5.84,2.55,9.18,3.44,3.34.88,6.64,1.33,9.91,1.33,5.01,0,8.7-.85,11.09-2.55,2.39-1.7,3.58-4.43,3.58-8.2,0-3.37-1.37-5.76-4.12-7.17-2.75-1.41-7.13-2.11-13.15-2.11h-5.45v-11.63h5.55c5.56,0,9.63-.73,12.2-2.18,2.57-1.46,3.85-3.95,3.85-7.48,0-5.43-3.4-8.15-10.21-8.15-2.36,0-4.75.39-7.19,1.18-2.44.79-5.15,2.14-8.12,4.07l-7.02-10.45c6.54-4.71,14.35-7.07,23.41-7.07,7.43,0,13.29,1.51,17.6,4.52,4.3,3.01,6.45,7.2,6.45,12.56Z"
                :fill="eventClasses['day-03'].number" stroke-width="0"
              />
            </g>
          </g>
          <g id="day-16" :class="eventClasses['day-16'].cursor" :transform="eventClasses['day-16'].translate" @click.stop="handleClick">
            <rect
              x="302" y="43" width="208" height="208" rx="63.03" ry="63.03" :fill="eventClasses['day-16'].bg"
              stroke-width="0"
            />
            <circle cx="406.28" cy="146.8" r="78.76" :fill="eventClasses['day-16'].circle" stroke-width="0" />
            <g>
              <path
                d="m387.72,184.78h-15.17v-41.52l.15-6.82.25-7.46c-2.52,2.52-4.27,4.17-5.25,4.96l-8.25,6.63-7.31-9.13,23.12-18.4h12.47v71.75Z"
                :fill="eventClasses['day-16'].number" stroke-width="0"
              />
              <path
                d="m407.11,154.31c0-14.2,3-24.77,9.01-31.71,6-6.94,14.99-10.4,26.97-10.4,4.09,0,7.3.25,9.62.74v12.12c-2.91-.65-5.79-.98-8.64-.98-5.2,0-9.45.79-12.74,2.36-3.29,1.57-5.75,3.89-7.39,6.97-1.64,3.08-2.6,7.44-2.9,13.1h.64c3.24-5.56,8.42-8.34,15.56-8.34,6.41,0,11.44,2.01,15.07,6.04,3.63,4.02,5.45,9.59,5.45,16.69,0,7.66-2.16,13.72-6.48,18.18-4.32,4.47-10.31,6.7-17.96,6.7-5.3,0-9.92-1.23-13.86-3.68-3.94-2.45-6.99-6.04-9.13-10.75-2.14-4.71-3.21-10.39-3.21-17.03Zm25.91,19.34c3.24,0,5.73-1.09,7.46-3.26,1.73-2.18,2.6-5.28,2.6-9.3,0-3.5-.81-6.26-2.43-8.27-1.62-2.01-4.07-3.02-7.34-3.02-3.08,0-5.7,1-7.88,2.99-2.18,2-3.26,4.32-3.26,6.97,0,3.89,1.02,7.18,3.07,9.87,2.04,2.68,4.64,4.02,7.78,4.02Z"
                :fill="eventClasses['day-16'].number" stroke-width="0"
              />
            </g>
          </g>
          <g id="day-24" :class="eventClasses['day-24'].cursor" :transform="eventClasses['day-24'].translate" @click.stop="handleClick">
            <rect
              x="548" y="717" width="385" height="193" rx="64.07" ry="64.07"
              transform="translate(1481 1627) rotate(-180)" :fill="eventClasses['day-24'].bg" stroke-width="0"
            />
            <circle cx="727.36" cy="814.4" r="78.76" :fill="eventClasses['day-24'].circle" stroke-width="0" />
            <g>
              <path
                d="m723.92,850.77h-50.16v-10.55l18.01-18.21c5.33-5.46,8.82-9.25,10.45-11.36,1.64-2.11,2.81-4.07,3.53-5.87.72-1.8,1.08-3.66,1.08-5.59,0-2.88-.79-5.02-2.38-6.43-1.59-1.41-3.71-2.11-6.36-2.11-2.78,0-5.48.64-8.1,1.91-2.62,1.28-5.35,3.09-8.2,5.45l-8.25-9.77c3.53-3.01,6.46-5.14,8.79-6.38s4.86-2.2,7.61-2.87c2.75-.67,5.82-1.01,9.23-1.01,4.48,0,8.44.82,11.88,2.45,3.44,1.64,6.1,3.93,8,6.87,1.9,2.95,2.85,6.32,2.85,10.11,0,3.31-.58,6.41-1.74,9.3-1.16,2.9-2.96,5.87-5.4,8.91-2.44,3.04-6.73,7.38-12.88,13.01l-9.23,8.69v.69h31.26v12.76Z"
                :fill="eventClasses['day-24'].number" stroke-width="0"
              />
              <path
                d="m782.91,835.9h-8.64v14.87h-14.82v-14.87h-30.63v-10.55l31.46-46.33h13.99v45.1h8.64v11.78Zm-23.46-11.78v-12.17c0-2.03.08-4.97.25-8.83.16-3.86.29-6.1.39-6.72h-.39c-1.21,2.68-2.67,5.3-4.37,7.85l-13.15,19.88h17.28Z"
                :fill="eventClasses['day-24'].number" stroke-width="0"
              />
            </g>
          </g>
          <g id="day-08" :class="eventClasses['day-08'].cursor" :transform="eventClasses['day-08'].translate" @click.stop="handleClick">
            <rect
              x="947.18" y="30.03" width="208" height="208" rx="63.03" ry="63.03" :fill="eventClasses['day-08'].bg"
              stroke-width="0"
            />
            <circle cx="1051.18" cy="134.03" r="78.76" :fill="eventClasses['day-08'].circle" stroke-width="0" />
            <g>
              <path
                d="m1046.52,134.24c0,12.53-2.05,21.81-6.16,27.83-4.11,6.02-10.43,9.03-18.97,9.03s-14.52-3.11-18.72-9.33c-4.2-6.22-6.31-15.39-6.31-27.53s2.04-22,6.14-28c4.09-6,10.39-9.01,18.9-9.01s14.54,3.14,18.77,9.42,6.36,15.48,6.36,27.58Zm-35.09,0c0,8.8.76,15.11,2.28,18.92,1.52,3.81,4.08,5.72,7.68,5.72s6.09-1.93,7.66-5.79c1.57-3.86,2.36-10.14,2.36-18.85s-.79-15.12-2.38-18.97c-1.59-3.84-4.13-5.77-7.63-5.77s-6.12,1.92-7.66,5.77c-1.54,3.85-2.31,10.17-2.31,18.97Z"
                :fill="eventClasses['day-08'].number" stroke-width="0"
              />
              <path
                d="m1078.87,97.43c6.87,0,12.41,1.56,16.61,4.69,4.2,3.12,6.31,7.34,6.31,12.64,0,3.67-1.01,6.93-3.04,9.79-2.03,2.86-5.3,5.42-9.82,7.68,5.37,2.88,9.22,5.88,11.56,9.01,2.34,3.12,3.51,6.55,3.51,10.28,0,5.89-2.31,10.63-6.92,14.21s-10.68,5.37-18.21,5.37-14.02-1.67-18.5-5.01c-4.48-3.34-6.72-8.07-6.72-14.18,0-4.09,1.09-7.72,3.26-10.9,2.18-3.17,5.67-5.97,10.48-8.39-4.09-2.58-7.04-5.35-8.83-8.29-1.8-2.94-2.7-6.17-2.7-9.67,0-5.14,2.13-9.29,6.38-12.47,4.25-3.17,9.8-4.76,16.64-4.76Zm-11.19,53.6c0,2.81.98,5.01,2.95,6.58,1.96,1.57,4.65,2.36,8.05,2.36,3.76,0,6.58-.81,8.44-2.43,1.87-1.62,2.8-3.75,2.8-6.4,0-2.19-.92-4.25-2.77-6.16-1.85-1.91-4.85-3.95-9.01-6.11-6.97,3.21-10.45,7.26-10.45,12.17Zm11.09-42.5c-2.59,0-4.67.66-6.26,1.99-1.59,1.33-2.38,3.1-2.38,5.33,0,1.96.63,3.72,1.89,5.28,1.26,1.55,3.54,3.15,6.85,4.79,3.21-1.5,5.45-3.04,6.72-4.61,1.28-1.57,1.91-3.39,1.91-5.45,0-2.26-.82-4.04-2.45-5.35-1.64-1.31-3.73-1.96-6.28-1.96Z"
                :fill="eventClasses['day-08'].number" stroke-width="0"
              />
            </g>
          </g>
          <g id="day-25" :class="eventClasses['day-25'].cursor" :transform="eventClasses['day-25'].translate" @click.stop="handleClick">
            <rect
              x="516" y="70" width="415" height="196" rx="63.03" ry="63.03" :fill="eventClasses['day-25'].bg"
              stroke-width="0"
            />
            <circle cx="623.58" cy="165.53" r="78.76" :fill="eventClasses['day-25'].circle" stroke-width="0" />
            <g>
              <path
                d="m617.92,201.77h-50.16v-10.55l18.01-18.21c5.33-5.46,8.82-9.25,10.45-11.36,1.64-2.11,2.81-4.07,3.53-5.87.72-1.8,1.08-3.66,1.08-5.59,0-2.88-.79-5.02-2.38-6.43-1.59-1.41-3.71-2.11-6.36-2.11-2.78,0-5.48.64-8.1,1.91-2.62,1.28-5.35,3.09-8.2,5.45l-8.25-9.77c3.53-3.01,6.46-5.14,8.79-6.38s4.86-2.2,7.61-2.87c2.75-.67,5.82-1.01,9.23-1.01,4.48,0,8.44.82,11.88,2.45,3.44,1.64,6.1,3.93,8,6.87,1.9,2.95,2.85,6.32,2.85,10.11,0,3.31-.58,6.41-1.74,9.3-1.16,2.9-2.96,5.87-5.4,8.91-2.44,3.04-6.73,7.38-12.88,13.01l-9.23,8.69v.69h31.26v12.76Z"
                :fill="eventClasses['day-25'].number" stroke-width="0"
              />
              <path
                d="m651.24,155.93c6.94,0,12.46,1.95,16.56,5.84,4.11,3.89,6.16,9.23,6.16,16,0,8.02-2.47,14.18-7.41,18.5-4.94,4.32-12.01,6.48-21.2,6.48-7.98,0-14.43-1.29-19.34-3.88v-13.1c2.58,1.38,5.59,2.5,9.03,3.36,3.44.87,6.69,1.3,9.77,1.3,9.26,0,13.89-3.8,13.89-11.39s-4.79-10.85-14.38-10.85c-1.73,0-3.65.17-5.74.52-2.09.34-3.8.71-5.1,1.1l-6.04-3.24,2.7-36.56h38.92v12.86h-25.62l-1.33,14.09,1.72-.34c2-.46,4.47-.69,7.41-.69Z"
                :fill="eventClasses['day-25'].number" stroke-width="0"
              />
            </g>
          </g>
          <g id="day-10" :class="eventClasses['day-10'].cursor" :transform="eventClasses['day-10'].translate" @click.stop="handleClick">
            <rect
              x="109" y="294" width="208" height="208" rx="63.03" ry="63.03" :fill="eventClasses['day-10'].bg"
              stroke-width="0"
            />
            <circle cx="213" cy="398" r="78.76" :fill="eventClasses['day-10'].circle" stroke-width="0" />
            <g>
              <path
                d="m193.25,434.77h-15.17v-41.52l.15-6.82.25-7.46c-2.52,2.52-4.27,4.17-5.25,4.96l-8.25,6.63-7.31-9.13,23.12-18.4h12.47v71.75Z"
                :fill="eventClasses['day-10'].number" stroke-width="0"
              />
              <path
                d="m262.9,398.89c0,12.53-2.05,21.81-6.16,27.83-4.11,6.02-10.43,9.03-18.97,9.03s-14.52-3.11-18.72-9.33c-4.2-6.22-6.31-15.39-6.31-27.53s2.04-22,6.14-28c4.09-6,10.39-9.01,18.9-9.01s14.54,3.14,18.77,9.42c4.24,6.28,6.36,15.48,6.36,27.58Zm-35.09,0c0,8.8.76,15.11,2.28,18.92,1.52,3.81,4.08,5.72,7.68,5.72s6.09-1.93,7.66-5.79c1.57-3.86,2.36-10.14,2.36-18.85s-.79-15.12-2.38-18.97c-1.59-3.84-4.13-5.77-7.63-5.77s-6.12,1.92-7.66,5.77c-1.54,3.85-2.31,10.17-2.31,18.97Z"
                :fill="eventClasses['day-10'].number" stroke-width="0"
              />
            </g>
          </g>
          <g id="day-17" :class="eventClasses['day-17'].cursor" :transform="eventClasses['day-17'].translate" @click.stop="handleClick">
            <rect
              x="499" y="292" width="205" height="208" rx="64.07" ry="64.07" :fill="eventClasses['day-17'].bg"
              stroke-width="0"
            />
            <circle cx="601.5" cy="396" r="78.76" :fill="eventClasses['day-17'].circle" stroke-width="0" />
            <g>
              <path
                d="m581.25,434.77h-15.17v-41.52l.15-6.82.25-7.46c-2.52,2.52-4.27,4.17-5.25,4.96l-8.25,6.63-7.31-9.13,23.12-18.4h12.47v71.75Z"
                :fill="eventClasses['day-17'].number" stroke-width="0"
              />
              <path
                d="m608.25,434.77l26.94-58.9h-35.39v-12.76h51.49v9.52l-27.14,62.13h-15.9Z"
                :fill="eventClasses['day-17'].number" stroke-width="0"
              />
            </g>
          </g>
          <g id="day-01" :class="eventClasses['day-01'].cursor" :transform="eventClasses['day-01'].translate" @click.stop="handleClick">
            <rect
              x="711" y="292" width="190" height="300" rx="64.07" ry="64.07" :fill="eventClasses['day-01'].bg"
              stroke-width="0"
            />
            <circle cx="806" cy="442" r="78.76" :fill="eventClasses['day-01'].circle" stroke-width="0" />
            <g>
              <path
                d="m804.52,441.89c0,12.53-2.05,21.81-6.16,27.83-4.11,6.02-10.43,9.03-18.97,9.03s-14.52-3.11-18.72-9.33c-4.2-6.22-6.31-15.39-6.31-27.53s2.04-22,6.14-28c4.09-6,10.39-9.01,18.9-9.01s14.54,3.14,18.77,9.42,6.36,15.48,6.36,27.58Zm-35.09,0c0,8.8.76,15.11,2.28,18.92,1.52,3.81,4.08,5.72,7.68,5.72s6.09-1.93,7.66-5.79c1.57-3.86,2.36-10.14,2.36-18.85s-.79-15.12-2.38-18.97c-1.59-3.84-4.13-5.77-7.63-5.77s-6.12,1.92-7.66,5.77c-1.54,3.85-2.31,10.17-2.31,18.97Z"
                :fill="eventClasses['day-01'].number" stroke-width="0"
              />
              <path
                d="m849.63,477.77h-15.17v-41.52l.15-6.82.25-7.46c-2.52,2.52-4.27,4.17-5.25,4.96l-8.25,6.63-7.31-9.13,23.12-18.4h12.47v71.75Z"
                :fill="eventClasses['day-01'].number" stroke-width="0"
              />
            </g>
          </g>
          <g id="day-20" :class="eventClasses['day-20'].cursor" :transform="eventClasses['day-20'].translate" @click.stop="handleClick">
            <rect
              x="912" y="294" width="184" height="186" rx="64.07" ry="64.07" :fill="eventClasses['day-20'].bg"
              stroke-width="0"
            />
            <circle cx="1004" cy="387" r="78.76" :fill="eventClasses['day-20'].circle" stroke-width="0" />
            <g>
              <path
                d="m1000.92,422.77h-50.16v-10.55l18.01-18.21c5.33-5.46,8.82-9.25,10.45-11.36,1.64-2.11,2.81-4.07,3.53-5.87.72-1.8,1.08-3.66,1.08-5.59,0-2.88-.79-5.02-2.38-6.43-1.59-1.41-3.71-2.11-6.36-2.11-2.78,0-5.48.64-8.1,1.91-2.62,1.28-5.35,3.09-8.2,5.45l-8.25-9.77c3.53-3.01,6.46-5.14,8.79-6.38s4.86-2.2,7.61-2.87c2.75-.67,5.82-1.01,9.23-1.01,4.48,0,8.44.82,11.88,2.45,3.44,1.64,6.1,3.93,8,6.87,1.9,2.95,2.85,6.32,2.85,10.11,0,3.31-.58,6.41-1.74,9.3-1.16,2.9-2.96,5.87-5.4,8.91-2.44,3.04-6.73,7.38-12.88,13.01l-9.23,8.69v.69h31.26v12.76Z"
                :fill="eventClasses['day-20'].number" stroke-width="0"
              />
              <path
                d="m1057.9,386.89c0,12.53-2.05,21.81-6.16,27.83-4.11,6.02-10.43,9.03-18.97,9.03s-14.52-3.11-18.72-9.33c-4.2-6.22-6.31-15.39-6.31-27.53s2.04-22,6.14-28c4.09-6,10.39-9.01,18.9-9.01s14.54,3.14,18.77,9.42,6.36,15.48,6.36,27.58Zm-35.09,0c0,8.8.76,15.11,2.28,18.92,1.52,3.81,4.08,5.72,7.68,5.72s6.09-1.93,7.66-5.79c1.57-3.86,2.36-10.14,2.36-18.85s-.79-15.12-2.38-18.97c-1.59-3.84-4.13-5.77-7.63-5.77s-6.12,1.92-7.66,5.77c-1.54,3.85-2.31,10.17-2.31,18.97Z"
                :fill="eventClasses['day-20'].number" stroke-width="0"
              />
            </g>
          </g>
          <g id="day-04" :class="eventClasses['day-04'].cursor" :transform="eventClasses['day-04'].translate" @click.stop="handleClick">
            <rect
              x="84" y="738" width="184" height="186" rx="64.07" ry="64.07"
              transform="translate(352 1662) rotate(180)" :fill="eventClasses['day-04'].bg" stroke-width="0"
            />
            <circle cx="176" cy="831" r="78.76" :fill="eventClasses['day-04'].circle" stroke-width="0" />
            <g>
              <path
                d="m172.52,833.89c0,12.53-2.05,21.81-6.16,27.83-4.11,6.02-10.43,9.03-18.97,9.03s-14.52-3.11-18.72-9.33c-4.2-6.22-6.31-15.39-6.31-27.53s2.04-22,6.14-28c4.09-6,10.39-9.01,18.9-9.01s14.54,3.14,18.77,9.42c4.24,6.28,6.36,15.48,6.36,27.58Zm-35.09,0c0,8.8.76,15.11,2.28,18.92,1.52,3.81,4.08,5.72,7.68,5.72s6.09-1.93,7.66-5.79c1.57-3.86,2.36-10.14,2.36-18.85s-.79-15.12-2.38-18.97c-1.59-3.84-4.13-5.77-7.63-5.77s-6.12,1.92-7.66,5.77c-1.54,3.85-2.31,10.17-2.31,18.97Z"
                :fill="eventClasses['day-04'].number" stroke-width="0"
              />
              <path
                d="m231.91,854.9h-8.64v14.87h-14.82v-14.87h-30.63v-10.55l31.46-46.33h13.99v45.1h8.64v11.78Zm-23.46-11.78v-12.17c0-2.03.08-4.97.25-8.83.16-3.86.29-6.1.39-6.72h-.39c-1.21,2.68-2.67,5.3-4.37,7.85l-13.15,19.88h17.28Z"
                :fill="eventClasses['day-04'].number" stroke-width="0"
              />
            </g>
          </g>
          <g id="day-02" :class="eventClasses['day-02'].cursor" :transform="eventClasses['day-02'].translate" @click.stop="handleClick">
            <rect
              x="88" y="518" width="188" height="193" rx="64.07" ry="64.07" :fill="eventClasses['day-02'].bg"
              stroke-width="0"
            />
            <circle cx="182" cy="614.5" r="78.76" :fill="eventClasses['day-02'].circle" stroke-width="0" />
            <g>
              <path
                d="m178.52,615.89c0,12.53-2.05,21.81-6.16,27.83-4.11,6.02-10.43,9.03-18.97,9.03s-14.52-3.11-18.72-9.33c-4.2-6.22-6.31-15.39-6.31-27.53s2.04-22,6.14-28c4.09-6,10.39-9.01,18.9-9.01s14.54,3.14,18.77,9.42c4.24,6.28,6.36,15.48,6.36,27.58Zm-35.09,0c0,8.8.76,15.11,2.28,18.92,1.52,3.81,4.08,5.72,7.68,5.72s6.09-1.93,7.66-5.79c1.57-3.86,2.36-10.14,2.36-18.85s-.79-15.12-2.38-18.97c-1.59-3.84-4.13-5.77-7.63-5.77s-6.12,1.92-7.66,5.77c-1.54,3.85-2.31,10.17-2.31,18.97Z"
                :fill="eventClasses['day-02'].number" stroke-width="0"
              />
              <path
                d="m236.29,651.77h-50.16v-10.55l18.01-18.21c5.33-5.46,8.82-9.25,10.45-11.36,1.64-2.11,2.81-4.07,3.53-5.87.72-1.8,1.08-3.66,1.08-5.59,0-2.88-.79-5.02-2.38-6.43-1.59-1.41-3.71-2.11-6.36-2.11-2.78,0-5.48.64-8.1,1.91-2.62,1.28-5.35,3.09-8.2,5.45l-8.25-9.77c3.53-3.01,6.46-5.14,8.79-6.38s4.86-2.2,7.61-2.87,5.82-1.01,9.23-1.01c4.48,0,8.44.82,11.88,2.45,3.44,1.64,6.1,3.93,8,6.87,1.9,2.95,2.85,6.32,2.85,10.11,0,3.31-.58,6.41-1.74,9.3-1.16,2.9-2.96,5.87-5.4,8.91-2.44,3.04-6.73,7.38-12.88,13.01l-9.23,8.69v.69h31.26v12.76Z"
                :fill="eventClasses['day-02'].number" stroke-width="0"
              />
            </g>
          </g>
          <g id="day-07" :class="eventClasses['day-07'].cursor" :transform="eventClasses['day-07'].translate" @click.stop="handleClick">
            <rect
              x="307" y="513" width="385" height="193" rx="64.07" ry="64.07" :fill="eventClasses['day-07'].bg"
              stroke-width="0"
            />
            <circle cx="588.36" cy="611.4" r="78.76" :fill="eventClasses['day-07'].circle" stroke-width="0" />
            <g>
              <path
                d="m584.52,614.89c0,12.53-2.05,21.81-6.16,27.83-4.11,6.02-10.43,9.03-18.97,9.03s-14.52-3.11-18.72-9.33c-4.2-6.22-6.31-15.39-6.31-27.53s2.04-22,6.14-28c4.09-6,10.39-9.01,18.9-9.01s14.54,3.14,18.77,9.42c4.24,6.28,6.36,15.48,6.36,27.58Zm-35.09,0c0,8.8.76,15.11,2.28,18.92,1.52,3.81,4.08,5.72,7.68,5.72s6.09-1.93,7.66-5.79c1.57-3.86,2.36-10.14,2.36-18.85s-.79-15.12-2.38-18.97c-1.59-3.84-4.13-5.77-7.63-5.77s-6.12,1.92-7.66,5.77c-1.54,3.85-2.31,10.17-2.31,18.97Z"
                :fill="eventClasses['day-07'].number" stroke-width="0"
              />
              <path
                d="m599.25,650.77l26.94-58.9h-35.39v-12.76h51.49v9.52l-27.14,62.13h-15.9Z"
                :fill="eventClasses['day-07'].number" stroke-width="0"
              />
            </g>
          </g>
          <g id="day-21" :class="eventClasses['day-21'].cursor" :transform="eventClasses['day-21'].translate" @click.stop="handleClick">
            <rect
              x="972" y="499" width="184" height="186" rx="64.07" ry="64.07" :fill="eventClasses['day-21'].bg"
              stroke-width="0"
            />
            <circle cx="1064" cy="592" r="78.76" :fill="eventClasses['day-21'].circle" stroke-width="0" />
            <g>
              <path
                d="m1060.92,630.77h-50.16v-10.55l18.01-18.21c5.33-5.46,8.82-9.25,10.45-11.36,1.64-2.11,2.81-4.07,3.53-5.87.72-1.8,1.08-3.66,1.08-5.59,0-2.88-.79-5.02-2.38-6.43-1.59-1.41-3.71-2.11-6.36-2.11-2.78,0-5.48.64-8.1,1.91-2.62,1.28-5.35,3.09-8.2,5.45l-8.25-9.77c3.53-3.01,6.46-5.14,8.79-6.38s4.86-2.2,7.61-2.87c2.75-.67,5.82-1.01,9.23-1.01,4.48,0,8.44.82,11.88,2.45,3.44,1.64,6.1,3.93,8,6.87,1.9,2.95,2.85,6.32,2.85,10.11,0,3.31-.58,6.41-1.74,9.3-1.16,2.9-2.96,5.87-5.4,8.91-2.44,3.04-6.73,7.38-12.88,13.01l-9.23,8.69v.69h31.26v12.76Z"
                :fill="eventClasses['day-21'].number" stroke-width="0"
              />
              <path
                d="m1105.63,630.77h-15.17v-41.52l.15-6.82.25-7.46c-2.52,2.52-4.27,4.17-5.25,4.96l-8.25,6.63-7.31-9.13,23.12-18.4h12.47v71.75Z"
                :fill="eventClasses['day-21'].number" stroke-width="0"
              />
            </g>
          </g>
          <g id="day-15" :class="eventClasses['day-15'].cursor" :transform="eventClasses['day-15'].translate" @click.stop="handleClick">
            <rect
              x="948" y="1145" width="208" height="208" rx="63.03" ry="63.03"
              transform="translate(2104 2498) rotate(180)" :fill="eventClasses['day-15'].bg" stroke-width="0"
            />
            <circle cx="1052" cy="1249" r="78.76" :fill="eventClasses['day-15'].circle" stroke-width="0" />
            <g>
              <path
                d="m1033.25,1287.77h-15.17v-41.52l.15-6.82.25-7.46c-2.52,2.52-4.27,4.17-5.25,4.96l-8.25,6.63-7.31-9.13,23.12-18.4h12.47v71.75Z"
                :fill="eventClasses['day-15'].number" stroke-width="0"
              />
              <path
                d="m1079.24,1241.93c6.94,0,12.46,1.95,16.56,5.84,4.11,3.89,6.16,9.23,6.16,16,0,8.02-2.47,14.18-7.41,18.5-4.94,4.32-12.01,6.48-21.2,6.48-7.98,0-14.43-1.29-19.34-3.88v-13.1c2.58,1.38,5.59,2.5,9.03,3.36,3.44.87,6.69,1.3,9.77,1.3,9.26,0,13.89-3.8,13.89-11.39s-4.79-10.85-14.38-10.85c-1.73,0-3.65.17-5.74.52-2.09.34-3.8.71-5.1,1.1l-6.04-3.24,2.7-36.56h38.92v12.86h-25.62l-1.33,14.09,1.72-.34c2-.46,4.47-.69,7.41-.69Z"
                :fill="eventClasses['day-15'].number" stroke-width="0"
              />
            </g>
          </g>
          <g id="day-05" :class="eventClasses['day-05'].cursor" :transform="eventClasses['day-05'].translate" @click.stop="handleClick">
            <rect
              x="960" y="1409" width="184" height="186" rx="64.07" ry="64.07" :fill="eventClasses['day-05'].bg"
              stroke-width="0"
            />
            <circle cx="1052" cy="1502" r="78.76" :fill="eventClasses['day-05'].circle" stroke-width="0" />
            <g>
              <path
                d="m1048.52,1504.89c0,12.53-2.05,21.81-6.16,27.83-4.11,6.02-10.43,9.03-18.97,9.03s-14.52-3.11-18.72-9.33c-4.2-6.22-6.31-15.39-6.31-27.53s2.04-22,6.14-28c4.09-6,10.39-9.01,18.9-9.01s14.54,3.14,18.77,9.42,6.36,15.48,6.36,27.58Zm-35.09,0c0,8.8.76,15.11,2.28,18.92,1.52,3.81,4.08,5.72,7.68,5.72s6.09-1.93,7.66-5.79c1.57-3.86,2.36-10.14,2.36-18.85s-.79-15.12-2.38-18.97c-1.59-3.84-4.13-5.77-7.63-5.77s-6.12,1.92-7.66,5.77c-1.54,3.85-2.31,10.17-2.31,18.97Z"
                :fill="eventClasses['day-05'].number" stroke-width="0"
              />
              <path
                d="m1082.24,1494.93c6.94,0,12.46,1.95,16.56,5.84,4.11,3.89,6.16,9.23,6.16,16,0,8.02-2.47,14.18-7.41,18.5-4.94,4.32-12.01,6.48-21.2,6.48-7.98,0-14.43-1.29-19.34-3.88v-13.1c2.58,1.38,5.59,2.5,9.03,3.36,3.44.87,6.69,1.3,9.77,1.3,9.26,0,13.89-3.8,13.89-11.39s-4.79-10.85-14.38-10.85c-1.73,0-3.65.17-5.74.52-2.09.34-3.8.71-5.1,1.1l-6.04-3.24,2.7-36.56h38.92v12.86h-25.62l-1.33,14.09,1.72-.34c2-.46,4.47-.69,7.41-.69Z"
                :fill="eventClasses['day-05'].number" stroke-width="0"
              />
            </g>
          </g>
          <g id="day-11" :class="eventClasses['day-11'].cursor" :transform="eventClasses['day-11'].translate" @click.stop="handleClick">
            <rect
              x="964" y="712" width="188" height="193" rx="64.07" ry="64.07"
              transform="translate(2116 1617) rotate(-180)" :fill="eventClasses['day-11'].bg" stroke-width="0"
            />
            <circle cx="1058" cy="808.5" r="78.76" :fill="eventClasses['day-11'].circle" stroke-width="0" />
            <g>
              <path
                d="m1042.25,845.77h-15.17v-41.52l.15-6.82.25-7.46c-2.52,2.52-4.27,4.17-5.25,4.96l-8.25,6.63-7.31-9.13,23.12-18.4h12.47v71.75Z"
                :fill="eventClasses['day-11'].number" stroke-width="0"
              />
              <path
                d="m1099.63,845.77h-15.17v-41.52l.15-6.82.25-7.46c-2.52,2.52-4.27,4.17-5.25,4.96l-8.25,6.63-7.31-9.13,23.12-18.4h12.47v71.75Z"
                :fill="eventClasses['day-11'].number" stroke-width="0"
              />
            </g>
          </g>
          <g id="day-06" :class="eventClasses['day-06'].cursor" :transform="eventClasses['day-06'].translate" @click.stop="handleClick">
            <rect
              x="923" y="921" width="208" height="208" rx="63.03" ry="63.03"
              transform="translate(2054 2050) rotate(180)" :fill="eventClasses['day-06'].bg" stroke-width="0"
            />
            <circle cx="1027" cy="1025" r="78.76" :fill="eventClasses['day-06'].circle" stroke-width="0" />
            <g>
              <path
                d="m1023.52,1022.89c0,12.53-2.05,21.81-6.16,27.83-4.11,6.02-10.43,9.03-18.97,9.03s-14.52-3.11-18.72-9.33c-4.2-6.22-6.31-15.39-6.31-27.53s2.04-22,6.14-28c4.09-6,10.39-9.01,18.9-9.01s14.54,3.14,18.77,9.42,6.36,15.48,6.36,27.58Zm-35.09,0c0,8.8.76,15.11,2.28,18.92,1.52,3.81,4.08,5.72,7.68,5.72s6.09-1.93,7.66-5.79c1.57-3.86,2.36-10.14,2.36-18.85s-.79-15.12-2.38-18.97c-1.59-3.84-4.13-5.77-7.63-5.77s-6.12,1.92-7.66,5.77c-1.54,3.85-2.31,10.17-2.31,18.97Z"
                :fill="eventClasses['day-06'].number" stroke-width="0"
              />
              <path
                d="m1030.64,1028.29c0-14.2,3-24.77,9.01-31.71,6-6.94,14.99-10.41,26.97-10.41,4.09,0,7.3.25,9.62.74v12.12c-2.91-.65-5.79-.98-8.64-.98-5.2,0-9.45.79-12.74,2.36s-5.75,3.89-7.39,6.97c-1.64,3.08-2.6,7.44-2.9,13.1h.64c3.24-5.56,8.42-8.34,15.56-8.34,6.41,0,11.44,2.01,15.07,6.04s5.45,9.59,5.45,16.69c0,7.66-2.16,13.72-6.48,18.18-4.32,4.47-10.31,6.7-17.96,6.7-5.3,0-9.92-1.23-13.86-3.68-3.94-2.45-6.99-6.04-9.13-10.75-2.14-4.71-3.21-10.39-3.21-17.03Zm25.91,19.34c3.24,0,5.73-1.09,7.46-3.26,1.73-2.18,2.6-5.28,2.6-9.3,0-3.5-.81-6.26-2.43-8.27-1.62-2.01-4.07-3.02-7.34-3.02-3.08,0-5.7,1-7.88,2.99-2.18,2-3.26,4.32-3.26,6.97,0,3.89,1.02,7.18,3.07,9.87,2.04,2.68,4.64,4.02,7.78,4.02Z"
                :fill="eventClasses['day-06'].number" stroke-width="0"
              />
            </g>
          </g>
          <g id="day-23" :class="eventClasses['day-23'].cursor" :transform="eventClasses['day-23'].translate" @click.stop="handleClick">
            <rect
              x="730" y="1172" width="208" height="208" rx="63.03" ry="63.03"
              transform="translate(1668 2552) rotate(180)" :fill="eventClasses['day-23'].bg" stroke-width="0"
            />
            <circle cx="834" cy="1276" r="78.76" :fill="eventClasses['day-23'].circle" stroke-width="0" />
            <g>
              <path
                d="m830.92,1311.77h-50.16v-10.55l18.01-18.21c5.33-5.46,8.82-9.25,10.45-11.36,1.64-2.11,2.81-4.07,3.53-5.87.72-1.8,1.08-3.66,1.08-5.59,0-2.88-.79-5.02-2.38-6.43-1.59-1.41-3.71-2.11-6.36-2.11-2.78,0-5.48.64-8.1,1.91-2.62,1.28-5.35,3.09-8.2,5.45l-8.25-9.77c3.53-3.01,6.46-5.14,8.79-6.38s4.86-2.2,7.61-2.87c2.75-.67,5.82-1.01,9.23-1.01,4.48,0,8.44.82,11.88,2.45,3.44,1.64,6.1,3.93,8,6.87,1.9,2.95,2.85,6.32,2.85,10.11,0,3.31-.58,6.41-1.74,9.3-1.16,2.9-2.96,5.87-5.4,8.91-2.44,3.04-6.73,7.38-12.88,13.01l-9.23,8.69v.69h31.26v12.76Z"
                :fill="eventClasses['day-23'].number" stroke-width="0"
              />
              <path
                d="m885.49,1256.07c0,4.48-1.36,8.29-4.07,11.44-2.72,3.14-6.53,5.3-11.44,6.48v.29c5.79.72,10.17,2.48,13.15,5.28,2.98,2.8,4.47,6.57,4.47,11.31,0,6.9-2.5,12.28-7.51,16.12-5.01,3.85-12.16,5.77-21.45,5.77-7.79,0-14.69-1.29-20.71-3.88v-12.91c2.78,1.41,5.84,2.55,9.18,3.44,3.34.88,6.64,1.33,9.92,1.33,5.01,0,8.7-.85,11.09-2.55,2.39-1.7,3.58-4.43,3.58-8.2,0-3.37-1.38-5.76-4.12-7.17-2.75-1.41-7.13-2.11-13.15-2.11h-5.45v-11.63h5.55c5.56,0,9.63-.73,12.2-2.18s3.85-3.95,3.85-7.49c0-5.43-3.4-8.15-10.21-8.15-2.36,0-4.75.39-7.19,1.18s-5.15,2.14-8.12,4.07l-7.02-10.45c6.54-4.71,14.35-7.07,23.41-7.07,7.43,0,13.29,1.51,17.59,4.52,4.3,3.01,6.45,7.2,6.45,12.56Z"
                :fill="eventClasses['day-23'].number" stroke-width="0"
              />
            </g>
          </g>
          <g id="day-09" :class="eventClasses['day-09'].cursor" :transform="eventClasses['day-09'].translate" @click.stop="handleClick">
            <rect
              x="536" y="923" width="205" height="208" rx="64.07" ry="64.07"
              transform="translate(1277 2054) rotate(-180)" :fill="eventClasses['day-09'].bg" stroke-width="0"
            />
            <circle cx="638.5" cy="1027" r="78.76" :fill="eventClasses['day-09'].circle" stroke-width="0" />
            <g>
              <path
                d="m634.52,1029.89c0,12.53-2.05,21.81-6.16,27.83-4.11,6.02-10.43,9.03-18.97,9.03s-14.52-3.11-18.72-9.33c-4.2-6.22-6.31-15.39-6.31-27.53s2.04-22,6.14-28c4.09-6,10.39-9.01,18.9-9.01s14.54,3.14,18.77,9.42,6.36,15.48,6.36,27.58Zm-35.09,0c0,8.8.76,15.11,2.28,18.92,1.52,3.81,4.08,5.72,7.68,5.72s6.09-1.93,7.66-5.79c1.57-3.86,2.36-10.14,2.36-18.85s-.79-15.12-2.38-18.97c-1.59-3.84-4.13-5.77-7.63-5.77s-6.12,1.92-7.66,5.77c-1.54,3.85-2.31,10.17-2.31,18.97Z"
                :fill="eventClasses['day-09'].number" stroke-width="0"
              />
              <path
                d="m691.99,1024.64c0,14.14-2.98,24.69-8.93,31.66-5.96,6.97-14.97,10.45-27.04,10.45-4.25,0-7.48-.23-9.67-.69v-12.17c2.75.69,5.63,1.03,8.64,1.03,5.07,0,9.24-.74,12.52-2.23,3.27-1.49,5.77-3.83,7.51-7.02,1.73-3.19,2.73-7.58,2.99-13.18h-.59c-1.9,3.08-4.09,5.24-6.58,6.48-2.49,1.24-5.59,1.86-9.33,1.86-6.25,0-11.17-2-14.77-6.01-3.6-4.01-5.4-9.58-5.4-16.71,0-7.69,2.18-13.77,6.55-18.23,4.37-4.47,10.31-6.7,17.84-6.7,5.3,0,9.94,1.24,13.91,3.73,3.98,2.49,7.03,6.09,9.15,10.82s3.19,10.36,3.19,16.91Zm-25.96-19.29c-3.14,0-5.6,1.08-7.36,3.24-1.77,2.16-2.65,5.27-2.65,9.33,0,3.47.8,6.22,2.41,8.25,1.6,2.03,4.04,3.04,7.31,3.04,3.08,0,5.71-1.01,7.9-3.02,2.19-2.01,3.29-4.33,3.29-6.95,0-3.89-1.02-7.18-3.07-9.87-2.04-2.68-4.66-4.02-7.83-4.02Z"
                :fill="eventClasses['day-09'].number" stroke-width="0"
              />
            </g>
          </g>
          <g id="day-22" :class="eventClasses['day-22'].cursor" :transform="eventClasses['day-22'].translate" @click.stop="handleClick">
            <rect
              x="339.36" y="831" width="190" height="300" rx="64.07" ry="64.07"
              transform="translate(868.72 1962) rotate(-180)" :fill="eventClasses['day-22'].bg" stroke-width="0"
            />
            <circle cx="434.36" cy="933.76" r="78.76" :fill="eventClasses['day-22'].circle" stroke-width="0" />
            <g>
              <path
                d="m431.91,971.77h-50.16v-10.55l18.01-18.21c5.33-5.46,8.82-9.25,10.45-11.36,1.64-2.11,2.81-4.07,3.53-5.87.72-1.8,1.08-3.66,1.08-5.59,0-2.88-.79-5.02-2.38-6.43-1.59-1.41-3.71-2.11-6.36-2.11-2.78,0-5.48.64-8.1,1.91-2.62,1.28-5.35,3.09-8.2,5.45l-8.25-9.77c3.53-3.01,6.46-5.14,8.79-6.38s4.86-2.2,7.61-2.87,5.82-1.01,9.23-1.01c4.48,0,8.44.82,11.88,2.45,3.44,1.64,6.1,3.93,8,6.87,1.9,2.95,2.85,6.32,2.85,10.11,0,3.31-.58,6.41-1.74,9.3-1.16,2.9-2.96,5.87-5.4,8.91-2.44,3.04-6.73,7.38-12.88,13.01l-9.23,8.69v.69h31.26v12.76Z"
                :fill="eventClasses['day-22'].number" stroke-width="0"
              />
              <path
                d="m489.29,971.77h-50.16v-10.55l18.01-18.21c5.33-5.46,8.82-9.25,10.45-11.36,1.64-2.11,2.81-4.07,3.53-5.87.72-1.8,1.08-3.66,1.08-5.59,0-2.88-.79-5.02-2.38-6.43-1.59-1.41-3.71-2.11-6.36-2.11-2.78,0-5.48.64-8.1,1.91-2.62,1.28-5.35,3.09-8.2,5.45l-8.25-9.77c3.53-3.01,6.46-5.14,8.79-6.38s4.86-2.2,7.61-2.87,5.82-1.01,9.23-1.01c4.48,0,8.44.82,11.88,2.45,3.44,1.64,6.1,3.93,8,6.87,1.9,2.95,2.85,6.32,2.85,10.11,0,3.31-.58,6.41-1.74,9.3-1.16,2.9-2.96,5.87-5.4,8.91-2.44,3.04-6.73,7.38-12.88,13.01l-9.23,8.69v.69h31.26v12.76Z"
                :fill="eventClasses['day-22'].number" stroke-width="0"
              />
            </g>
          </g>
          <g id="day-12" :class="eventClasses['day-12'].cursor" :transform="eventClasses['day-12'].translate" @click.stop="handleClick">
            <rect
              x="144" y="943" width="184" height="186" rx="64.07" ry="64.07"
              transform="translate(472 2072) rotate(180)" :fill="eventClasses['day-12'].bg" stroke-width="0"
            />
            <circle cx="236" cy="1036" r="78.76" :fill="eventClasses['day-12'].circle" stroke-width="0" />
            <g>
              <path
                d="m217.25,1075.77h-15.17v-41.52l.15-6.82.25-7.46c-2.52,2.52-4.27,4.17-5.25,4.96l-8.25,6.63-7.31-9.13,23.12-18.4h12.47v71.75Z"
                :fill="eventClasses['day-12'].number" stroke-width="0"
              />
              <path
                d="m287.29,1075.77h-50.16v-10.55l18.01-18.21c5.33-5.46,8.82-9.25,10.45-11.36,1.64-2.11,2.81-4.07,3.53-5.87.72-1.8,1.08-3.66,1.08-5.59,0-2.88-.79-5.02-2.38-6.43-1.59-1.41-3.71-2.11-6.36-2.11-2.78,0-5.48.64-8.1,1.91-2.62,1.28-5.35,3.09-8.2,5.45l-8.25-9.77c3.53-3.01,6.46-5.14,8.79-6.38s4.86-2.2,7.61-2.87,5.82-1.01,9.23-1.01c4.48,0,8.44.82,11.88,2.45,3.44,1.64,6.1,3.93,8,6.87,1.9,2.95,2.85,6.32,2.85,10.11,0,3.31-.58,6.41-1.74,9.3-1.16,2.9-2.96,5.87-5.4,8.91-2.44,3.04-6.73,7.38-12.88,13.01l-9.23,8.69v.69h31.26v12.76Z"
                :fill="eventClasses['day-12'].number" stroke-width="0"
              />
            </g>
          </g>
          <g id="day-18" :class="eventClasses['day-18'].cursor" :transform="eventClasses['day-18'].translate" @click.stop="handleClick">
            <rect
              x="86" y="1184" width="208" height="208" rx="63.03" ry="63.03"
              transform="translate(380 2576) rotate(180)" :fill="eventClasses['day-18'].bg" stroke-width="0"
            />
            <circle cx="190" cy="1288" r="78.76" :fill="eventClasses['day-18'].circle" stroke-width="0" />
            <g>
              <path
                d="m170.25,1323.77h-15.17v-41.52l.15-6.82.25-7.46c-2.52,2.52-4.27,4.17-5.25,4.96l-8.25,6.63-7.31-9.13,23.12-18.4h12.47v71.75Z"
                :fill="eventClasses['day-18'].number" stroke-width="0"
              />
              <path
                d="m214.87,1251.08c6.87,0,12.41,1.56,16.61,4.69,4.2,3.12,6.31,7.34,6.31,12.64,0,3.67-1.01,6.93-3.04,9.79-2.03,2.86-5.3,5.42-9.82,7.68,5.37,2.88,9.22,5.88,11.56,9.01,2.34,3.12,3.51,6.55,3.51,10.28,0,5.89-2.31,10.62-6.92,14.21s-10.68,5.37-18.21,5.37-14.02-1.67-18.5-5.01c-4.48-3.34-6.72-8.07-6.72-14.18,0-4.09,1.09-7.72,3.26-10.9,2.18-3.17,5.67-5.97,10.48-8.39-4.09-2.58-7.04-5.35-8.83-8.29-1.8-2.94-2.7-6.17-2.7-9.67,0-5.14,2.13-9.29,6.38-12.47,4.25-3.17,9.8-4.76,16.64-4.76Zm-11.19,53.59c0,2.81.98,5.01,2.94,6.58,1.96,1.57,4.65,2.36,8.05,2.36,3.76,0,6.58-.81,8.44-2.43,1.87-1.62,2.8-3.75,2.8-6.4,0-2.19-.92-4.25-2.77-6.16-1.85-1.91-4.85-3.95-9.01-6.11-6.97,3.21-10.45,7.26-10.45,12.17Zm11.09-42.5c-2.59,0-4.67.66-6.26,1.99-1.59,1.33-2.38,3.1-2.38,5.33,0,1.96.63,3.72,1.89,5.28,1.26,1.55,3.54,3.15,6.85,4.79,3.21-1.5,5.45-3.04,6.72-4.61,1.28-1.57,1.91-3.39,1.91-5.45,0-2.26-.82-4.04-2.45-5.35-1.64-1.31-3.73-1.96-6.28-1.96Z"
                :fill="eventClasses['day-18'].number" stroke-width="0"
              />
            </g>
          </g>
          <g id="day-13" :class="eventClasses['day-13'].cursor" :transform="eventClasses['day-13'].translate" @click.stop="handleClick">
            <rect
              x="309" y="1157" width="415" height="196" rx="63.03" ry="63.03"
              transform="translate(1033 2510) rotate(180)" :fill="eventClasses['day-13'].bg" stroke-width="0"
            />
            <circle cx="612.36" cy="1258.4" r="78.76" :fill="eventClasses['day-13'].circle" stroke-width="0" />
            <g>
              <path
                d="m594.25,1293.77h-15.17v-41.52l.15-6.82.25-7.46c-2.52,2.52-4.27,4.17-5.25,4.96l-8.25,6.63-7.31-9.13,23.12-18.4h12.47v71.75Z"
                :fill="eventClasses['day-13'].number" stroke-width="0"
              />
              <path
                d="m661.49,1238.07c0,4.48-1.36,8.29-4.07,11.44-2.72,3.14-6.53,5.3-11.44,6.48v.29c5.79.72,10.17,2.48,13.15,5.28,2.98,2.8,4.47,6.57,4.47,11.31,0,6.9-2.5,12.28-7.51,16.12-5.01,3.85-12.16,5.77-21.45,5.77-7.79,0-14.69-1.29-20.71-3.88v-12.91c2.78,1.41,5.84,2.55,9.18,3.44,3.34.88,6.64,1.33,9.92,1.33,5.01,0,8.7-.85,11.09-2.55,2.39-1.7,3.58-4.43,3.58-8.2,0-3.37-1.38-5.76-4.12-7.17-2.75-1.41-7.13-2.11-13.15-2.11h-5.45v-11.63h5.55c5.56,0,9.63-.73,12.2-2.18s3.85-3.95,3.85-7.49c0-5.43-3.4-8.15-10.21-8.15-2.36,0-4.75.39-7.19,1.18s-5.15,2.14-8.12,4.07l-7.02-10.45c6.54-4.71,14.35-7.07,23.41-7.07,7.43,0,13.29,1.51,17.59,4.52,4.3,3.01,6.45,7.2,6.45,12.56Z"
                :fill="eventClasses['day-13'].number" stroke-width="0"
              />
            </g>
          </g>
          <g id="day-19" :class="eventClasses['day-19'].cursor" :transform="eventClasses['day-19'].translate" @click.stop="handleClick">
            <rect
              x="534" y="1407" width="205" height="208" rx="64.07" ry="64.07" :fill="eventClasses['day-19'].bg"
              stroke-width="0"
            />
            <circle cx="636.5" cy="1511" r="78.76" :fill="eventClasses['day-19'].circle" stroke-width="0" />
            <g>
              <path
                d="m617.25,1546.77h-15.17v-41.52l.15-6.82.25-7.46c-2.52,2.52-4.27,4.17-5.25,4.96l-8.25,6.63-7.31-9.13,23.12-18.4h12.47v71.75Z"
                :fill="eventClasses['day-19'].number" stroke-width="0"
              />
              <path
                d="m686.99,1505.64c0,14.14-2.98,24.69-8.93,31.66-5.96,6.97-14.97,10.45-27.04,10.45-4.25,0-7.48-.23-9.67-.69v-12.17c2.75.69,5.63,1.03,8.64,1.03,5.07,0,9.24-.74,12.52-2.23,3.27-1.49,5.77-3.83,7.51-7.02,1.73-3.19,2.73-7.58,2.99-13.18h-.59c-1.9,3.08-4.09,5.24-6.58,6.48-2.49,1.24-5.59,1.86-9.33,1.86-6.25,0-11.17-2-14.77-6.01-3.6-4.01-5.4-9.58-5.4-16.71,0-7.69,2.18-13.77,6.55-18.23,4.37-4.47,10.31-6.7,17.84-6.7,5.3,0,9.94,1.24,13.91,3.73,3.98,2.49,7.03,6.09,9.15,10.82s3.19,10.36,3.19,16.91Zm-25.96-19.29c-3.14,0-5.6,1.08-7.36,3.24-1.77,2.16-2.65,5.27-2.65,9.33,0,3.47.8,6.22,2.41,8.25,1.6,2.03,4.04,3.04,7.31,3.04,3.08,0,5.71-1.01,7.9-3.02,2.19-2.01,3.29-4.33,3.29-6.95,0-3.89-1.02-7.18-3.07-9.87-2.04-2.68-4.66-4.02-7.83-4.02Z"
                :fill="eventClasses['day-19'].number" stroke-width="0"
              />
            </g>
          </g>
          <g id="day-14" :class="eventClasses['day-14'].cursor" :transform="eventClasses['day-14'].translate" @click.stop="handleClick">
            <rect
              x="144" y="1409" width="208" height="208" rx="63.03" ry="63.03" :fill="eventClasses['day-14'].bg"
              stroke-width="0"
            />
            <circle cx="248" cy="1513" r="78.76" :fill="eventClasses['day-14'].circle" stroke-width="0" />
            <g>
              <path
                d="m228.25,1546.77h-15.17v-41.52l.15-6.82.25-7.46c-2.52,2.52-4.27,4.17-5.25,4.96l-8.25,6.63-7.31-9.13,23.12-18.4h12.47v71.75Z"
                :fill="eventClasses['day-14'].number" stroke-width="0"
              />
              <path
                d="m299.91,1531.9h-8.64v14.87h-14.82v-14.87h-30.63v-10.55l31.46-46.33h13.99v45.1h8.64v11.78Zm-23.46-11.78v-12.17c0-2.03.08-4.97.25-8.83.16-3.86.29-6.1.39-6.72h-.39c-1.21,2.68-2.67,5.3-4.37,7.85l-13.15,19.88h17.28Z"
                :fill="eventClasses['day-14'].number" stroke-width="0"
              />
            </g>
          </g>
        </svg>
        <!-- eslint-enable max-len -->
      </div>
      <!-- Todo: Call API to get mystery wine boxes -->
      <div>
        <h2 class="h4 text-primary text-center pt-10">
          <span class="text-primary">{{ $t('eventProductsTitle') }}</span>
        </h2>
        <div
          v-if="collectionRef.products?.length"
          class="w-[min(100%,_50rem)] m-inline-auto flex gap-4 overflow-x-auto overflow-y-hidden p-4"
        >
          <div
            v-for="product in collectionRef.products"
            :key="product.shopify_product_id"
            class="flex-[0_0_160px] h-auto transition transition-box-shadow bg-white rounded-sm border border-gray-light p-2 hover:shadow-elevation"
          >
            <NuxtLink
              class="block"
              :aria-label="$t('enums.accessibility.labels.GO_TO_PRODUCT_DETAIL_PAGE')"
              :to="(product?.url) ? localeLocation(product.url) : '/'"
            >
              <img :src="product.image.source.url" :alt="product.image.thumbnail.altText" class="w-full h-auto object-contain">
            </NuxtLink>
            <NuxtLink
              class="block"
              :aria-label="$t('enums.accessibility.labels.GO_TO_PRODUCT_DETAIL_PAGE')"
              :to="(product?.url) ? localeLocation(product.url) : '/'"
            >
              <span class="line-clamp-3 mt-2 text-center text-xs text-gray-600">
                {{ product.title }}
              </span>
            </NuxtLink>
          </div>
        </div>
        <CmwButton
          v-if="collectionRef.products?.length"
          :to="localePath('/collections/calendario-avvento')"
          class="w-max m-inline-auto my-8"
          variant="ghost"
        >
          <span>{{ $t('common.cta.viewAll') }}</span>
        </CmwButton>
      </div>
    </div>
    <transition
      name="custom-classes-transition"
      enter-active-class="animated animate-zoomInUp animate-delay-300"
      leave-active-class="animated animate-zoomOutDown"
    >
      <div v-if="currentEvent?.key" class="splash absolute w-screen h-full">
        <CurrentEvent
          :current-event="currentEvent.reference"
          :current-day="currentDay"
          :current-event-day="currentEventDay"
          @close-event="currentEvent = undefined"
        />
      </div>
    </transition>
    <div v-if="!$cmwStore.isProd" class="fixed right-4 bottom-4 p-4 rounded bg-gray-lightest border border-primary">
      <div class="cmw-font-bold text-secondary-700 mb-4">
        This will show only for dev environments
      </div>
      <label class="block" for="calendar">Pick a day</label>
      <input
        id="calendar" v-model="date" name="calendar" type="date" min="2023-12-01" max="2023-12-31"
        @change="handleCalendarChange"
      >
      <pre class="text-xs">currentDay: {{ currentDay }}</pre>
    </div>
  </div>
</template>

<style scoped>
.l-page:before {
  @apply absolute block w-screen h-full -z-1;
  content: "";
  background-image: url('/bg-pattern.jpg');
  background-size: 500px;
  background-repeat: repeat;
  opacity: 0.40;
}

.splash {
  top: calc(var(--cmw-header-height) + 4rem);
}

svg g {
  transition: transform 0.6s ease-in-out;
}
</style>
