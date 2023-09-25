<script lang="ts">
import type { Ref } from '@nuxtjs/composition-api'
import { computed, defineComponent, inject, ref, useFetch } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    const isTablet = inject('isTablet') as Ref<boolean>
    const contents = ref(null)
    const mask = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMzEzcHgiIGhlaWdodD0iMzY0cHgiIHZpZXdCb3g9IjAgMCAzMTMgMzY0IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPHRpdGxlPk1hc2NoZXJhX3Jvc3NhX0RTXzMxM0AxPC90aXRsZT4KICAgIDxkZWZzPgogICAgICAgIDxwYXRoIGQ9Ik0wLDAgQzYyLjU0ODIxODcsNzUuNDQzNTczMiAxNTYuOTgyMDksMTIzLjQ5NjUwNCAyNjIuNjM5MzI0LDEyMy40OTY1MDQgQzI3OS40MDIwMzksMTIzLjQ5NjUwNCAyOTUuODgyMjU4LDEyMi4yODY5OTIgMzExLjk5NzQ2OCwxMTkuOTUwNDggTDMxMi42MTgxODUsMzU1LjQ3NTQyMSBDMzEyLjYyOTgyOSwzNTkuODkzNjgzIDMwOS4wNTc1NTksMzYzLjQ4NDgzMiAzMDQuNjM5Mjk2LDM2My40OTY0NzYgQzMwNC42MzIyNjgsMzYzLjQ5NjQ5NSAzMDQuNjI1MjQsMzYzLjQ5NjUwNCAzMDQuNjE4MjEyLDM2My40OTY1MDQgTDgsMzYzLjQ5NjUwNCBDMy41ODE3MjIsMzYzLjQ5NjUwNCA1LjQxMDgzMDAxZS0xNiwzNTkuOTE0NzgyIDAsMzU1LjQ5NjUwNCBMMCwwIEwwLDAgWiIgaWQ9InBhdGgtMSI+PC9wYXRoPgogICAgICAgIDxsaW5lYXJHcmFkaWVudCB4MT0iMzcuMTA3MzYzOSUiIHkxPSI5OS42MzE3MTYzJSIgeDI9IjQzLjQzNDE5ODQlIiB5Mj0iMjQuMDU4NTMyOCUiIGlkPSJsaW5lYXJHcmFkaWVudC0zIj4KICAgICAgICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iIzAwMDAwMCIgb2Zmc2V0PSIwLjA3MzkwMjAyNyUiPjwvc3RvcD4KICAgICAgICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iIzAwMDAwMCIgc3RvcC1vcGFjaXR5PSIwIiBvZmZzZXQ9IjEwMCUiPjwvc3RvcD4KICAgICAgICA8L2xpbmVhckdyYWRpZW50PgogICAgICAgIDxsaW5lYXJHcmFkaWVudCB4MT0iNDIuMDAwNjkxOSUiIHkxPSI2LjIxMDA3NDA0JSIgeDI9IjEwNC4yODI3OTglIiB5Mj0iNjQuOTIwMTQ3NyUiIGlkPSJsaW5lYXJHcmFkaWVudC00Ij4KICAgICAgICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iIzAwMDAwMCIgc3RvcC1vcGFjaXR5PSIwIiBvZmZzZXQ9IjAlIj48L3N0b3A+CiAgICAgICAgICAgIDxzdG9wIHN0b3AtY29sb3I9IiMwMDAwMDAiIG9mZnNldD0iOTkuOTI2MDk4JSI+PC9zdG9wPgogICAgICAgICAgICA8c3RvcCBzdG9wLWNvbG9yPSIjMDAwMDAwIiBvZmZzZXQ9IjEwMCUiPjwvc3RvcD4KICAgICAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPC9kZWZzPgogICAgPGcgaWQ9IkNPTVBPTkVOVFMiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJDT01QT05FTlRTL0RTL0Jhbm5lci9QYXJ0bmVyLTMxM3g0MDAtdjIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAuMDAwMDAwLCAtMzYuMDAwMDAwKSI+CiAgICAgICAgICAgIDxnIGlkPSJCYW5uZXItMzEzeDQwMC1ydWJlc2NvLXNjb250b3JubyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTc4LjAwMDAwMCwgLTUyMi4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxnIGlkPSJNYXNjaGVyYV9yb3NzYV9EU18zMTMiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDc4LjM2MDY3NiwgNTU4LjUwMzQ5NikiPgogICAgICAgICAgICAgICAgICAgIDxtYXNrIGlkPSJtYXNrLTIiIGZpbGw9IndoaXRlIj4KICAgICAgICAgICAgICAgICAgICAgICAgPHVzZSB4bGluazpocmVmPSIjcGF0aC0xIj48L3VzZT4KICAgICAgICAgICAgICAgICAgICA8L21hc2s+CiAgICAgICAgICAgICAgICAgICAgPHVzZSBpZD0iUGF0aCIgZmlsbD0iI0ZGMTdGQSIgeGxpbms6aHJlZj0iI3BhdGgtMSI+PC91c2U+CiAgICAgICAgICAgICAgICAgICAgPHJlY3QgaWQ9IlJlY3RhbmdsZS1Db3B5LTMiIGZpbGw9IiM5OTI2NDUiIG1hc2s9InVybCgjbWFzay0yKSIgeD0iLTAuMzYwNjc2MTQ0IiB5PSItMzYuNTAzNDk1OCIgd2lkdGg9IjMxMyIgaGVpZ2h0PSI0MDAiIHJ4PSI4Ij48L3JlY3Q+CiAgICAgICAgICAgICAgICAgICAgPGcgaWQ9Ikdyb3VwLTQiIG1hc2s9InVybCgjbWFzay0yKSIgb3BhY2l0eT0iMC4xOTkyNDI3MjgiPgogICAgICAgICAgICAgICAgICAgICAgICA8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTAzNy4zNjA2NzYsIC04NDcuNTAzNDk2KSI+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZWxsaXBzZSBpZD0iT3ZhbC1Db3B5LTMiIGZpbGw9InVybCgjbGluZWFyR3JhZGllbnQtMykiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE0OTcuMDgwODcyLCA2NTEuMjA3NTUyKSByb3RhdGUoOTYuMDAwMDAwKSB0cmFuc2xhdGUoLTE0OTcuMDgwODcyLCAtNjUxLjIwNzU1MikgIiBjeD0iMTQ5Ny4wODA4NyIgY3k9IjY1MS4yMDc1NTIiIHJ4PSI0NDIiIHJ5PSI4NjQiPjwvZWxsaXBzZT4KICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxlbGxpcHNlIGlkPSJPdmFsLUNvcHktMyIgZmlsbD0idXJsKCNsaW5lYXJHcmFkaWVudC0zKSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoOTY5LjA4MDg3MiwgNzU1LjIwNzU1Mikgcm90YXRlKDY2LjAwMDAwMCkgdHJhbnNsYXRlKC05NjkuMDgwODcyLCAtNzU1LjIwNzU1MikgIiBjeD0iOTY5LjA4MDg3MiIgY3k9Ijc1NS4yMDc1NTIiIHJ4PSI0NDIiIHJ5PSI4NjQiPjwvZWxsaXBzZT4KICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxjaXJjbGUgaWQ9Ik92YWwtQ29weS00IiBmaWxsPSJ1cmwoI2xpbmVhckdyYWRpZW50LTQpIiBjeD0iMTQ1NC4xMTIzNyIgY3k9IjEwODYuMzE2MjgiIHI9IjIxMSI+PC9jaXJjbGU+CiAgICAgICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg=='
    const mask_left = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iNTQwcHgiIGhlaWdodD0iNDAycHgiIHZpZXdCb3g9IjAgMCA1NDAgNDAyIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPHRpdGxlPkdyb3VwIDNAMTwvdGl0bGU+CiAgICA8ZGVmcz4KICAgICAgICA8cGF0aCBkPSJNMzMzLjMwNjMxLDAgQzMzMy4xMDI2ODksNS42MjYyMjE5NCAzMzMsMTEuMjc4MTg0NiAzMzMsMTYuOTU0MTMxNSBDMzMzLDE3Ny4yMjcyNTYgNDE0Ljg3ODA2MywzMTguMzc2NzM0IDUzOS4wODczLDQwMC44NTU2NzkgTDAsNDAwLjg1NTY3OSBMMCwwLjQ1NDEzMTUxIEwzMzMuMzA2MzEsMCBaIiBpZD0icGF0aC0xIj48L3BhdGg+CiAgICAgICAgPHJlY3QgaWQ9InBhdGgtMyIgeD0iMCIgeT0iMCIgd2lkdGg9Ijk3OSIgaGVpZ2h0PSI0MDAiIHJ4PSI4Ij48L3JlY3Q+CiAgICAgICAgPGZpbHRlciB4PSItMS4zJSIgeT0iLTIuOSUiIHdpZHRoPSIxMDIuNiUiIGhlaWdodD0iMTA2LjIlIiBmaWx0ZXJVbml0cz0ib2JqZWN0Qm91bmRpbmdCb3giIGlkPSJmaWx0ZXItNCI+CiAgICAgICAgICAgIDxmZU9mZnNldCBkeD0iMCIgZHk9IjEiIGluPSJTb3VyY2VBbHBoYSIgcmVzdWx0PSJzaGFkb3dPZmZzZXRPdXRlcjEiPjwvZmVPZmZzZXQ+CiAgICAgICAgICAgIDxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249IjQiIGluPSJzaGFkb3dPZmZzZXRPdXRlcjEiIHJlc3VsdD0ic2hhZG93Qmx1ck91dGVyMSI+PC9mZUdhdXNzaWFuQmx1cj4KICAgICAgICAgICAgPGZlQ29sb3JNYXRyaXggdmFsdWVzPSIwIDAgMCAwIDAuMiAgIDAgMCAwIDAgMC4yICAgMCAwIDAgMCAwLjIgIDAgMCAwIDAuMiAwIiB0eXBlPSJtYXRyaXgiIGluPSJzaGFkb3dCbHVyT3V0ZXIxIiByZXN1bHQ9InNoYWRvd01hdHJpeE91dGVyMSI+PC9mZUNvbG9yTWF0cml4PgogICAgICAgICAgICA8ZmVNb3JwaG9sb2d5IHJhZGl1cz0iMSIgb3BlcmF0b3I9ImVyb2RlIiBpbj0iU291cmNlQWxwaGEiIHJlc3VsdD0ic2hhZG93U3ByZWFkT3V0ZXIyIj48L2ZlTW9ycGhvbG9neT4KICAgICAgICAgICAgPGZlT2Zmc2V0IGR4PSIwIiBkeT0iMyIgaW49InNoYWRvd1NwcmVhZE91dGVyMiIgcmVzdWx0PSJzaGFkb3dPZmZzZXRPdXRlcjIiPjwvZmVPZmZzZXQ+CiAgICAgICAgICAgIDxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249IjEuNSIgaW49InNoYWRvd09mZnNldE91dGVyMiIgcmVzdWx0PSJzaGFkb3dCbHVyT3V0ZXIyIj48L2ZlR2F1c3NpYW5CbHVyPgogICAgICAgICAgICA8ZmVDb2xvck1hdHJpeCB2YWx1ZXM9IjAgMCAwIDAgMC4yICAgMCAwIDAgMCAwLjIgICAwIDAgMCAwIDAuMiAgMCAwIDAgMC4xMiAwIiB0eXBlPSJtYXRyaXgiIGluPSJzaGFkb3dCbHVyT3V0ZXIyIiByZXN1bHQ9InNoYWRvd01hdHJpeE91dGVyMiI+PC9mZUNvbG9yTWF0cml4PgogICAgICAgICAgICA8ZmVPZmZzZXQgZHg9IjAiIGR5PSIzIiBpbj0iU291cmNlQWxwaGEiIHJlc3VsdD0ic2hhZG93T2Zmc2V0T3V0ZXIzIj48L2ZlT2Zmc2V0PgogICAgICAgICAgICA8ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSIyIiBpbj0ic2hhZG93T2Zmc2V0T3V0ZXIzIiByZXN1bHQ9InNoYWRvd0JsdXJPdXRlcjMiPjwvZmVHYXVzc2lhbkJsdXI+CiAgICAgICAgICAgIDxmZUNvbG9yTWF0cml4IHZhbHVlcz0iMCAwIDAgMCAwLjIgICAwIDAgMCAwIDAuMiAgIDAgMCAwIDAgMC4yICAwIDAgMCAwLjE0IDAiIHR5cGU9Im1hdHJpeCIgaW49InNoYWRvd0JsdXJPdXRlcjMiIHJlc3VsdD0ic2hhZG93TWF0cml4T3V0ZXIzIj48L2ZlQ29sb3JNYXRyaXg+CiAgICAgICAgICAgIDxmZU1lcmdlPgogICAgICAgICAgICAgICAgPGZlTWVyZ2VOb2RlIGluPSJzaGFkb3dNYXRyaXhPdXRlcjEiPjwvZmVNZXJnZU5vZGU+CiAgICAgICAgICAgICAgICA8ZmVNZXJnZU5vZGUgaW49InNoYWRvd01hdHJpeE91dGVyMiI+PC9mZU1lcmdlTm9kZT4KICAgICAgICAgICAgICAgIDxmZU1lcmdlTm9kZSBpbj0ic2hhZG93TWF0cml4T3V0ZXIzIj48L2ZlTWVyZ2VOb2RlPgogICAgICAgICAgICA8L2ZlTWVyZ2U+CiAgICAgICAgPC9maWx0ZXI+CiAgICAgICAgPHJlY3QgaWQ9InBhdGgtNSIgeD0iMCIgeT0iMCIgd2lkdGg9Ijk3OSIgaGVpZ2h0PSI0MDAiIHJ4PSI4Ij48L3JlY3Q+CiAgICAgICAgPGxpbmVhckdyYWRpZW50IHgxPSIzNy4xMDczNjM5JSIgeTE9Ijk5LjYzMTcxNjMlIiB4Mj0iNDMuNDM0MTk4NCUiIHkyPSIyNC4wNTg1MzI4JSIgaWQ9ImxpbmVhckdyYWRpZW50LTciPgogICAgICAgICAgICA8c3RvcCBzdG9wLWNvbG9yPSIjMDAwMDAwIiBvZmZzZXQ9IjAuMDczOTAyMDI3JSI+PC9zdG9wPgogICAgICAgICAgICA8c3RvcCBzdG9wLWNvbG9yPSIjMDAwMDAwIiBzdG9wLW9wYWNpdHk9IjAiIG9mZnNldD0iMTAwJSI+PC9zdG9wPgogICAgICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICAgICAgPGxpbmVhckdyYWRpZW50IHgxPSI0Mi4wMDA2OTE5JSIgeTE9IjYuMjEwMDc0MDQlIiB4Mj0iMTA0LjI4Mjc5OCUiIHkyPSI2NC45MjAxNDc3JSIgaWQ9ImxpbmVhckdyYWRpZW50LTgiPgogICAgICAgICAgICA8c3RvcCBzdG9wLWNvbG9yPSIjMDAwMDAwIiBzdG9wLW9wYWNpdHk9IjAiIG9mZnNldD0iMCUiPjwvc3RvcD4KICAgICAgICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iIzAwMDAwMCIgb2Zmc2V0PSI5OS45MjYwOTglIj48L3N0b3A+CiAgICAgICAgICAgIDxzdG9wIHN0b3AtY29sb3I9IiMwMDAwMDAiIG9mZnNldD0iMTAwJSI+PC9zdG9wPgogICAgICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8L2RlZnM+CiAgICA8ZyBpZD0iQ09NUE9ORU5UUyIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9IkNPTVBPTkVOVFMvRFMvQmFubmVyL0luLWV2aWRlbnphLTk3OXg0MDAtdjIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAuMDAwMDAwLCAxLjAwMDAwMCkiPgogICAgICAgICAgICA8ZyBpZD0iQmFubmVyLTEwOTB4Mzg0LWltZy1yb3NzaS10b3NjYW5pIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNy4wMDAwMDAsIC00NDMuMzE2MjgyKSI+CiAgICAgICAgICAgICAgICA8ZyBpZD0iR3JvdXAtMyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNy4wMDAwMDAsIDQ0Mi44NjIxNTApIj4KICAgICAgICAgICAgICAgICAgICA8bWFzayBpZD0ibWFzay0yIiBmaWxsPSJ3aGl0ZSI+CiAgICAgICAgICAgICAgICAgICAgICAgIDx1c2UgeGxpbms6aHJlZj0iI3BhdGgtMSI+PC91c2U+CiAgICAgICAgICAgICAgICAgICAgPC9tYXNrPgogICAgICAgICAgICAgICAgICAgIDx1c2UgaWQ9IlBhdGgiIGZpbGw9IiM5OTI2NDUiIHhsaW5rOmhyZWY9IiNwYXRoLTEiPjwvdXNlPgogICAgICAgICAgICAgICAgICAgIDxnIGlkPSJHcm91cCIgbWFzaz0idXJsKCNtYXNrLTIpIj4KICAgICAgICAgICAgICAgICAgICAgICAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMC4wMDAwMDAsIDAuNDU0MTMyKSI+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZyBpZD0iUmVjdGFuZ2xlIiBzdHJva2U9Im5vbmUiIGZpbGw9Im5vbmUiIG9wYWNpdHk9IjAuNiIgZmlsbC1vcGFjaXR5PSIxIj4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dXNlIGZpbGw9ImJsYWNrIiBmaWx0ZXI9InVybCgjZmlsdGVyLTQpIiB4bGluazpocmVmPSIjcGF0aC0zIj48L3VzZT4KICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxtYXNrIGlkPSJtYXNrLTYiIGZpbGw9IndoaXRlIj4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dXNlIHhsaW5rOmhyZWY9IiNwYXRoLTUiPjwvdXNlPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9tYXNrPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgPHVzZSBpZD0iUmVjdGFuZ2xlIiBzdHJva2U9Im5vbmUiIGZpbGw9IiM5OTI2NDUiIGZpbGwtcnVsZT0iZXZlbm9kZCIgeGxpbms6aHJlZj0iI3BhdGgtNSI+PC91c2U+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZWxsaXBzZSBpZD0iT3ZhbC1Db3B5LTMiIHN0cm9rZT0ibm9uZSIgZmlsbD0idXJsKCNsaW5lYXJHcmFkaWVudC03KSIgZmlsbC1ydWxlPSJldmVub2RkIiBvcGFjaXR5PSIwLjE5OTI0MjcyOCIgbWFzaz0idXJsKCNtYXNrLTYpIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0NjIuNDY4NDk4LCAtMTc2LjEwODczMCkgcm90YXRlKDk2LjAwMDAwMCkgdHJhbnNsYXRlKC00NjIuNDY4NDk4LCAxNzYuMTA4NzMwKSAiIGN4PSI0NjIuNDY4NDk4IiBjeT0iLTE3Ni4xMDg3MyIgcng9IjQ0MiIgcnk9Ijg2NCI+PC9lbGxpcHNlPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgPGVsbGlwc2UgaWQ9Ik92YWwtQ29weS0zIiBzdHJva2U9Im5vbmUiIGZpbGw9InVybCgjbGluZWFyR3JhZGllbnQtNykiIGZpbGwtcnVsZT0iZXZlbm9kZCIgb3BhY2l0eT0iMC4xOTkyNDI3MjgiIG1hc2s9InVybCgjbWFzay02KSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTY1LjUzMTUwMiwgLTcyLjEwODczMCkgcm90YXRlKDY2LjAwMDAwMCkgdHJhbnNsYXRlKDY1LjUzMTUwMiwgNzIuMTA4NzMwKSAiIGN4PSItNjUuNTMxNTAxNiIgY3k9Ii03Mi4xMDg3MyIgcng9IjQ0MiIgcnk9Ijg2NCI+PC9lbGxpcHNlPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgPGNpcmNsZSBpZD0iT3ZhbC1Db3B5LTQiIHN0cm9rZT0ibm9uZSIgZmlsbD0idXJsKCNsaW5lYXJHcmFkaWVudC04KSIgZmlsbC1ydWxlPSJldmVub2RkIiBvcGFjaXR5PSIwLjE5OTI0MjcyOCIgbWFzaz0idXJsKCNtYXNrLTYpIiBjeD0iNDE5LjUiIGN5PSIyNTkiIHI9IjIxMSI+PC9jaXJjbGU+CiAgICAgICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg=='
    const pageData = ref<Record<string, any>[] | undefined>([])
    const label = ref(null)

    useFetch(async ({ $cmwRepo }) => {
      await $cmwRepo.prismic.getSingle('partners')
        .then((data) => {
          pageData.value = data.body && data.body.map(el => ({
            id: el.id,
            content: el.items[0],
          }))
          label.value = data.body && data.body[0].primary.label
        })
    })

    const urlBg01 = computed(() => {
      const content = pageData.value && pageData.value[0]?.content
      if (!content)
        return ''
      return isTablet.value ? content.image.url : content.image.mobile?.url
    })

    const urlBg02 = computed(() => {
      const content = pageData.value && pageData.value[1]?.content
      if (!content)
        return ''
      return isTablet.value ? content.image.url : content.image.mobile?.url
    })

    return {
      contents,
      label,
      mask,
      mask_left,
      pageData,
      urlBg01,
      urlBg02,
    }
  },
})
</script>

<template>
  <div v-if="pageData" class="max-w-screen-desktop mx-auto my-4">
    <div class="h2 text-center py-4" v-text="label" />
    <div class="grid gap-4 md:(grid-cols-[8fr_4fr])">
      <div
        v-if="pageData[0]?.content"
        class="partners-first h-[400px] p-6 text-white flex flex-col justify-end"
        :style="{
          backgroundImage: `url(${mask_left}),url('${urlBg01}')`,
        }"
      >
        <div class="h3 w-7/12 mb-6 leading-tight">
          <NuxtLink class="text-white" :to="pageData[0].content.cta_link">
            {{ pageData[0].content.main_text }}
          </NuxtLink>
        </div>
        <Button
          class="w-max"
          variant="ghost-inverse"
          :to="pageData[0].content.cta_link"
          :label="pageData[0].content.cta_text"
        />
      </div>
      <div
        v-if="pageData[1]?.content"
        class="partners-last h-[400px] p-6 text-white flex flex-col justify-end"
        :style="{
          backgroundImage: `url(${mask}), url('${urlBg02}')`,
        }"
      >
        <div class="h3 w-3/4 mb-6 leading-tight">
          <NuxtLink class="text-white" :to="pageData[1].content.cta_link">
            {{ pageData[1].content.main_text }}
          </NuxtLink>
        </div>
        <div>
          <Button
            class="w-max"
            variant="ghost-inverse"
            :to="pageData[1].content.cta_link"
            :label="pageData[1].content.cta_text"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.partners-first {
  background-size: cover;
  background-position: -150px, center;
  background-repeat: no-repeat;
  border-radius: 0 0 10px 10px;
}
.partners-last {
  background-size: cover;
  background-position: 0 60px, center, center;
  background-repeat: no-repeat;
  border-radius: 0 0 10px 10px;
}
</style>
