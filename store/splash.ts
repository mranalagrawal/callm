import { defineStore } from 'pinia'
import type { TranslateResult } from 'vue-i18n'

interface IState {
  currentSplash: string
  title: TranslateResult
  subtitle: TranslateResult
  size: string
  localData: string
  onBeforeCloseModal: any
}

export const useSplash = defineStore({
  id: 'splash',
  state: () => <IState>({
    currentSplash: '',
    title: '',
    subtitle: '',
    size: '',
    localData: '',
    onBeforeCloseModal: undefined,
  }),
})
