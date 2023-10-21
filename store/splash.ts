import { defineStore } from 'pinia'

interface IState {
  currentSplash: string
  title: string
  subtitle: string
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
