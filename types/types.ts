import type { TranslateResult } from 'vue-i18n'

export type TSizes = 'xs' | 'sm' | 'md' | 'lg'
export type TPosition = 'left' | 'center' | 'right' | 'unset'
export type TButtonVariant = 'default' | 'default-inverse' | 'ghost' | 'ghost-inverse' | 'text'
export type TColors = 'primary' | 'secondary' | 'secondary-400'
export type TShapes = 'rounded' | 'pill'
export type TContextual = 'success' | 'error' | 'warning' | 'info'

export type ObjType<T> = {
  [key in KeyType]: T;
}

export interface TImage {
  altText: string
  height: number
  id?: string
  url: string
  width: number
}

export interface IOptions {
  disabled?: boolean
  icon?: string
  label: TranslateResult
  selected?: boolean
  value: string
}
