<script lang="ts">
import { computed, defineComponent, inject, onMounted, ref, useContext, useFetch } from '@nuxtjs/composition-api'
import metaobject from '~/graphql/queries/metaobject.graphql'
import type { ICollection } from '~/types/collection'
import { initialCollectionData } from '~/types/collection'
import type { ObjType, TImage } from '~/types/types'
import { getRandNumber } from '~/utilities/math'
import { SweetAlertConfirm } from '~/utilities/Swal'

export interface IEventDay {
  key: string
  reference: {
    date: { value: string }
    description: { value: string }
    discount: { value: string }
    image: { reference: { image: TImage } }
    price: { value: string }
    product: { reference: ObjType<KeyType> } // IProductMapped
    title: { value: string }
    type: { value: string }
  }
}

export default defineComponent({
  middleware({ $cmwStore, $dayjs, localePath, redirect, error }) {
    if (!($cmwStore.isIt || $cmwStore.isB2b)) {
      return redirect(localePath('/') as unknown as string)
    }

    const startDate = $dayjs('2023-12-01')
    const endDate = $dayjs('2023-12-25')

    if ($cmwStore.isProd && $dayjs().isBefore(startDate)) {
      return error({ statusCode: 404, message: 'Resource is not found.' })
    }

    if ($dayjs().isAfter(endDate)) {
      return error({ statusCode: 410, message: 'Resource is gone.' })
    }
  },
  setup() {
    const { i18n, $dayjs, $cmwStore } = useContext()
    const isDesktop = inject('isDesktop')
    const metaObjectRef = ref<any>([])
    const showUpcomingSplash = ref<boolean>(false)
    const currentDay = ref($dayjs().get('D'))
    const currentEventDay = ref<number>(0)
    const currentEvent = ref<IEventDay | undefined>(undefined)
    const date = ref($dayjs().format('YYYY-MM-DD'))
    const collectionRef = ref<ICollection>(initialCollectionData)
    const forwardAnimationsRef = ref<SVGAnimateElement[]>([])
    const reverseAnimationsRef = ref<SVGAnimateElement[]>([])

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
        showUpcomingSplash.value = true
        SweetAlertConfirm.fire({
          text: i18n.t('eventUpcomingText'),
          icon: '',
          cancelButtonText: i18n.t('eventCancelButton'),
          showConfirmButton: false,

        })
        return
      }

      currentEventDay.value = eventDay
      currentEvent.value = eventDays.value.find(e =>
        $dayjs(e.reference.date.value).format('[day-]DD') === id)

      if (currentEvent.value) {
        forwardAnimationsRef.value.forEach((animation, index) => {
          setTimeout(() => {
            animation.beginElement()
          }, getRandNumber() * index)
        })
      }
    }

    const handleCloseEvent = () => {
      currentEvent.value = undefined
      reverseAnimationsRef.value.forEach((animation, index) => {
        setTimeout(() => {
          animation.beginElement()
        }, getRandNumber() * index)
      })
    }

    onMounted(() => {
      forwardAnimationsRef.value = Array.from(document.querySelectorAll('[data-animate-direction="forward"]'))
      reverseAnimationsRef.value = Array.from(document.querySelectorAll('[data-animate-direction="reverse"]'))
    })

    return {
      collectionRef,
      currentDay,
      currentEvent,
      currentEventDay,
      date,
      forwardAnimationsRef,
      handleCalendarChange,
      handleClick,
      handleCloseEvent,
      isDesktop,
      metaObjectRef,
      reverseAnimationsRef,
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
      <div class="w-9/12 sm:w-8/12 md:w-7/12 lg:w-8/12 m-inline-auto">
        <ClientOnly>
          <CalendarLg v-if="isDesktop" :current-day="currentDay" @handle-click="handleClick" />
          <CalendarSm v-else :current-day="currentDay" @handle-click="handleClick" />
        </ClientOnly>
      </div>
      <p class="w-[min(100%,_40rem)] m-inline-auto" v-text="$t('eventNote')" />
      <ClientOnly>
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
                <img
                  :src="product.image.source.url" :alt="product.image.thumbnail.altText"
                  class="w-full h-auto object-contain"
                >
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
      </ClientOnly>
    </div>
    <transition
      name="custom-classes-transition"
      enter-active-class="animated animate-zoomInUp animate-delay-100"
      leave-active-class="animated animate-zoomOutDown"
    >
      <div v-if="currentEvent?.key" class="splash absolute w-screen h-full">
        <CurrentEvent
          :current-event="currentEvent.reference"
          :current-day="currentDay"
          :current-event-day="currentEventDay"
          @close-event="handleCloseEvent"
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

svg {
  --inactive-bg: none;
  --inactive-number: rgba(255, 255, 255, 0.2);
}

svg g {
  transition-timing-function: ease-in-out;
}
</style>
