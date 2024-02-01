import { nextTick, onMounted, onUnmounted, ref } from '@nuxtjs/composition-api'
import debounce from 'lodash.debounce'

export default function () {
  const isMobile = ref(false)
  const isTablet = ref(false)
  const isDesktop = ref(false)
  const isDesktopWide = ref(false)
  const isDesktopWider = ref(false)
  const hasBeenSet = ref(false)

  const resizeListener = debounce(() => {
    const windowInnerW = window.innerWidth
    hasBeenSet.value = true
    isMobile.value = windowInnerW < 768
    isTablet.value = windowInnerW >= 768
    isDesktop.value = windowInnerW >= 992
    isDesktopWide.value = windowInnerW >= 1280
    isDesktopWider.value = windowInnerW >= 1600
  }, 400)

  onMounted(() => {
    // Todo: Move this to a global composable when we implement VueUse
    window.addEventListener('resize', resizeListener)
    nextTick(() => resizeListener())
  })

  onUnmounted(() => {
    window.removeEventListener('resize', resizeListener)
  })

  return { isMobile, isTablet, isDesktop, isDesktopWide, isDesktopWider, hasBeenSet }
}
