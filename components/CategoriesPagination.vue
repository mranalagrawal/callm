<script lang="ts">
import type { PropType } from '@nuxtjs/composition-api'
import {
  defineComponent,
  onMounted,
  ref,
  useRoute,
  useRouter, watchEffect,
} from '@nuxtjs/composition-api'
import chevronLeftIcon from 'assets/svg/chevron-left.svg'
import chevronRightIcon from 'assets/svg/chevron-right.svg'

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
  },
  setup(props) {
    // const { i18n } = useContext()
    const router = useRouter()
    const route = useRoute()
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

    const changePage = (page: number | string) => {
      const query = {
        ...props.inputParameters,
        page: `${page}`,
      }

      router.push({
        path: '/catalog',
        query,
      })
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
  <div class="cmw-grid cmw-grid-cols-[auto_auto_auto] cmw-items-center cmw-justify-center cmw-mt-8">
    <div class="">
      <Button
        class="cmw-uppercase"
        :aria-label="$t('common.cta.prevPage')"
        :disabled="pagination.currentPage.toString() === '1'"
        type="button" variant="text" @click.native="changePage(Number(pagination.prevPage))"
      >
        <VueSvgIcon width="18" height="18" :data="chevronLeftIcon" />
        <span class="<md:cmw-hidden">{{ $t('common.cta.prevPage') }}</span>
      </Button>
    </div>
    <div class="cmw-flex">
      <div v-for="n in pagination.pageNumbers" :key="n" class="cl">
        <Button
          :label="`${n}`" variant="text"
          class="cmw-relative cmw-text-base cmw-px-3"
          :class="{ 'cmw-text-primary cmw-font-bold after:(cmw-content-DEFAULT cmw-absolute cmw-bottom-0 cmw-h-1 cmw-bg-primary cmw-w-full)': pagination.currentPage === n }"
          @click.native="changePage(n)"
        />
      </div>
    </div>
    <div class="">
      <Button
        class="cmw-uppercase"
        :disabled="+pagination.currentPage >= pagination.totalPages"
        :aria-label="$t('common.cta.nextPage')"
        type="button" variant="text" @click.native="changePage(Number(pagination.nextPage))"
      >
        <span class="<md:cmw-hidden">{{ $t('common.cta.nextPage') }}</span>
        <VueSvgIcon width="18" height="18" :data="chevronRightIcon" />
      </Button>
    </div>
  </div>
</template>
