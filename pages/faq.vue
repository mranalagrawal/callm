<script lang="ts">
import { computed, defineComponent, onMounted, ref, useContext, useFetch, useMeta } from '@nuxtjs/composition-api'
import { generateHeadHreflang } from '~/utilities/arrays'
import type { IPrismicPageData } from '~/types/prismic'
import { initialPageData } from '~/config/prismicConfig'
import { generateKey } from '~/utilities/strings'

interface ISection {
  hash: string
  id: string
  items: Record<string, any>
  sectionTitle: string
  sectionTitlePrismic: { type: string; text: string; spans: any }[]
}

export default defineComponent({
  setup() {
    const { $cmwGtmUtils } = useContext()

    const hrefLang = {
      'it': 'https://www.callmewine.com/faq.html',
      'en': 'https://www.callmewine.com/en/faq.html',
      'fr': 'https://callmewine.fr/faq',
      'de': 'https://callmewine.de/faq',
      'en-gb': 'https://callmewine.co.uk/faq',
    }

    const pageData = ref<IPrismicPageData>(initialPageData)
    const selectedQuestion = ref('')
    const navigation = ref<ISection[]>([])

    const handleUpdateTrigger = (val: string) => {
      selectedQuestion.value = selectedQuestion.value === val ? '' : val
    }

    const { fetch } = useFetch(async ({ $cmwRepo }) => {
      const data = await $cmwRepo.prismic.getPageByUID({
        page: 'static-page',
        uid: 'faq',
      })

      pageData.value = data?.body || initialPageData

      navigation.value = data?.body.map((s: any) => ({
        sectionTitlePrismic: s.primary?.section_title,
        sectionTitle: s.primary?.section_title[0]?.text,
        hash: generateKey(s.primary?.section_title[0]?.text),
        id: s.id,
        items: s.items,
      })) || []
    })

    const ready = computed(() => false)
    onMounted(() => {
      process.browser && $cmwGtmUtils.pushPage('page')
    })

    useMeta(() => ({
      link: generateHeadHreflang(hrefLang),
    }))

    return {
      fetch,
      handleUpdateTrigger,
      navigation,
      pageData,
      ready,
      selectedQuestion,
    }
  },
  head: {},
  methods: { generateKey },
})
</script>

<template>
  <div v-if="!!navigation.length" class="c-faq max-w-screen-xl mx-auto mt-5 p-4">
    <div
      class="print:hidden bg-white/50 backdrop-filter backdrop-blur sticky z-content pb-1 pt-4 pl-4 md:px-4"
      :class="(!$store.state.headers.fromApp) ? 'top-$cmw-header-height' : 'top-0'"
    >
      <nav
        v-if="ready"
        class="
        c-navigationTab font-sans justify-between w-full flex no-wrap overflow-x-auto
        border-b border-b-gray-dark mb-3 md:(mt-9 max-w-10/12)
"
      >
        <NuxtLink
          v-for="({ sectionTitle, hash }) in navigation"
          :key="sectionTitle"
          :to="{ path: localePath('faq'), hash }"
          class="relative py-2 flex-shrink-0 cmw-font-light text-sm
                hover:after:(bg-primary text-primary w-full)
                after:(content-DEFAULT transform absolute bottom-0 left-1/2 h-1 transition-progress-bar -translate-x-1/2)"
          :class="$route.hash.includes(hash) ? 'after:(bg-primary text-primary w-full)' : 'after:(w-0 bg-primary-400)'"
        >
          <span
            class="w-max px-4 hover:text-primary"
            :class="$route.hash.includes(hash) ? 'text-primary' : 'text-gray-dark'"
            v-text="sectionTitle"
          />
        </NuxtLink>
      </nav>
    </div>
    <div>
      <PrismicRichText v-if="pageData.title" :field="pageData.title" />
      <LoadingImage
        v-if="pageData.main_banner?.url"
        img-classes="w-full"
        :thumbnail="{
          url: pageData.main_banner.url ? `${pageData.main_banner.url}?&width=20&height=12` : 'https://picsum.photos/id/75/20/12',
          width: 20,
          height: 12,
          altText: pageData.main_banner.alt,
        }"
        :source="{
          url: pageData.main_banner.url
            ? `${pageData.main_banner.url}?&width=${pageData.main_banner.dimensions.width}&height=${pageData.main_banner.dimensions.height}`
            : 'https://picsum.photos/id/75/265/164',
          width: pageData.main_banner.dimensions.width,
          height: pageData.main_banner.dimensions.height,
          altText: pageData.main_banner.alt,
        }"
      />
      <PrismicRichText v-if="!!pageData.content?.length" :field="pageData.content" />
      <div
        v-for="({ sectionTitlePrismic, items, hash, id }) in navigation"
        :id="hash" :key="generateKey(id)"
        class="mt-8"
      >
        <PrismicRichText
          v-if="sectionTitlePrismic"
          class="c-faq__sectionTitle"
          :field="sectionTitlePrismic"
        />
        <CmwAccordion
          v-for="({ question, answer }, key) in items"
          :key="`${id}-${key}`"
          size="sm"
          :has-item="false"
          :active="`${id}-${key}` === selectedQuestion"
          @update-trigger="handleUpdateTrigger"
        >
          <template #default>
            <div class="c-faq__question">
              <PrismicRichText v-if="!!question.length" :field="question" />
            </div>
          </template>
          <template #children>
            <PrismicRichText v-if="!!answer.length" :field="answer" class="prose px-4 py-2" />
          </template>
        </CmwAccordion>
      </div>
    </div>
  </div>
</template>

<style>
.c-faq__sectionTitle h1, .c-faq__sectionTitle h2, .c-faq__sectionTitle h3 {
  @apply text-primary text-xl;
  margin: 0;
}

.c-faq__question h1, .c-faq__question h2, .c-faq__question h3 {
  @apply text-base cmw-font-light normal-case;
  text-align: left;
  margin: 0;
}
</style>

<style scoped>
.c-navigationTab::-webkit-scrollbar {
  height: 0;
}

.c-navigationTab::-webkit-scrollbar-track {
  background-color: transparent;
}

.c-navigationTab::-webkit-scrollbar-thumb {
  background-color: transparent;
}
</style>
