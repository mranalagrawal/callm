<script>
import { onMounted, ref } from '@nuxtjs/composition-api'

export default {
  props: {
    /** @Type: {ImageType.Image} */
    thumbnail: { required: true },
    /** @Type: {ImageType.Image} */
    source: { required: true },
    ignoreObserver: { type: Boolean },
    imgClasses: { type: String },
    wrapper: { type: String, default: 'div' },
  },
  setup(props) {
    // const { $sentry } = useContext()
    const el = ref(null)
    const imgEl = ref(null)
    const imageIsLoaded = ref(false)
    const options = {
      root: null,
      threshold: 0,
    }

    const loadBigImage = (image) => {
      if (image) {
        image.addEventListener('load', function handler() {
          imageIsLoaded.value = true
          this.removeEventListener('load', handler)
        })

        image.addEventListener('error', () => {
          // $sentry.captureException(new Error(`Missing Image ${image}`))
        })

        image.src = image.dataset.src
      }
    }

    const loadSmallImage = () => {
      if (imgEl.value) {
        imgEl.value.addEventListener('load', function handler() {
          setTimeout(() => {
            this.removeEventListener('load', handler)
            loadBigImage(imgEl.value)
          }, 200)
        })
        imgEl.value.addEventListener('error', () => {
          // $sentry.captureException(new Error(`Missing Image ${imgEl.value}`))
        })
        imgEl.value.src = imgEl.value.dataset.thumbnail
        imgEl.value.width = props.source.width
        imgEl.value.height = props.source.height
      }
    }

    const handleIntersect = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          loadSmallImage()
          el.value && observer.unobserve(el.value)
        }
      })
    }

    const createObserver = () => {
      const observer = new IntersectionObserver(handleIntersect, options)
      el.value && observer.observe(el.value)
    }

    onMounted(() => {
      (window.IntersectionObserver && !props.ignoreObserver)
        ? createObserver()
        : loadSmallImage()
    })
    return { el, imgEl, imageIsLoaded }
  },
}
</script>

<template>
  <component :is="wrapper" ref="el" class="w-full">
    <img
      ref="imgEl"
      class="filter text-xxs"
      :class="[imageIsLoaded ? 'blur-0 opacity-100' : 'opacity-0 blur-0', imgClasses]"
      :data-src="source.url"
      :data-thumbnail="thumbnail.url"
      :alt="thumbnail.altText"
      :width="thumbnail.width"
      :height="thumbnail.height"
    >
  </component>
</template>
