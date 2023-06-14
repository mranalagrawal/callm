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
  <div class="grid grid-cols-[auto_auto_auto] items-center justify-center mt-8">
    <div class="">
      <Button
        class="uppercase"
        :aria-label="$t('common.cta.prevPage')"
        :disabled="pagination.currentPage.toString() === '1'"
        type="button" variant="text" @click.native="changePage(Number(pagination.prevPage))"
      >
        <VueSvgIcon width="18" height="18" :data="chevronLeftIcon" />
        <span class="<md:hidden">{{ $t('common.cta.prevPage') }}</span>
      </Button>
    </div>
    <div class="flex">
      <div v-for="n in pagination.pageNumbers" :key="n" class="cl">
        <Button
          :label="`${n}`" variant="text"
          class="relative text-base px-3"
          :class="{ 'text-primary font-bold after:(content-DEFAULT absolute bottom-0 h-1 bg-primary w-full)': pagination.currentPage === n }"
          @click.native="changePage(n)"
        />
      </div>
    </div>
    <div class="">
      <Button
        class="uppercase"
        :disabled="+pagination.currentPage >= pagination.totalPages"
        :aria-label="$t('common.cta.nextPage')"
        type="button" variant="text" @click.native="changePage(Number(pagination.nextPage))"
      >
        <span class="<md:hidden">{{ $t('common.cta.nextPage') }}</span>
        <VueSvgIcon width="18" height="18" :data="chevronRightIcon" />
      </Button>
    </div>
  </div>
</template>
