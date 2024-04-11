<script lang="ts">
import { onMounted, onUnmounted, ref, useFetch } from '@nuxtjs/composition-api'
import debounce from 'lodash.debounce'

import { generateKey } from '~/utilities/strings'

interface ISlide {
  cta: string
  image: { url: string }
  link: string
  title: string
}

export default {
  setup() {
    const slides = ref<ISlide[]>([])
    const title = ref('')
    const arrowPos = ref('10px')
    const wrapperEl = ref<HTMLDivElement | null>(null)
    const mask = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iNTQwcHgiIGhlaWdodD0iNDAycHgiIHZpZXdCb3g9IjAgMCA1NDAgNDAyIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPHRpdGxlPkdyb3VwIDNAMTwvdGl0bGU+CiAgICA8ZGVmcz4KICAgICAgICA8cGF0aCBkPSJNMzMzLjMwNjMxLDAgQzMzMy4xMDI2ODksNS42MjYyMjE5NCAzMzMsMTEuMjc4MTg0NiAzMzMsMTYuOTU0MTMxNSBDMzMzLDE3Ny4yMjcyNTYgNDE0Ljg3ODA2MywzMTguMzc2NzM0IDUzOS4wODczLDQwMC44NTU2NzkgTDAsNDAwLjg1NTY3OSBMMCwwLjQ1NDEzMTUxIEwzMzMuMzA2MzEsMCBaIiBpZD0icGF0aC0xIj48L3BhdGg+CiAgICAgICAgPHJlY3QgaWQ9InBhdGgtMyIgeD0iMCIgeT0iMCIgd2lkdGg9Ijk3OSIgaGVpZ2h0PSI0MDAiIHJ4PSI4Ij48L3JlY3Q+CiAgICAgICAgPGZpbHRlciB4PSItMS4zJSIgeT0iLTIuOSUiIHdpZHRoPSIxMDIuNiUiIGhlaWdodD0iMTA2LjIlIiBmaWx0ZXJVbml0cz0ib2JqZWN0Qm91bmRpbmdCb3giIGlkPSJmaWx0ZXItNCI+CiAgICAgICAgICAgIDxmZU9mZnNldCBkeD0iMCIgZHk9IjEiIGluPSJTb3VyY2VBbHBoYSIgcmVzdWx0PSJzaGFkb3dPZmZzZXRPdXRlcjEiPjwvZmVPZmZzZXQ+CiAgICAgICAgICAgIDxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249IjQiIGluPSJzaGFkb3dPZmZzZXRPdXRlcjEiIHJlc3VsdD0ic2hhZG93Qmx1ck91dGVyMSI+PC9mZUdhdXNzaWFuQmx1cj4KICAgICAgICAgICAgPGZlQ29sb3JNYXRyaXggdmFsdWVzPSIwIDAgMCAwIDAuMiAgIDAgMCAwIDAgMC4yICAgMCAwIDAgMCAwLjIgIDAgMCAwIDAuMiAwIiB0eXBlPSJtYXRyaXgiIGluPSJzaGFkb3dCbHVyT3V0ZXIxIiByZXN1bHQ9InNoYWRvd01hdHJpeE91dGVyMSI+PC9mZUNvbG9yTWF0cml4PgogICAgICAgICAgICA8ZmVNb3JwaG9sb2d5IHJhZGl1cz0iMSIgb3BlcmF0b3I9ImVyb2RlIiBpbj0iU291cmNlQWxwaGEiIHJlc3VsdD0ic2hhZG93U3ByZWFkT3V0ZXIyIj48L2ZlTW9ycGhvbG9neT4KICAgICAgICAgICAgPGZlT2Zmc2V0IGR4PSIwIiBkeT0iMyIgaW49InNoYWRvd1NwcmVhZE91dGVyMiIgcmVzdWx0PSJzaGFkb3dPZmZzZXRPdXRlcjIiPjwvZmVPZmZzZXQ+CiAgICAgICAgICAgIDxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249IjEuNSIgaW49InNoYWRvd09mZnNldE91dGVyMiIgcmVzdWx0PSJzaGFkb3dCbHVyT3V0ZXIyIj48L2ZlR2F1c3NpYW5CbHVyPgogICAgICAgICAgICA8ZmVDb2xvck1hdHJpeCB2YWx1ZXM9IjAgMCAwIDAgMC4yICAgMCAwIDAgMCAwLjIgICAwIDAgMCAwIDAuMiAgMCAwIDAgMC4xMiAwIiB0eXBlPSJtYXRyaXgiIGluPSJzaGFkb3dCbHVyT3V0ZXIyIiByZXN1bHQ9InNoYWRvd01hdHJpeE91dGVyMiI+PC9mZUNvbG9yTWF0cml4PgogICAgICAgICAgICA8ZmVPZmZzZXQgZHg9IjAiIGR5PSIzIiBpbj0iU291cmNlQWxwaGEiIHJlc3VsdD0ic2hhZG93T2Zmc2V0T3V0ZXIzIj48L2ZlT2Zmc2V0PgogICAgICAgICAgICA8ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSIyIiBpbj0ic2hhZG93T2Zmc2V0T3V0ZXIzIiByZXN1bHQ9InNoYWRvd0JsdXJPdXRlcjMiPjwvZmVHYXVzc2lhbkJsdXI+CiAgICAgICAgICAgIDxmZUNvbG9yTWF0cml4IHZhbHVlcz0iMCAwIDAgMCAwLjIgICAwIDAgMCAwIDAuMiAgIDAgMCAwIDAgMC4yICAwIDAgMCAwLjE0IDAiIHR5cGU9Im1hdHJpeCIgaW49InNoYWRvd0JsdXJPdXRlcjMiIHJlc3VsdD0ic2hhZG93TWF0cml4T3V0ZXIzIj48L2ZlQ29sb3JNYXRyaXg+CiAgICAgICAgICAgIDxmZU1lcmdlPgogICAgICAgICAgICAgICAgPGZlTWVyZ2VOb2RlIGluPSJzaGFkb3dNYXRyaXhPdXRlcjEiPjwvZmVNZXJnZU5vZGU+CiAgICAgICAgICAgICAgICA8ZmVNZXJnZU5vZGUgaW49InNoYWRvd01hdHJpeE91dGVyMiI+PC9mZU1lcmdlTm9kZT4KICAgICAgICAgICAgICAgIDxmZU1lcmdlTm9kZSBpbj0ic2hhZG93TWF0cml4T3V0ZXIzIj48L2ZlTWVyZ2VOb2RlPgogICAgICAgICAgICA8L2ZlTWVyZ2U+CiAgICAgICAgPC9maWx0ZXI+CiAgICAgICAgPHJlY3QgaWQ9InBhdGgtNSIgeD0iMCIgeT0iMCIgd2lkdGg9Ijk3OSIgaGVpZ2h0PSI0MDAiIHJ4PSI4Ij48L3JlY3Q+CiAgICAgICAgPGxpbmVhckdyYWRpZW50IHgxPSIzNy4xMDczNjM5JSIgeTE9Ijk5LjYzMTcxNjMlIiB4Mj0iNDMuNDM0MTk4NCUiIHkyPSIyNC4wNTg1MzI4JSIgaWQ9ImxpbmVhckdyYWRpZW50LTciPgogICAgICAgICAgICA8c3RvcCBzdG9wLWNvbG9yPSIjMDAwMDAwIiBvZmZzZXQ9IjAuMDczOTAyMDI3JSI+PC9zdG9wPgogICAgICAgICAgICA8c3RvcCBzdG9wLWNvbG9yPSIjMDAwMDAwIiBzdG9wLW9wYWNpdHk9IjAiIG9mZnNldD0iMTAwJSI+PC9zdG9wPgogICAgICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICAgICAgPGxpbmVhckdyYWRpZW50IHgxPSI0Mi4wMDA2OTE5JSIgeTE9IjYuMjEwMDc0MDQlIiB4Mj0iMTA0LjI4Mjc5OCUiIHkyPSI2NC45MjAxNDc3JSIgaWQ9ImxpbmVhckdyYWRpZW50LTgiPgogICAgICAgICAgICA8c3RvcCBzdG9wLWNvbG9yPSIjMDAwMDAwIiBzdG9wLW9wYWNpdHk9IjAiIG9mZnNldD0iMCUiPjwvc3RvcD4KICAgICAgICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iIzAwMDAwMCIgb2Zmc2V0PSI5OS45MjYwOTglIj48L3N0b3A+CiAgICAgICAgICAgIDxzdG9wIHN0b3AtY29sb3I9IiMwMDAwMDAiIG9mZnNldD0iMTAwJSI+PC9zdG9wPgogICAgICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8L2RlZnM+CiAgICA8ZyBpZD0iQ09NUE9ORU5UUyIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9IkNPTVBPTkVOVFMvRFMvQmFubmVyL0luLWV2aWRlbnphLTk3OXg0MDAtdjIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAuMDAwMDAwLCAxLjAwMDAwMCkiPgogICAgICAgICAgICA8ZyBpZD0iQmFubmVyLTEwOTB4Mzg0LWltZy1yb3NzaS10b3NjYW5pIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNy4wMDAwMDAsIC00NDMuMzE2MjgyKSI+CiAgICAgICAgICAgICAgICA8ZyBpZD0iR3JvdXAtMyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNy4wMDAwMDAsIDQ0Mi44NjIxNTApIj4KICAgICAgICAgICAgICAgICAgICA8bWFzayBpZD0ibWFzay0yIiBmaWxsPSJ3aGl0ZSI+CiAgICAgICAgICAgICAgICAgICAgICAgIDx1c2UgeGxpbms6aHJlZj0iI3BhdGgtMSI+PC91c2U+CiAgICAgICAgICAgICAgICAgICAgPC9tYXNrPgogICAgICAgICAgICAgICAgICAgIDx1c2UgaWQ9IlBhdGgiIGZpbGw9IiM5OTI2NDUiIHhsaW5rOmhyZWY9IiNwYXRoLTEiPjwvdXNlPgogICAgICAgICAgICAgICAgICAgIDxnIGlkPSJHcm91cCIgbWFzaz0idXJsKCNtYXNrLTIpIj4KICAgICAgICAgICAgICAgICAgICAgICAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMC4wMDAwMDAsIDAuNDU0MTMyKSI+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZyBpZD0iUmVjdGFuZ2xlIiBzdHJva2U9Im5vbmUiIGZpbGw9Im5vbmUiIG9wYWNpdHk9IjAuNiIgZmlsbC1vcGFjaXR5PSIxIj4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dXNlIGZpbGw9ImJsYWNrIiBmaWx0ZXI9InVybCgjZmlsdGVyLTQpIiB4bGluazpocmVmPSIjcGF0aC0zIj48L3VzZT4KICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxtYXNrIGlkPSJtYXNrLTYiIGZpbGw9IndoaXRlIj4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dXNlIHhsaW5rOmhyZWY9IiNwYXRoLTUiPjwvdXNlPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9tYXNrPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgPHVzZSBpZD0iUmVjdGFuZ2xlIiBzdHJva2U9Im5vbmUiIGZpbGw9IiM5OTI2NDUiIGZpbGwtcnVsZT0iZXZlbm9kZCIgeGxpbms6aHJlZj0iI3BhdGgtNSI+PC91c2U+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZWxsaXBzZSBpZD0iT3ZhbC1Db3B5LTMiIHN0cm9rZT0ibm9uZSIgZmlsbD0idXJsKCNsaW5lYXJHcmFkaWVudC03KSIgZmlsbC1ydWxlPSJldmVub2RkIiBvcGFjaXR5PSIwLjE5OTI0MjcyOCIgbWFzaz0idXJsKCNtYXNrLTYpIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0NjIuNDY4NDk4LCAtMTc2LjEwODczMCkgcm90YXRlKDk2LjAwMDAwMCkgdHJhbnNsYXRlKC00NjIuNDY4NDk4LCAxNzYuMTA4NzMwKSAiIGN4PSI0NjIuNDY4NDk4IiBjeT0iLTE3Ni4xMDg3MyIgcng9IjQ0MiIgcnk9Ijg2NCI+PC9lbGxpcHNlPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgPGVsbGlwc2UgaWQ9Ik92YWwtQ29weS0zIiBzdHJva2U9Im5vbmUiIGZpbGw9InVybCgjbGluZWFyR3JhZGllbnQtNykiIGZpbGwtcnVsZT0iZXZlbm9kZCIgb3BhY2l0eT0iMC4xOTkyNDI3MjgiIG1hc2s9InVybCgjbWFzay02KSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTY1LjUzMTUwMiwgLTcyLjEwODczMCkgcm90YXRlKDY2LjAwMDAwMCkgdHJhbnNsYXRlKDY1LjUzMTUwMiwgNzIuMTA4NzMwKSAiIGN4PSItNjUuNTMxNTAxNiIgY3k9Ii03Mi4xMDg3MyIgcng9IjQ0MiIgcnk9Ijg2NCI+PC9lbGxpcHNlPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgPGNpcmNsZSBpZD0iT3ZhbC1Db3B5LTQiIHN0cm9rZT0ibm9uZSIgZmlsbD0idXJsKCNsaW5lYXJHcmFkaWVudC04KSIgZmlsbC1ydWxlPSJldmVub2RkIiBvcGFjaXR5PSIwLjE5OTI0MjcyOCIgbWFzaz0idXJsKCNtYXNrLTYpIiBjeD0iNDE5LjUiIGN5PSIyNTkiIHI9IjIxMSI+PC9jaXJjbGU+CiAgICAgICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg=='

    const { fetch } = useFetch(async ({ $cmwRepo }) => {
      await $cmwRepo.prismic.getSingle('home-featured')
        .then((data) => {
          const {
            featured,
            label,
          } = data
          slides.value = featured as ISlide[]
          title.value = label as string
        })
    })

    const setArrow = () => {
      let slider: HTMLDivElement | null = null
      setTimeout(() => {
        if (wrapperEl.value) { slider = wrapperEl.value.querySelector('.carousel-3d-slider') }

        if (slider) {
          arrowPos.value = `${((slider?.getBoundingClientRect().right || 10) + 40)}px`
        }
      }, 200)
    }

    const resizeListener = debounce(() => setArrow(), 400)

    onMounted(() => {
      window.addEventListener('resize', resizeListener)
      setArrow()
    })

    onUnmounted(() => {
      window.removeEventListener('resize', resizeListener)
    })

    return {
      arrowPos,
      fetch,
      mask,
      setArrow,
      slides,
      title,
      wrapperEl,
    }
  },
  methods: { generateKey },
}
</script>

<template>
  <div ref="wrapperEl" class="my-5">
    <h2 class="text-center" v-text="title" />
    <ClientOnly v-if="!!slides.length" placeholder="Loading...">
      <carousel-3d
        :controls-visible="true"
        :width="1100"
        :height="450"
        :autoplay="true"
        :autoplay-timeout="3000"
        :clickable="true"
        class="relative"
      >
        <slide
          v-for="(slide, i) in slides"
          :key="generateKey(slide.title)"
          :index="i"
          style="border-radius: 10px; border: none"
        >
          <div
            class="relative h-full w-full p-4 text-white slide-content"
            :style="{
              background: `url(${mask}),url('${slide.image.url}')`,
            }"
          >
            <NuxtLink :to="slide.link" class="block h3 mt-4 max-w-[30%]">
              <span class="text-white">{{ slide.title }}</span>
            </NuxtLink>

            <CmwButton :to="slide.link" variant="ghost-inverse" class="w-max absolute bottom-6">
              {{ slide.cta }}
            </CmwButton>
          </div>
          <div class="w-full loader" />
        </slide>
      </carousel-3d>
    </ClientOnly>
  </div>
</template>

<style scoped>
.loader {
  position: absolute;
  background: #ddd;
  height: 8px;
  bottom: -2px;
  z-index: 1000;
}

.loader::after {
  position: absolute;
  content: "";
  height: 8px;
  top: 0;
  left: 0;
}

@keyframes fill {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}

:deep(.carousel-3d-controls .prev) {
  display: none;
}

:deep(.carousel-3d-controls .next) {
  background-color: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  color: #da4865;
  left: v-bind(arrowPos);
  transform: translateX(calc(-100% - 20px))
}

:deep(.carousel-3d-controls .next) span {
  margin: auto;
  line-height: 30px;
  font-size: 40px;
  font-family: 'Open Sans',serif;
  height: 34px;
}

:deep(.carousel-3d-slide.current .loader::after) {
  background: #da4865;
  animation-name: fill;
  animation-duration: 3000ms;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
}

:deep(.carousel-3d-slide.left-1) {
  transform: translateX(200px) translateZ(-400px) rotateY(-35deg) !important;
}
:deep(.carousel-3d-slide.left-2) {
  transform: translateX(250px) translateZ(-400px) rotateY(-35deg) !important;
}

:deep(.carousel-3d-slide.right-1) {
  transform: translateX(250px) translateZ(-400px) rotateY(-35deg) !important;
}
:deep(.carousel-3d-slide.right-2) {
  transform: translateX(250px) translateZ(-400px) rotateY(-35deg) !important;
}

.slide-content {
  background-position: left, center !important;
  background-size: contain, cover !important;
  background-repeat: no-repeat, no-repeat !important;
  border-radius: 10px;
}
</style>
