import { nextTick, onMounted, onUnmounted, ref } from '@nuxtjs/composition-api'
import debounce from 'lodash.debounce'

export default function () {
  const isTablet = ref(false)
  const isDesktop = ref(false)
  const isDesktopWide = ref(false)
  const isDesktopWider = ref(false)
  const hasBeenSet = ref(false)

  const resizeListener = debounce(() => {
    console.log('resizeListener()')
    hasBeenSet.value = true
    isTablet.value = window.innerWidth >= 768
    isDesktop.value = window.innerWidth >= 992
    isDesktopWide.value = window.innerWidth >= 1280
    isDesktopWider.value = window.innerWidth >= 1600
  }, 400)

  onMounted(() => {
    // Todo: Move this to a global composable when we implement VueUse
    window.addEventListener('resize', resizeListener)
    nextTick(() => {
      resizeListener()
    })
  })

  onUnmounted(() => {
    window.removeEventListener('resize', resizeListener)
  })

  return { isTablet, isDesktop, isDesktopWide, isDesktopWider, hasBeenSet }
}
