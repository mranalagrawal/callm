<script lang="ts">
import { defineComponent, ref, useContext, useRouter } from '@nuxtjs/composition-api'
// import debounce from 'lodash.debounce'
import searchIcon from '~/assets/svg/search.svg'
import type { TStores } from '~/config/themeConfig'
import themeConfig from '~/config/themeConfig'

// Debounce function
function debounce<T extends (...args: any[]) => any>(func: T, wait: number) {
  let timeout: NodeJS.Timeout
  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, args), wait)
  }
}

export default defineComponent({
  setup() {
    const { $config, i18n, $handleApiErrors, localePath } = useContext()
    const { ELASTIC_URL, STORE } = $config
    const store = STORE as TStores
    const storeConfigId = themeConfig[store]?.id || 2
    const router = useRouter()
    const search = ref('')
    const results = ref({
      categories: [],
      brands: [],
      products: [],
      gift_cards: [],
      winelists: [],
    })
    const showSearchSuggestions = ref(false)

    const bolder = (text: string) => {
      const regexValue = new RegExp(`(${search.value})`, 'ig')
      return text.replace(
        regexValue,
        '<span class=\'cmw-font-bold\'>$1</span>',
      )
    }

    const suggest = debounce(async () => {
      showSearchSuggestions.value = true

      if (search.value.length <= 3) { return }

      await fetch(`${ELASTIC_URL}autocomplete/search/?stores=${storeConfigId}&locale=${i18n.locale}&search=${search.value}`)
        .then(r => r.json())
        .then((data) => {
          results.value = data
        })
        .catch((err: Error) => $handleApiErrors(`Catch getting autocomplete: ${err}`))
    }, 300)

    const handleBlur = () => {
      showSearchSuggestions.value = false
    }

    const startSearch = () => {
      if (!search.value) { return }

      showSearchSuggestions.value = false
      router.push(localePath({
        path: '/catalog',
        query: { search: search.value },
      }))
    }

    return {
      bolder,
      handleBlur,
      results,
      search,
      searchIcon,
      showSearchSuggestions,
      startSearch,
      suggest,
    }
  },
})
</script>

<template>
  <div class="relative z-base">
    <!-- Note: Since we are handling submit with Vue methods we don't need the name attribute in the search field -->
    <input
      id="search-term"
      v-model="search"
      type="search"
      class="
               c-searchInput -hasIcon px-4 text-gray-dark py-3 w-full bg-transparent border border-gray-light rounded-[12px]
               hover:(border-gray)
               focus:(outline-none border-gray-dark)"
      :placeholder="$t('navbar.search')"
      @input="suggest"
      @blur="handleBlur"
      @keyup.enter="startSearch"
    >
    <ButtonIcon
      :icon="searchIcon"
      :aria-label="$t('enums.accessibility.role.TRIGGER_SEARCH')"
      size="sm"
      class="transform absolute top-1/2 right-0 -translate-y-1/2 translate-x-[-30%]"
      @click.native="startSearch"
    />
    <transition
      keep-alive
      name="slideFade"
      mode="out-in"
    >
      <div
        v-if="search && results && showSearchSuggestions"
        class="absolute w-full z-100 transform
            transition-transform-opacity translate-x-0 translate-y-full bottom-0 left-0
            "
      >
        <div class="bg-white max-h-[70vh] rounded-lg shadow-popover overflow-hidden mt-2">
          <div v-if="results.gift_cards && results.gift_cards.length > 0">
            <p class="overline-2 uppercase text-secondary-400 py-2 px-3 m-0">
              {{ $t("search.giftCards") }}
            </p>
            <NuxtLink
              v-for="item in results.gift_cards"
              :key="item.id"
              class="body-1 block py-2 px-3 hover:(bg-primary-50) text-body"
              :to="localePath(`/${item.handle}`)"
            >
              <span v-html="bolder(item.name)" />
            </NuxtLink>
          </div>
          <div
            v-if="results.winelists && results.winelists.length > 0"
            class="max-h-[70vh] overflow-y-auto"
          >
            <p class="overline-2 uppercase text-secondary-400 py-2 px-3 mb-0 mt-2">
              {{ $t("search.winelists") }}
            </p>
            <NuxtLink
              v-for="item in results.winelists"
              :key="item.id"
              class="body-1 block py-2 px-3 hover:(bg-primary-50) text-body"
              :to="localePath(`/${item.handle}-V${item.id}.htm`)"
            >
              <span v-html="bolder(item.name)" />
            </NuxtLink>
          </div>

          <div
            v-if="!!results.categories.length || !!results.brands.length || !!results.products.length"
            class="pt-3"
          >
            <div v-if="!!results.categories.length">
              <p class="overline-2 uppercase text-secondary-400 py-2 px-3 m-0">
                {{ $t("search.categories") }}
              </p>
              <NuxtLink
                v-for="item in results.categories"
                :key="item.id"
                class="body-1 block py-2 px-3 hover:(bg-primary-50) text-body"
                :to="localePath(`/catalog?&categories=${item.id}`)"
              >
                <span v-html="bolder(item.name)" />
              </NuxtLink>
            </div>

            <div v-if="!!results.brands.length">
              <p class="overline-2 uppercase text-secondary-400 py-2 px-3 m-0">
                {{ $t("search.brands") }}
              </p>
              <NuxtLink
                v-for="item in results.brands"
                :key="item.id"
                class="body-1 block py-2 px-3 hover:(bg-primary-50) text-body"
                :to="localePath({ name: 'winery-handle', params: { handle: `${item.handle.trim()}-B${item.id}.htm` } })"
              >
                <span v-html="bolder(item.name)" />
              </NuxtLink>
            </div>

            <div v-if="!!results.products.length">
              <p class="overline-2 uppercase text-secondary-400 py-2 px-3 m-0">
                {{ $t("search.products") }}
              </p>
              <NuxtLink
                v-for="item in results.products"
                :key="item.id"
                class="body-1 block py-2 px-3 hover:(bg-primary-50) text-body"
                :to="localePath(`/${item.handle}-P${item.id}.htm`)"
              >
                <span v-html="bolder(item.name)" />
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
