<script lang="ts">
import type { PropType } from '@nuxtjs/composition-api'
import {
  defineComponent,
  onMounted,
  ref, useContext,
  useRoute, useRouter,
  watchEffect,
} from '@nuxtjs/composition-api'
import type { RawLocation } from 'vue-router'

import chevronLeftIcon from '~/assets/svg/chevron-left.svg'
import chevronRightIcon from '~/assets/svg/chevron-right.svg'

interface IQuery {
  [key: string]: string | undefined
}

interface IPagination {
  prevPage: number | null
  nextPage: number | null
  currentPage: number
  pageNumbers: number[]
  totalPages: number
}

export default defineComponent({
  props: {
    inputParameters: {
      type: Object as PropType<Record<string, any>>,
      required: true,
    },
    totalPages: {
      type: Number,
      required: true,
    },
    basePath: {
      type: String,
      default: 'catalog',
    },
  },
  setup(props) {
    const { localeLocation } = useContext()
    const route = useRoute()
    const router = useRouter()
    const pageData = ref({})
    const currentPage = ref({})
    const shortDescription = ref('')
    const testShortDescription = ref('')
    const results = ref([])
    const total = ref(0)

    const pagination = ref<IPagination>({
      prevPage: null,
      nextPage: null,
      currentPage: 1,
      pageNumbers: [],
      totalPages: 0,
    })

    const setPages = (totalPages: number) => {
      const { page } = route.value.query

      pagination.value.totalPages = totalPages
      pagination.value.currentPage = Number(page ?? 1)
      pagination.value.prevPage = pagination.value.currentPage > 1 ? pagination.value.currentPage - 1 : null
      pagination.value.nextPage = totalPages
        ? (pagination.value.currentPage < totalPages
            ? pagination.value.currentPage + 1
            : null)
        : pagination.value.currentPage + 1
      pagination.value.pageNumbers = Array.from({ length: props.totalPages }, (_, i) => i + 1)
        .filter(page => Math.abs(page - pagination.value.currentPage) < 4)
    }

    const getPageQuery = (page: number | string | null): IQuery => ({
      ...props.inputParameters,
      page: `${page}`,
    })

    const changePage = (page: number | string) => {
      const query: IQuery = {
        ...props.inputParameters,
        page: `${page}`,
      }

      router.push(localeLocation({
        path: props.basePath,
        query,
      }) as RawLocation)
    }

    onMounted(() => setPages(props.totalPages))
    watchEffect(() => {
      setPages(props.totalPages)
    })

    return {
      changePage,
      chevronLeftIcon,
      chevronRightIcon,
      currentPage,
      getPageQuery,
      pageData,
      pagination,
      results,
      shortDescription,
      testShortDescription,
      total,
    }
  },
})
</script>

<template>
  <div class="grid grid-cols-[auto_auto_auto] items-center justify-center mt-8">
    <div class="">
      <component
        :is="pagination.currentPage.toString() === '1' ? 'span' : 'NuxtLink'"
        :to="localeLocation({ path: basePath, query: getPageQuery(pagination.prevPage) })"
        class="btn-text text-sm uppercase"
        :class="{ 'text-gray cursor-not-allowed select-none': pagination.currentPage.toString() === '1' }"
        :aria-label="$t('common.cta.prevPage')"
        :rel="$t('enums.accessibility.rel.prev')"
      >
        <VueSvgIcon width="18" height="18" :data="chevronLeftIcon" />
        <span class="<md:hidden">{{ $t('common.cta.prevPage') }}</span>
      </component>
    </div>
    <div class="flex">
      <div v-for="n in pagination.pageNumbers" :key="n" class="cl">
        <NuxtLink
          :to="localeLocation({ path: basePath, query: getPageQuery(n) })"
          class="relative btn-text text-base px-3 py-2 md:(py-[0.8rem])"
          :class="{ 'text-primary cmw-font-bold after:(content-DEFAULT absolute left-0 bottom-0 h-1 bg-primary w-full)': pagination.currentPage === n }"
          :rel="$t(pagination.currentPage > n ? 'enums.accessibility.rel.prev' : 'enums.accessibility.rel.next')"
        >
          {{ n }}
        </NuxtLink>
      </div>
    </div>
    <div class="">
      <component
        :is="+pagination.currentPage >= pagination.totalPages ? 'span' : 'NuxtLink'"
        :to="localeLocation({ path: basePath, query: getPageQuery(pagination.nextPage) })"
        class="btn-text text-sm uppercase"
        :class="{ 'text-gray cursor-not-allowed select-none': +pagination.currentPage >= pagination.totalPages }"
        :aria-label="$t('common.cta.nextPage')"
        :rel="$t('enums.accessibility.rel.next')"
      >
        <span class="<md:hidden">{{ $t('common.cta.nextPage') }}</span>
        <VueSvgIcon width="18" height="18" :data="chevronRightIcon" />
      </component>
    </div>
  </div>
</template>
