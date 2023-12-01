<script lang="ts">
import { computed, defineComponent, onMounted } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    currentDay: {
      type: Number,
      required: true,
    },
  },
  emits: ['handle-click', 'child-mounted'],
  setup(props, { emit }) {
    // const forwardAnimationsRef = inject('forwardAnimationsRef') as Ref<SVGAnimateElement[]>
    // const reverseAnimationsRef = inject('reverseAnimationsRef') as Ref<SVGAnimateElement[]>

    const eventClasses = computed(() => ({
      'day-01': {
        cursor: props.currentDay >= 1 ? 'cursor-pointer' : 'cursor-pointer',
        translate: '-50 -200',
        bg: '#b60f01',
        circle: props.currentDay === 1 ? 'white' : 'var(--inactive-bg)',
        number: props.currentDay === 1 ? '#b60f01' : 'var(--inactive-number)',
      },
      'day-02': {
        cursor: props.currentDay >= 2 ? 'cursor-pointer' : 'cursor-pointer',
        translate: '-500 0',
        bg: '#9a2545',
        circle: props.currentDay === 2 ? 'white' : 'var(--inactive-bg)',
        number: props.currentDay === 2 ? '#9a2545' : 'var(--inactive-number)',
      },
      'day-03': {
        cursor: props.currentDay >= 3 ? 'cursor-pointer' : 'cursor-pointer',
        translate: '-500 0',
        bg: '#9a2545',
        circle: props.currentDay === 3 ? 'white' : 'var(--inactive-bg)',
        number: props.currentDay === 3 ? '#9a2545' : 'var(--inactive-number)',
      },
      'day-04': {
        cursor: props.currentDay >= 4 ? 'cursor-pointer' : 'cursor-pointer',
        translate: '-500 0',
        bg: '#b60f01',
        circle: props.currentDay === 4 ? 'white' : 'var(--inactive-bg)',
        number: props.currentDay === 4 ? '#b60f01' : 'var(--inactive-number)',
      },
      'day-05': {
        cursor: props.currentDay >= 5 ? 'cursor-pointer' : 'cursor-pointer',
        translate: '500 50',
        bg: '#7b0704',
        circle: props.currentDay === 5 ? 'white' : 'var(--inactive-bg)',
        number: props.currentDay === 5 ? '#7b0704' : 'var(--inactive-number)',
      },
      'day-06': {
        cursor: props.currentDay >= 6 ? 'cursor-pointer' : 'cursor-pointer',
        translate: '-500 0',
        bg: '#c63f63',
        circle: props.currentDay === 6 ? 'white' : 'var(--inactive-bg)',
        number: props.currentDay === 6 ? '#c63f63' : 'var(--inactive-number)',
      },
      'day-07': {
        cursor: props.currentDay >= 7 ? 'cursor-pointer' : 'cursor-pointer',
        translate: '-500 0',
        bg: '#7b0404',
        circle: props.currentDay === 7 ? 'white' : 'var(--inactive-bg)',
        number: props.currentDay === 7 ? '#7b0404' : 'var(--inactive-number)',
      },
      'day-08': {
        cursor: props.currentDay >= 8 ? 'cursor-pointer' : 'cursor-pointer',
        translate: '0 -400',
        bg: '#c63f63',
        circle: props.currentDay === 8 ? 'white' : 'var(--inactive-bg)',
        number: props.currentDay === 8 ? '#c63f63' : 'var(--inactive-number)',
      },
      'day-09': {
        cursor: props.currentDay >= 9 ? 'cursor-pointer' : 'cursor-pointer',
        translate: '-500 0',
        bg: '#9a2645',
        circle: props.currentDay === 9 ? 'white' : 'var(--inactive-bg)',
        number: props.currentDay === 9 ? '#9a2645' : 'var(--inactive-number)',
      },
      'day-10': {
        cursor: props.currentDay >= 10 ? 'cursor-pointer' : 'cursor-pointer',
        translate: '-500 -100',
        bg: '#7b0404',
        circle: props.currentDay === 10 ? 'white' : 'var(--inactive-bg)',
        number: props.currentDay === 10 ? '#7b0404' : 'var(--inactive-number)',
      },
      'day-11': {
        cursor: props.currentDay >= 11 ? 'cursor-pointer' : 'cursor-pointer',
        translate: '-500 0',
        bg: '#7b0704',
        circle: props.currentDay === 11 ? 'white' : 'var(--inactive-bg)',
        number: props.currentDay === 11 ? '#7b0704' : 'var(--inactive-number)',
      },
      'day-12': {
        cursor: props.currentDay >= 12 ? 'cursor-pointer' : 'cursor-pointer',
        translate: '-500 0',
        bg: '#9a2645',
        circle: props.currentDay === 12 ? 'white' : 'var(--inactive-bg)',
        number: props.currentDay === 12 ? '#9a2645' : 'var(--inactive-number)',
      },
      'day-13': {
        cursor: props.currentDay >= 13 ? 'cursor-pointer' : 'cursor-pointer',
        translate: '-500 0',
        bg: '#b60101',
        circle: props.currentDay === 13 ? 'white' : 'var(--inactive-bg)',
        number: props.currentDay === 13 ? '#b60101' : 'var(--inactive-number)',
      },
      'day-14': {
        cursor: props.currentDay >= 14 ? 'cursor-pointer' : 'cursor-pointer',
        translate: '-500 0',
        bg: '#7b0404',
        circle: props.currentDay === 14 ? 'white' : 'var(--inactive-bg)',
        number: props.currentDay === 14 ? '#7b0404' : 'var(--inactive-number)',
      },
      'day-15': {
        cursor: props.currentDay >= 15 ? 'cursor-pointer' : 'cursor-pointer',
        translate: '-500 0',
        bg: '#7b0704',
        circle: props.currentDay === 15 ? 'white' : 'var(--inactive-bg)',
        number: props.currentDay === 15 ? '#7b0704' : 'var(--inactive-number)',
      },
      'day-16': {
        cursor: props.currentDay >= 16 ? 'cursor-pointer' : 'cursor-pointer',
        translate: '-500 0',
        bg: '#9a2545',
        circle: props.currentDay === 16 ? 'white' : 'var(--inactive-bg)',
        number: props.currentDay === 16 ? '#9a2545' : 'var(--inactive-number)',
      },
      'day-17': {
        cursor: props.currentDay >= 17 ? 'cursor-pointer' : 'cursor-pointer',
        translate: '-400 -50',
        bg: '#c63f63',
        circle: props.currentDay === 17 ? 'white' : 'var(--inactive-bg)',
        number: props.currentDay === 17 ? '#c63f63' : 'var(--inactive-number)',
      },
      'day-18': {
        cursor: props.currentDay >= 18 ? 'cursor-pointer' : 'cursor-pointer',
        translate: '-500 0',
        bg: '#c63f63',
        circle: props.currentDay === 18 ? 'white' : 'var(--inactive-bg)',
        number: props.currentDay === 18 ? '#c63f63' : 'var(--inactive-number)',
      },
      'day-19': {
        cursor: props.currentDay >= 19 ? 'cursor-pointer' : 'cursor-pointer',
        translate: '-500 0',
        bg: '#9a2645',
        circle: props.currentDay === 19 ? 'white' : 'var(--inactive-bg)',
        number: props.currentDay === 19 ? '#9a2645' : 'var(--inactive-number)',
      },
      'day-20': {
        cursor: props.currentDay >= 20 ? 'cursor-pointer' : 'cursor-pointer',
        translate: '500 -20',
        bg: '#9a2645',
        circle: props.currentDay === 20 ? 'white' : 'var(--inactive-bg)',
        number: props.currentDay === 20 ? '#9a2645' : 'var(--inactive-number)',
      },
      'day-21': {
        cursor: props.currentDay >= 21 ? 'cursor-pointer' : 'cursor-pointer',
        translate: '300 0',
        bg: '#c63f63',
        circle: props.currentDay === 21 ? 'white' : 'var(--inactive-bg)',
        number: props.currentDay === 21 ? '#c63f63' : 'var(--inactive-number)',
      },
      'day-22': {
        cursor: props.currentDay >= 22 ? 'cursor-pointer' : 'cursor-pointer',
        translate: '-500 0',
        bg: '#7b0704',
        circle: props.currentDay === 22 ? 'white' : 'var(--inactive-bg)',
        number: props.currentDay === 22 ? '#7b0704' : 'var(--inactive-number)',
      },
      'day-23': {
        cursor: props.currentDay >= 23 ? 'cursor-pointer' : 'cursor-pointer',
        translate: '-500 0',
        bg: '#b60f01',
        circle: props.currentDay === 23 ? 'white' : 'var(--inactive-bg)',
        number: props.currentDay === 23 ? '#b60f01' : 'var(--inactive-number)',
      },
      'day-24': {
        cursor: props.currentDay >= 24 ? 'cursor-pointer' : 'cursor-pointer',
        translate: '-500 0',
        bg: '#7b0404',
        circle: props.currentDay === 24 ? 'white' : 'var(--inactive-bg)',
        number: props.currentDay === 24 ? '#7b0404' : 'var(--inactive-number)',
      },
      'day-25': {
        cursor: props.currentDay >= 25 ? 'cursor-pointer' : 'cursor-pointer',
        translate: '-50 -500',
        bg: '#7b0704',
        circle: props.currentDay === 25 ? 'white' : 'var(--inactive-bg)',
        number: props.currentDay === 25 ? '#7b0704' : 'var(--inactive-number)',
      },
    }))

    const handleClick = ($evt: Event) => {
      emit('handle-click', $evt)
    }

    onMounted(() => { emit('child-mounted') })

    return {
      handleClick,
      eventClasses,
    }
  },
})
</script>

<template>
  <svg
    id="Layer_1" class="overflow-visible" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1242 1453"
  >
    <!-- eslint-disable max-len -->
    <g id="day-14" :class="eventClasses['day-14'].cursor" @click.stop="handleClick">
      <AnimateTransformDay from="0 0" :to="eventClasses['day-14'].translate" />
      <AnimateTransformDay :from="eventClasses['day-14'].translate" to="0 0" direction="reverse" />
      <rect
        x="79.17" y="70.2" width="208" height="208" rx="63.03" ry="63.03" :fill="eventClasses['day-14'].bg"
        stroke-width="0"
      />
      <circle cx="183.17" cy="174.2" r="78.76" :fill="eventClasses['day-14'].circle" stroke-width="0" />
      <g>
        <path
          d="m163.42,207.97h-15.17v-41.52l.15-6.82.25-7.46c-2.52,2.52-4.27,4.17-5.25,4.96l-8.25,6.63-7.31-9.13,23.12-18.4h12.47v71.75Z"
          :fill="eventClasses['day-14'].number" stroke-width="0"
        />
        <path
          d="m235.08,193.1h-8.64v14.87h-14.82v-14.87h-30.62v-10.55l31.46-46.33h13.99v45.1h8.64v11.78Zm-23.46-11.78v-12.17c0-2.03.08-4.97.25-8.83.16-3.86.29-6.1.39-6.72h-.39c-1.21,2.68-2.67,5.3-4.37,7.85l-13.15,19.88h17.28Z"
          :fill="eventClasses['day-14'].number" stroke-width="0"
        />
      </g>
    </g>
    <g id="day-23" :class="eventClasses['day-23'].cursor" @click.stop="handleClick">
      <AnimateTransformDay from="0 0" :to="eventClasses['day-23'].translate" />
      <AnimateTransformDay :from="eventClasses['day-23'].translate" to="0 0" direction="reverse" />
      <rect
        x="532" y="82" width="422" height="199.83" rx="63.03" ry="63.03"
        transform="translate(1486 363.83) rotate(180)" :fill="eventClasses['day-23'].bg" stroke-width="0"
      />
      <circle cx="743" cy="181.92" r="78.76" :fill="eventClasses['day-23'].circle" stroke-width="0" />
      <g>
        <path
          d="m739.81,217.98h-50.16v-10.55l18.01-18.21c5.33-5.46,8.82-9.25,10.45-11.36,1.64-2.11,2.81-4.07,3.53-5.87.72-1.8,1.08-3.66,1.08-5.59,0-2.88-.79-5.02-2.38-6.43-1.59-1.41-3.71-2.11-6.36-2.11-2.78,0-5.48.64-8.1,1.91-2.62,1.28-5.35,3.09-8.2,5.45l-8.25-9.77c3.53-3.01,6.46-5.14,8.79-6.38,2.32-1.24,4.86-2.2,7.61-2.87,2.75-.67,5.82-1.01,9.23-1.01,4.48,0,8.44.82,11.88,2.45,3.44,1.64,6.1,3.93,8,6.87,1.9,2.94,2.85,6.31,2.85,10.11,0,3.31-.58,6.4-1.74,9.3-1.16,2.9-2.96,5.86-5.4,8.91s-6.73,7.38-12.88,13.01l-9.23,8.69v.69h31.26v12.76Z"
          :fill="eventClasses['day-23'].number" stroke-width="0"
        />
        <path
          d="m794.39,162.28c0,4.48-1.36,8.29-4.07,11.44s-6.53,5.3-11.44,6.48v.29c5.79.72,10.18,2.48,13.15,5.28,2.98,2.8,4.47,6.57,4.47,11.31,0,6.9-2.5,12.28-7.51,16.12-5.01,3.85-12.16,5.77-21.45,5.77-7.79,0-14.69-1.29-20.71-3.88v-12.91c2.78,1.41,5.84,2.55,9.18,3.44s6.64,1.33,9.91,1.33c5.01,0,8.7-.85,11.09-2.55,2.39-1.7,3.58-4.43,3.58-8.2,0-3.37-1.37-5.76-4.12-7.17-2.75-1.41-7.13-2.11-13.15-2.11h-5.45v-11.63h5.55c5.56,0,9.63-.73,12.2-2.18,2.57-1.46,3.85-3.95,3.85-7.48,0-5.43-3.4-8.15-10.21-8.15-2.36,0-4.75.39-7.19,1.18-2.44.79-5.15,2.14-8.12,4.07l-7.02-10.45c6.54-4.71,14.35-7.07,23.41-7.07,7.43,0,13.29,1.51,17.6,4.52,4.3,3.01,6.45,7.2,6.45,12.56Z"
          :fill="eventClasses['day-23'].number" stroke-width="0"
        />
      </g>
    </g>
    <g id="day-05" :class="eventClasses['day-05'].cursor" @click.stop="handleClick">
      <AnimateTransformDay from="0 0" :to="eventClasses['day-05'].translate" />
      <AnimateTransformDay :from="eventClasses['day-05'].translate" to="0 0" direction="reverse" />
      <rect
        x="970.12" y="35.12" width="211.88" height="211.88" rx="64.07" ry="64.07" :fill="eventClasses['day-05'].bg"
        stroke-width="0"
      />
      <circle cx="1076.06" cy="141.06" r="78.76" :fill="eventClasses['day-05'].circle" stroke-width="0" />
      <path
        d="m1079.68,132.05c6.94,0,12.46,1.95,16.56,5.84,4.11,3.89,6.16,9.23,6.16,16,0,8.02-2.47,14.18-7.41,18.5-4.94,4.32-12.01,6.48-21.2,6.48-7.98,0-14.43-1.29-19.34-3.88v-13.1c2.58,1.37,5.6,2.5,9.03,3.36,3.44.87,6.69,1.3,9.77,1.3,9.26,0,13.89-3.8,13.89-11.39s-4.79-10.85-14.38-10.85c-1.73,0-3.65.17-5.74.52s-3.8.71-5.1,1.1l-6.04-3.24,2.7-36.56h38.92v12.86h-25.62l-1.33,14.09,1.72-.34c2-.46,4.47-.69,7.41-.69Z"
        :fill="eventClasses['day-05'].number" stroke-width="0"
      />
    </g>
    <g id="day-16" :class="eventClasses['day-16'].cursor" @click.stop="handleClick">
      <AnimateTransformDay from="0 0" :to="eventClasses['day-16'].translate" />
      <AnimateTransformDay :from="eventClasses['day-16'].translate" to="0 0" direction="reverse" />
      <rect
        x="308.41" y="38.3" width="208" height="208" rx="63.03" ry="63.03" :fill="eventClasses['day-16'].bg"
        stroke-width="0"
      />
      <circle cx="412.69" cy="142.1" r="78.76" :fill="eventClasses['day-16'].circle" stroke-width="0" />
      <g>
        <path
          d="m394.13,180.09h-15.17v-41.52l.15-6.82.25-7.46c-2.52,2.52-4.27,4.17-5.25,4.96l-8.25,6.63-7.31-9.13,23.12-18.4h12.47v71.75Z"
          :fill="eventClasses['day-16'].number" stroke-width="0"
        />
        <path
          d="m413.52,149.61c0-14.2,3-24.77,9.01-31.71,6-6.94,14.99-10.4,26.97-10.4,4.09,0,7.3.25,9.62.74v12.12c-2.91-.65-5.79-.98-8.64-.98-5.2,0-9.45.79-12.74,2.36-3.29,1.57-5.75,3.89-7.39,6.97-1.64,3.08-2.6,7.44-2.9,13.1h.64c3.24-5.56,8.42-8.34,15.56-8.34,6.41,0,11.44,2.01,15.07,6.04,3.63,4.02,5.45,9.59,5.45,16.69,0,7.66-2.16,13.72-6.48,18.18s-10.31,6.7-17.96,6.7c-5.3,0-9.92-1.23-13.86-3.68-3.94-2.45-6.99-6.04-9.13-10.75-2.14-4.71-3.21-10.39-3.21-17.03Zm25.91,19.34c3.24,0,5.73-1.09,7.46-3.26,1.73-2.18,2.6-5.28,2.6-9.3,0-3.5-.81-6.26-2.43-8.27-1.62-2.01-4.07-3.02-7.34-3.02-3.08,0-5.7,1-7.88,2.99-2.18,2-3.26,4.32-3.26,6.97,0,3.89,1.02,7.18,3.07,9.87,2.04,2.68,4.64,4.02,7.78,4.02Z"
          :fill="eventClasses['day-16'].number" stroke-width="0"
        />
      </g>
    </g>
    <g id="day-22" :class="eventClasses['day-22'].cursor" @click.stop="handleClick">
      <AnimateTransformDay from="0 0" :to="eventClasses['day-22'].translate" />
      <AnimateTransformDay :from="eventClasses['day-22'].translate" to="0 0" direction="reverse" />
      <rect
        x="45.75" y="296.4" width="209.5" height="211.58" rx="64.07" ry="64.07"
        transform="translate(301.01 804.38) rotate(-180)" :fill="eventClasses['day-22'].bg" stroke-width="0"
      />
      <circle cx="150.5" cy="402.19" r="78.76" :fill="eventClasses['day-22'].circle" stroke-width="0" />
      <g>
        <path
          d="m148.06,440.2h-50.16v-10.55l18.01-18.21c5.33-5.46,8.82-9.25,10.45-11.36,1.64-2.11,2.81-4.07,3.53-5.87.72-1.8,1.08-3.66,1.08-5.59,0-2.88-.79-5.02-2.38-6.43-1.59-1.41-3.71-2.11-6.36-2.11-2.78,0-5.48.64-8.1,1.91-2.62,1.28-5.35,3.09-8.2,5.45l-8.25-9.77c3.53-3.01,6.46-5.14,8.79-6.38,2.32-1.24,4.86-2.2,7.61-2.87,2.75-.67,5.82-1.01,9.23-1.01,4.48,0,8.44.82,11.88,2.45,3.44,1.64,6.1,3.93,8,6.87,1.9,2.94,2.85,6.31,2.85,10.11,0,3.31-.58,6.4-1.74,9.3-1.16,2.9-2.96,5.86-5.4,8.91s-6.73,7.38-12.88,13.01l-9.23,8.69v.69h31.26v12.76Z"
          :fill="eventClasses['day-22'].number" stroke-width="0"
        />
        <path
          d="m205.43,440.2h-50.16v-10.55l18.01-18.21c5.33-5.46,8.82-9.25,10.45-11.36,1.64-2.11,2.81-4.07,3.53-5.87.72-1.8,1.08-3.66,1.08-5.59,0-2.88-.79-5.02-2.38-6.43-1.59-1.41-3.71-2.11-6.36-2.11-2.78,0-5.48.64-8.1,1.91-2.62,1.28-5.35,3.09-8.2,5.45l-8.25-9.77c3.53-3.01,6.46-5.14,8.79-6.38,2.32-1.24,4.86-2.2,7.61-2.87,2.75-.67,5.82-1.01,9.23-1.01,4.48,0,8.44.82,11.88,2.45,3.44,1.64,6.1,3.93,8,6.87,1.9,2.94,2.85,6.31,2.85,10.11,0,3.31-.58,6.4-1.74,9.3-1.16,2.9-2.96,5.86-5.4,8.91s-6.73,7.38-12.88,13.01l-9.23,8.69v.69h31.26v12.76Z"
          :fill="eventClasses['day-22'].number" stroke-width="0"
        />
      </g>
    </g>
    <g id="day-18" :class="eventClasses['day-18'].cursor" @click.stop="handleClick">
      <AnimateTransformDay from="0 0" :to="eventClasses['day-18'].translate" />
      <AnimateTransformDay :from="eventClasses['day-18'].translate" to="0 0" direction="reverse" />
      <rect
        x="274.45" y="269.75" width="208" height="208" rx="63.03" ry="63.03"
        transform="translate(756.89 747.49) rotate(180)" :fill="eventClasses['day-18'].bg" stroke-width="0"
      />
      <circle cx="378.45" cy="373.75" r="78.76" :fill="eventClasses['day-18'].circle" stroke-width="0" />
      <g>
        <path
          d="m358.7,409.52h-15.17v-41.52l.15-6.82.25-7.46c-2.52,2.52-4.27,4.17-5.25,4.96l-8.25,6.63-7.31-9.13,23.12-18.4h12.47v71.75Z"
          :fill="eventClasses['day-18'].number" stroke-width="0"
        />
        <path
          d="m403.31,336.83c6.87,0,12.41,1.56,16.61,4.69,4.2,3.12,6.31,7.34,6.31,12.64,0,3.67-1.01,6.93-3.04,9.79-2.03,2.86-5.3,5.42-9.82,7.68,5.37,2.88,9.22,5.88,11.56,9.01,2.34,3.12,3.51,6.55,3.51,10.28,0,5.89-2.31,10.63-6.92,14.21s-10.68,5.37-18.21,5.37-14.02-1.67-18.5-5.01c-4.48-3.34-6.72-8.07-6.72-14.18,0-4.09,1.09-7.72,3.26-10.9,2.18-3.17,5.67-5.97,10.48-8.39-4.09-2.58-7.04-5.35-8.83-8.29-1.8-2.94-2.7-6.17-2.7-9.67,0-5.14,2.13-9.29,6.38-12.47,4.25-3.17,9.8-4.76,16.64-4.76Zm-11.19,53.6c0,2.81.98,5.01,2.95,6.58,1.96,1.57,4.65,2.36,8.05,2.36,3.76,0,6.58-.81,8.44-2.43s2.8-3.75,2.8-6.4c0-2.19-.92-4.25-2.77-6.16-1.85-1.91-4.85-3.95-9.01-6.11-6.97,3.21-10.45,7.26-10.45,12.17Zm11.09-42.5c-2.58,0-4.67.66-6.26,1.99-1.59,1.33-2.38,3.1-2.38,5.33,0,1.96.63,3.72,1.89,5.28,1.26,1.55,3.54,3.15,6.85,4.79,3.21-1.5,5.45-3.04,6.72-4.61,1.28-1.57,1.91-3.39,1.91-5.45,0-2.26-.82-4.04-2.45-5.35-1.64-1.31-3.73-1.96-6.28-1.96Z"
          :fill="eventClasses['day-18'].number" stroke-width="0"
        />
      </g>
    </g>
    <g id="day-11" :class="eventClasses['day-11'].cursor" @click.stop="handleClick">
      <AnimateTransformDay from="0 0" :to="eventClasses['day-11'].translate" />
      <AnimateTransformDay :from="eventClasses['day-11'].translate" to="0 0" direction="reverse" />
      <rect
        x="500.18" y="297.72" width="190.82" height="302.28" rx="64.07" ry="64.07"
        transform="translate(1191.18 897.72) rotate(-180)" :fill="eventClasses['day-11'].bg" stroke-width="0"
      />
      <circle cx="595.59" cy="448.86" r="78.76" :fill="eventClasses['day-11'].circle" stroke-width="0" />
      <g>
        <path
          d="m579.43,486.49h-15.17v-41.52l.15-6.82.25-7.46c-2.52,2.52-4.27,4.17-5.25,4.96l-8.25,6.63-7.31-9.13,23.12-18.4h12.47v71.75Z"
          :fill="eventClasses['day-11'].number" stroke-width="0"
        />
        <path
          d="m636.81,486.49h-15.17v-41.52l.15-6.82.25-7.46c-2.52,2.52-4.27,4.17-5.25,4.96l-8.25,6.63-7.31-9.13,23.12-18.4h12.47v71.75Z"
          :fill="eventClasses['day-11'].number" stroke-width="0"
        />
      </g>
    </g>
    <g id="day-07" :class="eventClasses['day-07'].cursor" @click.stop="handleClick">
      <AnimateTransformDay from="0 0" :to="eventClasses['day-07'].translate" />
      <AnimateTransformDay :from="eventClasses['day-07'].translate" to="0 0" direction="reverse" />
      <rect
        x="706.99" y="297.44" width="187.26" height="187.01" rx="64.07" ry="64.07" :fill="eventClasses['day-07'].bg"
        stroke-width="0"
      />
      <circle cx="800.63" cy="390.94" r="78.76" :fill="eventClasses['day-07'].circle" stroke-width="0" />
      <path
        d="m783.82,432.76l26.94-58.9h-35.39v-12.76h51.49v9.52l-27.14,62.13h-15.9Z" :fill="eventClasses['day-07'].number"
        stroke-width="0"
      />
    </g>
    <g id="day-01" :class="eventClasses['day-01'].cursor" @click.stop="handleClick">
      <AnimateTransformDay from="0 0" :to="eventClasses['day-01'].translate" />
      <AnimateTransformDay :from="eventClasses['day-01'].translate" to="0 0" direction="reverse" />
      <rect
        x="912.07" y="264.2" width="190" height="192.64" rx="64.07" ry="64.07"
        :fill="eventClasses['day-01'].bg" stroke-width="0"
      />
      <circle cx="1007.07" cy="360.52" r="78.76" :fill="eventClasses['day-01'].circle" stroke-width="0" />
      <path
        d="m1019.01,398.13h-15.17v-41.52l.15-6.82.25-7.46c-2.52,2.52-4.27,4.17-5.25,4.96l-8.25,6.63-7.31-9.13,23.12-18.4h12.47v71.75Z"
        :fill="eventClasses['day-01'].number" stroke-width="0"
      />
    </g>
    <g id="day-20" :class="eventClasses['day-20'].cursor" @click.stop="handleClick">
      <AnimateTransformDay from="0 0" :to="eventClasses['day-20'].translate" />
      <AnimateTransformDay :from="eventClasses['day-20'].translate" to="0 0" direction="reverse" />
      <rect
        x="75.82" y="523.47" width="189.75" height="189.62" rx="64.07" ry="64.07" :fill="eventClasses['day-20'].bg"
        stroke-width="0"
      />
      <circle cx="170.69" cy="618.28" r="78.76" :fill="eventClasses['day-20'].circle" stroke-width="0" />
      <g>
        <path
          d="m166.17,653.15h-50.16v-10.55l18.01-18.21c5.33-5.46,8.82-9.25,10.45-11.36,1.64-2.11,2.81-4.07,3.53-5.87.72-1.8,1.08-3.66,1.08-5.59,0-2.88-.79-5.02-2.38-6.43-1.59-1.41-3.71-2.11-6.36-2.11-2.78,0-5.48.64-8.1,1.91-2.62,1.28-5.35,3.09-8.2,5.45l-8.25-9.77c3.53-3.01,6.46-5.14,8.79-6.38,2.32-1.24,4.86-2.2,7.61-2.87,2.75-.67,5.82-1.01,9.23-1.01,4.48,0,8.44.82,11.88,2.45,3.44,1.64,6.1,3.93,8,6.87,1.9,2.94,2.85,6.31,2.85,10.11,0,3.31-.58,6.4-1.74,9.3-1.16,2.9-2.96,5.86-5.4,8.91s-6.73,7.38-12.88,13.01l-9.23,8.69v.69h31.26v12.76Z"
          :fill="eventClasses['day-20'].number" stroke-width="0"
        />
        <path
          d="m223.15,617.27c0,12.53-2.05,21.81-6.16,27.83-4.11,6.02-10.43,9.03-18.97,9.03s-14.52-3.11-18.72-9.33c-4.2-6.22-6.31-15.39-6.31-27.53s2.04-22,6.14-28c4.09-6,10.39-9.01,18.9-9.01s14.54,3.14,18.77,9.42c4.24,6.28,6.36,15.48,6.36,27.58Zm-35.09,0c0,8.8.76,15.11,2.28,18.92,1.52,3.81,4.08,5.72,7.68,5.72s6.09-1.93,7.66-5.79c1.57-3.86,2.36-10.14,2.36-18.85s-.79-15.12-2.38-18.97c-1.59-3.84-4.13-5.77-7.63-5.77s-6.12,1.92-7.66,5.77c-1.54,3.85-2.31,10.17-2.31,18.97Z"
          :fill="eventClasses['day-20'].number" stroke-width="0"
        />
      </g>
    </g>
    <g id="day-03" :class="eventClasses['day-03'].cursor" @click.stop="handleClick">
      <AnimateTransformDay from="0 0" :to="eventClasses['day-03'].translate" />
      <AnimateTransformDay translate="rotate" from="0" to="90" />
      <AnimateTransformDay :from="eventClasses['day-03'].translate" to="0 0" direction="reverse" />
      <AnimateTransformDay translate="rotate" from="90" to="0" direction="reverse" />
      <rect
        x="282.74" y="524.3" width="190.52" height="192.4" rx="63.03" ry="63.03"
        :fill="eventClasses['day-03'].bg"
        stroke-width="0"
      />
      <circle cx="378" cy="620.5" r="78.76" :fill="eventClasses['day-03'].circle" stroke-width="0" />
      <path
        d="m400.94,601.66c0,4.48-1.36,8.29-4.07,11.44-2.72,3.14-6.53,5.3-11.44,6.48v.29c5.79.72,10.17,2.48,13.15,5.28,2.98,2.8,4.47,6.57,4.47,11.31,0,6.9-2.5,12.28-7.51,16.12-5.01,3.85-12.16,5.77-21.45,5.77-7.79,0-14.69-1.29-20.71-3.88v-12.91c2.78,1.41,5.84,2.55,9.18,3.44,3.34.88,6.64,1.33,9.92,1.33,5.01,0,8.7-.85,11.09-2.55,2.39-1.7,3.58-4.43,3.58-8.2,0-3.37-1.37-5.76-4.12-7.17-2.75-1.41-7.13-2.11-13.15-2.11h-5.45v-11.63h5.55c5.56,0,9.63-.73,12.2-2.18,2.57-1.46,3.85-3.95,3.85-7.48,0-5.43-3.4-8.15-10.21-8.15-2.36,0-4.75.39-7.19,1.18-2.44.79-5.15,2.14-8.12,4.07l-7.02-10.45c6.54-4.71,14.35-7.07,23.41-7.07,7.43,0,13.29,1.51,17.6,4.52,4.3,3.01,6.45,7.2,6.45,12.56Z"
        :fill="eventClasses['day-03'].number" stroke-width="0"
      />
    </g>
    <g id="day-19" :class="eventClasses['day-19'].cursor" @click.stop="handleClick">
      <AnimateTransformDay from="0 0" :to="eventClasses['day-19'].translate" />
      <AnimateTransformDay :from="eventClasses['day-19'].translate" to="0 0" direction="reverse" />
      <rect
        x="707" y="496.42" width="259" height="192.58" rx="64.07" ry="64.07" :fill="eventClasses['day-19'].bg"
        stroke-width="0"
      />
      <circle cx="836.5" cy="592.71" r="78.76" :fill="eventClasses['day-19'].circle" stroke-width="0" />
      <g>
        <path
          d="m816.67,629.19h-15.17v-41.52l.15-6.82.25-7.46c-2.52,2.52-4.27,4.17-5.25,4.96l-8.25,6.63-7.31-9.13,23.12-18.4h12.47v71.75Z"
          :fill="eventClasses['day-19'].number" stroke-width="0"
        />
        <path
          d="m886.41,588.07c0,14.14-2.98,24.69-8.93,31.66-5.96,6.97-14.97,10.45-27.04,10.45-4.25,0-7.48-.23-9.67-.69v-12.17c2.75.69,5.63,1.03,8.64,1.03,5.07,0,9.24-.74,12.52-2.23,3.27-1.49,5.77-3.83,7.51-7.02,1.73-3.19,2.73-7.58,2.99-13.18h-.59c-1.9,3.08-4.09,5.24-6.58,6.48s-5.59,1.86-9.33,1.86c-6.25,0-11.17-2-14.77-6.01-3.6-4.01-5.4-9.58-5.4-16.71,0-7.69,2.18-13.77,6.55-18.23,4.37-4.47,10.31-6.7,17.84-6.7,5.3,0,9.94,1.24,13.91,3.73,3.98,2.49,7.03,6.09,9.15,10.82,2.13,4.73,3.19,10.36,3.19,16.91Zm-25.96-19.29c-3.14,0-5.6,1.08-7.36,3.24s-2.65,5.27-2.65,9.33c0,3.47.8,6.22,2.41,8.25,1.6,2.03,4.04,3.04,7.31,3.04,3.08,0,5.71-1.01,7.9-3.02,2.19-2.01,3.29-4.33,3.29-6.94,0-3.89-1.02-7.18-3.07-9.87-2.04-2.68-4.66-4.02-7.83-4.02Z"
          :fill="eventClasses['day-19'].number" stroke-width="0"
        />
      </g>
    </g>
    <g id="day-15" :class="eventClasses['day-15'].cursor" @click.stop="handleClick">
      <AnimateTransformDay from="0 0" :to="eventClasses['day-15'].translate" />
      <AnimateTransformDay :from="eventClasses['day-15'].translate" to="0 0" direction="reverse" />
      <rect
        x="988.61" y="472.38" width="192.39" height="302.62" rx="63.03" ry="63.03"
        transform="translate(2169.61 1247.38) rotate(180)" :fill="eventClasses['day-15'].bg" stroke-width="0"
      />
      <circle cx="1084.8" cy="623.69" r="78.76" :fill="eventClasses['day-15'].circle" stroke-width="0" />
      <g>
        <path
          d="m1062.86,662.15h-15.17v-41.52l.15-6.82.25-7.46c-2.52,2.52-4.27,4.17-5.25,4.96l-8.25,6.63-7.31-9.13,23.12-18.4h12.47v71.75Z"
          :fill="eventClasses['day-15'].number" stroke-width="0"
        />
        <path
          d="m1108.85,616.31c6.94,0,12.46,1.95,16.56,5.84,4.11,3.89,6.16,9.23,6.16,16,0,8.02-2.47,14.18-7.41,18.5-4.94,4.32-12.01,6.48-21.2,6.48-7.98,0-14.43-1.29-19.34-3.88v-13.1c2.58,1.38,5.59,2.5,9.03,3.36,3.44.87,6.69,1.3,9.77,1.3,9.26,0,13.89-3.8,13.89-11.39s-4.79-10.85-14.38-10.85c-1.74,0-3.65.17-5.74.52s-3.79.71-5.1,1.1l-6.04-3.24,2.7-36.56h38.92v12.86h-25.62l-1.33,14.09,1.72-.34c2-.46,4.47-.69,7.41-.69Z"
          :fill="eventClasses['day-15'].number" stroke-width="0"
        />
      </g>
    </g>
    <g id="day-13" :class="eventClasses['day-13'].cursor" @click.stop="handleClick">
      <AnimateTransformDay from="0 0" :to="eventClasses['day-13'].translate" />
      <AnimateTransformDay :from="eventClasses['day-13'].translate" to="0 0" direction="reverse" />
      <rect
        x="43.86" y="729.57" width="212.87" height="384" rx="63.03" ry="63.03"
        transform="translate(300.6 1843.14) rotate(180)" :fill="eventClasses['day-13'].bg" stroke-width="0"
      />
      <circle cx="150.3" cy="921.57" r="78.76" :fill="eventClasses['day-13'].circle" stroke-width="0" />
      <g>
        <path
          d="m131.05,956.52h-15.17v-41.52l.15-6.82.25-7.46c-2.52,2.52-4.27,4.17-5.25,4.96l-8.25,6.63-7.31-9.13,23.12-18.41h12.47v71.75Z"
          :fill="eventClasses['day-13'].number" stroke-width="0"
        />
        <path
          d="m198.29,900.81c0,4.48-1.36,8.29-4.07,11.44-2.72,3.14-6.53,5.3-11.44,6.48v.29c5.79.72,10.17,2.48,13.15,5.28,2.98,2.8,4.47,6.57,4.47,11.31,0,6.9-2.5,12.28-7.51,16.12-5.01,3.84-12.16,5.77-21.45,5.77-7.79,0-14.69-1.29-20.71-3.88v-12.91c2.78,1.41,5.84,2.55,9.18,3.44,3.34.88,6.64,1.33,9.92,1.33,5.01,0,8.7-.85,11.09-2.55,2.39-1.7,3.58-4.43,3.58-8.2,0-3.37-1.38-5.76-4.12-7.17-2.75-1.41-7.13-2.11-13.15-2.11h-5.45v-11.63h5.55c5.56,0,9.63-.73,12.2-2.18s3.85-3.95,3.85-7.49c0-5.43-3.4-8.15-10.21-8.15-2.36,0-4.75.39-7.19,1.18s-5.15,2.14-8.12,4.07l-7.02-10.46c6.54-4.71,14.35-7.07,23.41-7.07,7.43,0,13.29,1.5,17.59,4.52,4.3,3.01,6.45,7.2,6.45,12.56Z"
          :fill="eventClasses['day-13'].number" stroke-width="0"
        />
      </g>
    </g>
    <g id="day-21" :class="eventClasses['day-21'].cursor" @click.stop="handleClick">
      <AnimateTransformDay from="0 0" :to="eventClasses['day-21'].translate" />
      <AnimateTransformDay :from="eventClasses['day-21'].translate" to="0 0" direction="reverse" />
      <rect
        x="280.7" y="730.68" width="192.3" height="192.32" rx="64.07" ry="64.07"
        :fill="eventClasses['day-21'].bg" stroke-width="0"
      />
      <circle cx="376.85" cy="826.84" r="78.76" :fill="eventClasses['day-21'].circle" stroke-width="0" />
      <g>
        <path
          d="m373.61,862.45h-50.16v-10.55l18.01-18.21c5.33-5.46,8.82-9.25,10.45-11.36,1.64-2.11,2.81-4.07,3.53-5.87.72-1.8,1.08-3.66,1.08-5.59,0-2.88-.79-5.02-2.38-6.43-1.59-1.41-3.71-2.11-6.36-2.11-2.78,0-5.48.64-8.1,1.91-2.62,1.28-5.35,3.09-8.2,5.45l-8.25-9.77c3.53-3.01,6.46-5.14,8.79-6.38,2.32-1.24,4.86-2.2,7.61-2.87,2.75-.67,5.82-1.01,9.23-1.01,4.48,0,8.44.82,11.88,2.45,3.44,1.64,6.1,3.93,8,6.87s2.85,6.31,2.85,10.11c0,3.31-.58,6.4-1.74,9.3-1.16,2.9-2.96,5.86-5.4,8.91-2.44,3.04-6.73,7.38-12.88,13.01l-9.23,8.69v.69h31.26v12.76Z"
          :fill="eventClasses['day-21'].number" stroke-width="0"
        />
        <path
          d="m418.32,862.45h-15.17v-41.52l.15-6.82.25-7.46c-2.52,2.52-4.27,4.17-5.25,4.96l-8.25,6.63-7.31-9.13,23.12-18.4h12.47v71.75Z"
          :fill="eventClasses['day-21'].number" stroke-width="0"
        />
      </g>
    </g>
    <g id="day-24" :class="eventClasses['day-24'].cursor" @click.stop="handleClick">
      <AnimateTransformDay from="0 0" :to="eventClasses['day-24'].translate" />
      <AnimateTransformDay :from="eventClasses['day-24'].translate" to="0 0" direction="reverse" />
      <rect
        x="496.89" y="613.77" width="196.11" height="308.23" rx="64.07" ry="64.07"
        transform="translate(1189.89 1535.77) rotate(180)" :fill="eventClasses['day-24'].bg" stroke-width="0"
      />
      <circle cx="594.94" cy="767.89" r="78.76" :fill="eventClasses['day-24'].circle" stroke-width="0" />
      <g>
        <path
          d="m591.8,804.54h-50.16v-10.55l18.01-18.21c5.33-5.46,8.82-9.25,10.45-11.36,1.64-2.11,2.81-4.07,3.53-5.87.72-1.8,1.08-3.66,1.08-5.59,0-2.88-.79-5.02-2.38-6.43-1.59-1.41-3.71-2.11-6.36-2.11-2.78,0-5.48.64-8.1,1.91-2.62,1.28-5.35,3.09-8.2,5.45l-8.25-9.77c3.53-3.01,6.46-5.14,8.79-6.38,2.32-1.24,4.86-2.2,7.61-2.87,2.75-.67,5.82-1.01,9.23-1.01,4.48,0,8.44.82,11.88,2.45,3.44,1.64,6.1,3.93,8,6.87,1.9,2.94,2.85,6.31,2.85,10.11,0,3.31-.58,6.4-1.74,9.3-1.16,2.9-2.96,5.86-5.4,8.91s-6.73,7.38-12.88,13.01l-9.23,8.69v.69h31.26v12.76Z"
          :fill="eventClasses['day-24'].number" stroke-width="0"
        />
        <path
          d="m650.79,789.67h-8.64v14.87h-14.82v-14.87h-30.62v-10.55l31.46-46.33h13.99v45.1h8.64v11.78Zm-23.46-11.78v-12.17c0-2.03.08-4.97.25-8.83.16-3.86.29-6.1.39-6.72h-.39c-1.21,2.68-2.67,5.3-4.37,7.85l-13.15,19.88h17.28Z"
          :fill="eventClasses['day-24'].number" stroke-width="0"
        />
      </g>
    </g>
    <g id="day-06" :class="eventClasses['day-06'].cursor" @click.stop="handleClick">
      <AnimateTransformDay from="0 0" :to="eventClasses['day-06'].translate" />
      <AnimateTransformDay :from="eventClasses['day-06'].translate" to="0 0" direction="reverse" />
      <rect
        x="716.5" y="704.09" width="187.5" height="184.91" rx="63.03" ry="63.03"
        transform="translate(1620.5 1593.09) rotate(-180)" :fill="eventClasses['day-06'].bg" stroke-width="0"
      />
      <circle cx="810.25" cy="796.54" r="78.76" :fill="eventClasses['day-06'].circle" stroke-width="0" />
      <path
        d="m785.45,803.38c0-14.2,3-24.77,9.01-31.71,6-6.94,14.99-10.4,26.97-10.4,4.09,0,7.3.25,9.62.74v12.12c-2.91-.65-5.79-.98-8.64-.98-5.2,0-9.45.79-12.74,2.36-3.29,1.57-5.75,3.89-7.39,6.97-1.64,3.08-2.6,7.44-2.9,13.1h.64c3.24-5.56,8.42-8.34,15.56-8.34,6.41,0,11.44,2.01,15.07,6.04,3.63,4.02,5.45,9.59,5.45,16.69,0,7.66-2.16,13.72-6.48,18.18s-10.31,6.7-17.96,6.7c-5.3,0-9.92-1.23-13.87-3.68-3.94-2.45-6.99-6.04-9.13-10.75-2.14-4.71-3.21-10.39-3.21-17.03Zm25.91,19.34c3.24,0,5.73-1.09,7.46-3.26,1.73-2.18,2.6-5.28,2.6-9.3,0-3.5-.81-6.26-2.43-8.27-1.62-2.01-4.07-3.02-7.34-3.02-3.08,0-5.7,1-7.88,2.99-2.18,2-3.26,4.32-3.26,6.97,0,3.89,1.02,7.18,3.07,9.87,2.04,2.68,4.64,4.02,7.78,4.02Z"
        :fill="eventClasses['day-06'].number" stroke-width="0"
      />
    </g>
    <g id="day-09" :class="eventClasses['day-09'].cursor" @click.stop="handleClick">
      <AnimateTransformDay from="0 0" :to="eventClasses['day-09'].translate" />
      <AnimateTransformDay :from="eventClasses['day-09'].translate" to="0 0" direction="reverse" />
      <rect
        x="912.16" y="788.83" width="188.84" height="191.17" rx="64.07" ry="64.07"
        transform="translate(2013.16 1768.83) rotate(-180)" :fill="eventClasses['day-09'].bg" stroke-width="0"
      />
      <circle cx="1006.58" cy="884.42" r="78.76" :fill="eventClasses['day-09'].circle" stroke-width="0" />
      <path
        d="m1031.47,881.48c0,14.14-2.98,24.69-8.93,31.66-5.96,6.97-14.97,10.45-27.04,10.45-4.25,0-7.48-.23-9.67-.69v-12.17c2.75.69,5.63,1.03,8.64,1.03,5.07,0,9.24-.74,12.52-2.23,3.27-1.49,5.77-3.83,7.51-7.02,1.73-3.19,2.73-7.58,2.99-13.18h-.59c-1.9,3.08-4.09,5.24-6.58,6.48-2.49,1.24-5.6,1.86-9.33,1.86-6.25,0-11.17-2-14.77-6.01-3.6-4.01-5.4-9.58-5.4-16.71,0-7.69,2.18-13.77,6.55-18.23,4.37-4.47,10.31-6.7,17.84-6.7,5.3,0,9.94,1.24,13.91,3.73,3.98,2.49,7.03,6.09,9.15,10.82,2.13,4.73,3.19,10.36,3.19,16.91Zm-25.96-19.29c-3.14,0-5.6,1.08-7.36,3.24-1.77,2.16-2.65,5.27-2.65,9.33,0,3.47.8,6.22,2.4,8.25,1.6,2.03,4.04,3.04,7.31,3.04,3.08,0,5.71-1.01,7.9-3.02,2.19-2.01,3.29-4.33,3.29-6.95,0-3.89-1.02-7.18-3.07-9.87-2.04-2.68-4.65-4.02-7.83-4.02Z"
        :fill="eventClasses['day-09'].number" stroke-width="0"
      />
    </g>
    <g id="day-25" :class="eventClasses['day-25'].cursor" @click.stop="handleClick">
      <AnimateTransformDay from="0 0" :to="eventClasses['day-25'].translate" />
      <AnimateTransformDay :from="eventClasses['day-25'].translate" to="0 0" direction="reverse" />
      <rect
        x="290.34" y="935.86" width="402.66" height="199.14" rx="63.03" ry="63.03" :fill="eventClasses['day-25'].bg"
        stroke-width="0"
      />
      <circle cx="491.67" cy="1035.43" r="78.76" :fill="eventClasses['day-25'].circle" stroke-width="0" />
      <g>
        <path
          d="m488.25,1069.63h-50.16v-10.55l18.01-18.21c5.33-5.46,8.82-9.25,10.45-11.36,1.64-2.11,2.81-4.07,3.53-5.87.72-1.8,1.08-3.66,1.08-5.59,0-2.88-.79-5.02-2.38-6.43-1.59-1.41-3.71-2.11-6.36-2.11-2.78,0-5.48.64-8.1,1.91-2.62,1.28-5.35,3.09-8.2,5.45l-8.25-9.77c3.53-3.01,6.46-5.14,8.79-6.38,2.32-1.24,4.86-2.2,7.61-2.87,2.75-.67,5.82-1.01,9.23-1.01,4.48,0,8.44.82,11.88,2.45s6.1,3.93,8,6.87c1.9,2.94,2.85,6.31,2.85,10.11,0,3.3-.58,6.4-1.74,9.3-1.16,2.9-2.96,5.86-5.4,8.91-2.44,3.04-6.73,7.38-12.88,13.01l-9.23,8.69v.69h31.26v12.76Z"
          :fill="eventClasses['day-25'].number" stroke-width="0"
        />
        <path
          d="m521.57,1023.79c6.94,0,12.46,1.95,16.56,5.84s6.16,9.23,6.16,16c0,8.02-2.47,14.18-7.41,18.5-4.94,4.32-12.01,6.48-21.2,6.48-7.98,0-14.43-1.29-19.34-3.88v-13.1c2.58,1.37,5.59,2.5,9.03,3.36,3.44.87,6.69,1.3,9.77,1.3,9.26,0,13.89-3.79,13.89-11.39s-4.79-10.85-14.38-10.85c-1.73,0-3.65.17-5.74.51-2.09.34-3.8.71-5.1,1.1l-6.04-3.24,2.7-36.56h38.92v12.86h-25.62l-1.33,14.09,1.72-.34c2-.46,4.47-.69,7.41-.69Z"
          :fill="eventClasses['day-25'].number" stroke-width="0"
        />
      </g>
    </g>
    <g id="day-10" :class="eventClasses['day-10'].cursor" @click.stop="handleClick">
      <AnimateTransformDay from="0 0" :to="eventClasses['day-10'].translate" />
      <AnimateTransformDay :from="eventClasses['day-10'].translate" to="0 0" direction="reverse" />
      <rect
        x="719" y="904.12" width="187.17" height="248.88" rx="63.03" ry="63.03" :fill="eventClasses['day-10'].bg"
        stroke-width="0"
      />
      <circle cx="812.59" cy="1028.56" r="78.76" :fill="eventClasses['day-10'].circle" stroke-width="0" />
      <g>
        <path
          d="m794.43,1065.9h-15.17v-41.52l.15-6.82.25-7.46c-2.52,2.52-4.27,4.17-5.25,4.96l-8.25,6.63-7.31-9.13,23.12-18.41h12.47v71.75Z"
          :fill="eventClasses['day-10'].number" stroke-width="0"
        />
        <path
          d="m864.07,1030.02c0,12.53-2.05,21.81-6.16,27.83-4.11,6.02-10.43,9.03-18.97,9.03s-14.52-3.11-18.72-9.33c-4.21-6.22-6.31-15.39-6.31-27.53s2.04-22,6.13-28c4.09-6,10.39-9.01,18.9-9.01s14.54,3.14,18.77,9.42c4.24,6.28,6.36,15.48,6.36,27.58Zm-35.09,0c0,8.8.76,15.11,2.28,18.92s4.08,5.72,7.68,5.72,6.09-1.93,7.66-5.79c1.57-3.86,2.36-10.14,2.36-18.85s-.79-15.12-2.38-18.97-4.13-5.77-7.63-5.77-6.12,1.92-7.66,5.77c-1.54,3.84-2.31,10.17-2.31,18.97Z"
          :fill="eventClasses['day-10'].number" stroke-width="0"
        />
      </g>
    </g>
    <g id="day-17" :class="eventClasses['day-17'].cursor" @click.stop="handleClick">
      <AnimateTransformDay from="0 0" :to="eventClasses['day-17'].translate" />
      <AnimateTransformDay :from="eventClasses['day-17'].translate" to="0 0" direction="reverse" />
      <rect
        x="920" y="997.37" width="263.58" height="191.63" rx="64.07" ry="64.07" :fill="eventClasses['day-17'].bg"
        stroke-width="0"
      />
      <circle cx="1051.79" cy="1093.19" r="78.76" :fill="eventClasses['day-17'].circle" stroke-width="0" />
      <g>
        <path
          d="m1033.84,1130.14h-15.17v-41.52l.15-6.82.25-7.46c-2.52,2.52-4.27,4.17-5.25,4.96l-8.25,6.63-7.31-9.13,23.12-18.4h12.47v71.75Z"
          :fill="eventClasses['day-17'].number" stroke-width="0"
        />
        <path
          d="m1060.83,1130.14l26.95-58.9h-35.39v-12.76h51.48v9.52l-27.14,62.13h-15.9Z"
          :fill="eventClasses['day-17'].number"
          stroke-width="0"
        />
      </g>
    </g>
    <g id="day-08" :class="eventClasses['day-08'].cursor" @click.stop="handleClick">
      <AnimateTransformDay from="0 0" :to="eventClasses['day-08'].translate" />
      <AnimateTransformDay :from="eventClasses['day-08'].translate" to="0 0" direction="reverse" />
      <rect
        x="79" y="1131.52" width="208" height="208" rx="63.03" ry="63.03" :fill="eventClasses['day-08'].bg"
        stroke-width="0"
      />
      <circle cx="183" cy="1235.52" r="78.76" :fill="eventClasses['day-08'].circle" stroke-width="0" />
      <path
        d="m182,1198.92c6.87,0,12.41,1.56,16.61,4.69,4.2,3.12,6.31,7.34,6.31,12.64,0,3.67-1.01,6.93-3.04,9.79-2.03,2.86-5.3,5.42-9.82,7.68,5.37,2.88,9.22,5.88,11.56,9.01,2.34,3.12,3.51,6.55,3.51,10.28,0,5.89-2.31,10.63-6.92,14.21s-10.68,5.37-18.21,5.37-14.02-1.67-18.5-5.01c-4.48-3.34-6.72-8.07-6.72-14.18,0-4.09,1.09-7.72,3.26-10.9,2.18-3.17,5.67-5.97,10.48-8.39-4.09-2.58-7.04-5.35-8.83-8.29-1.8-2.94-2.7-6.17-2.7-9.67,0-5.14,2.13-9.29,6.38-12.47,4.25-3.17,9.8-4.76,16.64-4.76Zm-11.19,53.6c0,2.81.98,5.01,2.95,6.58s4.65,2.36,8.05,2.36c3.76,0,6.58-.81,8.44-2.43,1.87-1.62,2.8-3.75,2.8-6.41,0-2.19-.92-4.25-2.77-6.16-1.85-1.91-4.85-3.95-9.01-6.11-6.97,3.21-10.45,7.26-10.45,12.17Zm11.09-42.5c-2.59,0-4.67.66-6.26,1.99-1.59,1.33-2.38,3.1-2.38,5.33,0,1.96.63,3.72,1.89,5.28s3.54,3.15,6.85,4.79c3.21-1.5,5.45-3.04,6.72-4.61,1.28-1.57,1.91-3.39,1.91-5.45,0-2.26-.82-4.04-2.45-5.35-1.64-1.31-3.73-1.96-6.28-1.96Z"
        :fill="eventClasses['day-08'].number" stroke-width="0"
      />
    </g>
    <g id="day-12" :class="eventClasses['day-12'].cursor" @click.stop="handleClick">
      <AnimateTransformDay from="0 0" :to="eventClasses['day-12'].translate" />
      <AnimateTransformDay :from="eventClasses['day-12'].translate" to="0 0" direction="reverse" />
      <rect
        x="306.12" y="1150" width="185.88" height="247" rx="64.07" ry="64.07"
        transform="translate(798.12 2547) rotate(180)" :fill="eventClasses['day-12'].bg" stroke-width="0"
      />
      <circle cx="399.06" cy="1273.5" r="78.76" :fill="eventClasses['day-12'].circle" stroke-width="0" />
      <g>
        <path
          d="m379.37,1312.53h-15.17v-41.52l.15-6.82.25-7.46c-2.52,2.52-4.27,4.17-5.25,4.96l-8.25,6.63-7.31-9.13,23.12-18.41h12.47v71.75Z"
          :fill="eventClasses['day-12'].number" stroke-width="0"
        />
        <path
          d="m449.4,1312.53h-50.16v-10.55l18.01-18.21c5.33-5.46,8.82-9.25,10.45-11.36,1.64-2.11,2.81-4.07,3.53-5.87s1.08-3.66,1.08-5.6c0-2.88-.79-5.02-2.38-6.43-1.59-1.41-3.71-2.11-6.36-2.11-2.78,0-5.48.64-8.1,1.91-2.62,1.28-5.35,3.09-8.2,5.45l-8.25-9.77c3.53-3.01,6.46-5.14,8.79-6.38,2.32-1.24,4.86-2.2,7.61-2.87,2.75-.67,5.82-1.01,9.23-1.01,4.48,0,8.44.82,11.88,2.45,3.44,1.64,6.1,3.93,8,6.87s2.85,6.31,2.85,10.11c0,3.31-.58,6.41-1.74,9.3-1.16,2.9-2.96,5.86-5.4,8.91-2.44,3.04-6.73,7.38-12.88,13.01l-9.23,8.69v.69h31.26v12.76Z"
          :fill="eventClasses['day-12'].number" stroke-width="0"
        />
      </g>
    </g>
    <g id="day-04" :class="eventClasses['day-04'].cursor" @click.stop="handleClick">
      <AnimateTransformDay from="0 0" :to="eventClasses['day-04'].translate" />
      <AnimateTransformDay :from="eventClasses['day-04'].translate" to="0 0" direction="reverse" />
      <rect
        x="508" y="1153.27" width="187.9" height="189.73" rx="64.07" ry="64.07"
        transform="translate(1203.9 2496.27) rotate(-180)" :fill="eventClasses['day-04'].bg" stroke-width="0"
      />
      <circle cx="601.95" cy="1248.14" r="78.76" :fill="eventClasses['day-04'].circle" stroke-width="0" />
      <path
        d="m627.87,1270.17h-8.64v14.87h-14.82v-14.87h-30.63v-10.55l31.46-46.33h13.99v45.1h8.64v11.78Zm-23.46-11.78v-12.17c0-2.03.08-4.97.25-8.83.16-3.86.29-6.1.39-6.72h-.39c-1.21,2.68-2.67,5.3-4.37,7.85l-13.15,19.88h17.28Z"
        :fill="eventClasses['day-04'].number" stroke-width="0"
      />
    </g>
    <g id="day-02" :class="eventClasses['day-02'].cursor" @click.stop="handleClick">
      <AnimateTransformDay from="0 0" :to="eventClasses['day-02'].translate" />
      <AnimateTransformDay :from="eventClasses['day-02'].translate" to="0 0" direction="reverse" />
      <rect
        x="711" y="1202" width="391.48" height="197.86" rx="64.07" ry="64.07" :fill="eventClasses['day-02'].bg"
        stroke-width="0"
      />
      <circle cx="906.74" cy="1300.93" r="78.76" :fill="eventClasses['day-02'].circle" stroke-width="0" />
      <g>
        <path
          d="m933.08,1336.63h-50.16v-10.55l18.01-18.21c5.33-5.46,8.82-9.25,10.45-11.36s2.81-4.07,3.53-5.87c.72-1.8,1.08-3.66,1.08-5.59,0-2.88-.79-5.02-2.38-6.43-1.59-1.41-3.71-2.11-6.36-2.11-2.78,0-5.48.64-8.1,1.91-2.62,1.28-5.35,3.09-8.2,5.45l-8.25-9.77c3.53-3.01,6.46-5.14,8.79-6.38,2.32-1.24,4.86-2.2,7.61-2.87,2.75-.67,5.82-1.01,9.23-1.01,4.48,0,8.44.82,11.88,2.45s6.1,3.93,8,6.87c1.9,2.94,2.85,6.31,2.85,10.11,0,3.3-.58,6.4-1.74,9.3-1.16,2.9-2.96,5.86-5.4,8.91-2.44,3.04-6.73,7.38-12.88,13.01l-9.23,8.69v.69h31.26v12.76Z"
          :fill="eventClasses['day-02'].number" stroke-width="0"
        />
      </g>
    </g>
    <!-- eslint-enable max-len -->
  </svg>
</template>

<style scoped>
svg {
  --inactive-bg: none;
  --inactive-number: rgba(255, 255, 255, 0.2);
}

svg g {
  transition-timing-function: ease-in-out;
}
</style>
